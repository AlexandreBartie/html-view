import { Collection } from './webCollection';
import { DataOptions } from './webData';
import { WebElement } from './webElements';

export enum elementType {
  LabelBox = 'LabelBox',
  TextBox = 'TextBox',
  DataBox = 'DataBox',
  ComboBox = 'ComboBox',
  ListBox = 'ListBox',
  RadioList = 'radio',
  CheckList = 'checkbox',
  Button = 'Button',
  Link = 'Link',
  Toggle = 'Toggle',
  Notice = 'Notice'
}

export class WebControls extends Collection<WebControl> {
  add(element: WebElement) {
    let control = this.findBy((item) => item.match(element));
    // Add a new control if it does not exist
    if (control === null) {
      control = this.setElement(element);
    }
    this.addOptions(control, element);
  }

  private addOptions(control: WebControl, element: WebElement) {
    const label = element.getLabel()
    const selector = element.getSelector()
    switch (element.type) {
      case elementType.RadioList:      
      case elementType.CheckList:
        let select = control as unknown as WebSelect;
        select.addItem(label, label, selector);    
    }
  }

  private setElement(element: WebElement) : WebControl  {
    switch (element.type) {
      // case elementType.LabelBox:
      //   return this.setWebControl<WebLabelBox>(
      //     type,
      //     name,
      //     selector,
      //     WebLabelBox
      //   );
      // case elementType.TextBox:
      //   return this.setWebControl<WebLabelBox>(
      //     type,
      //     name,
      //     selector,
      //     WebTextBox
      //   );
      // case elementType.DataBox:
      //   return this.setWebControl<WebDataBox>(type, name, selector, WebDataBox);
      // case elementType.ComboBox:
      //   return this.setWebControl<WebComboBox>(
      //     type,
      //     name,
      //     selector,
      //     WebComboBox
      //   );
      // case elementType.ListBox:
      //   return this.setWebControl<WebListBox>(type, name, selector, WebListBox);

      case elementType.RadioList:
        return this.setWebControl<WebRadioList>(element, WebRadioList);

        case elementType.CheckList:
          return this.setWebControl<WebCheckList>(element, WebCheckList);

      // case elementType.CheckList:
      //   return this.setWebControl<WebCheckList>(
      //     type,
      //     name,
      //     selector,
      //     WebCheckList
      //   );
      // case elementType.Button:
      //   return this.setWebControl<WebButton>(type, name, selector, WebButton);
      // case elementType.Link:
      //   return this.setWebControl<WebLink>(type, name, selector, WebLink);
      // case elementType.Toggle:
      //   return this.setWebControl<WebToggle>(type, name, selector, WebLink);
      // case elementType.Notice:
      //   return this.setWebControl<WebNotice>(type, name, selector, WebNotice);
      default:
        throw new Error('Invalid control type');
    }
  }

  private setWebControl<T extends WebControl>(
    element: WebElement,
    webControl: new (element: WebElement) => T
  ): T {
    const newElement = new webControl(element);
    this.push(newElement);
    return newElement;
  }
}

export class WebControl {
  readonly element: WebElement;

  get key(): string {
    return this.element.getKey();
  }

  get type(): string {
    return this.element.type;
  }

  get log(): string {
    return this.element.log;
  }

  constructor(element: WebElement) {
    this.element = element;
  }

  match(element: WebElement): boolean {
    return this.element.match(element.name);
  }

}

export class WebSelect extends WebControl {
  readonly domain = new DataOptions();

  get log(): string {
    return `[${this.element.getType()}] ${this.element.name}: { ${this.options} }`
  }

  get options(): string {
    return this.domain.show('value');
  }

  addItem(value: string, alias?: string, selector?: string) {
    if (this.key)
      console.log('ok')
    else{
      const x = this.element.findParentOptions()?.textContent
      console.log('no',x)
    }
    this.domain.add(value, alias, selector);
  }

}

export class WebRadioList extends WebSelect {
}

export class WebCheckList extends WebSelect {

}

export class WebListBox extends WebSelect {
}


