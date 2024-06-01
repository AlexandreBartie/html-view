import { Collection } from './webCollection';
import { DataOptions } from './webData';
import { WebElement, elementType } from './webElements';

export class WebControl {
  readonly element: WebElement;

  get key(): string {
    return this.element.key;
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
    if (this.element.isOption())
      return this.matchParent(element);
    return this.element.match(element.key_group);
  }

  private matchParent(element: WebElement): boolean {
    if ((element.parent) && (this.element.parent)) {
      return this.element.parent.match(element.parent_key);
    }
    return false;
  }

}

export class WebControls extends Collection<WebControl> {
  add(element: WebElement) {
    let control = this.findBy((item) => item.match(element));
    // Add a new control if it does not exist
    if (control === null) {
      console.log('======================================')
      console.log('===> new-control: ', element.key_group)
      console.log('======================================')
      control = this.setElement(element);
    }
    console.log('Element:', element.html)
    this.addOptions(control, element);
  }

  private addOptions(control: WebControl, element: WebElement) {
    if (element.isTagSelect()) return;   
    const label = element.getLabel()
    const selector = element.getSelector()
    switch (element.type) {
      case elementType.ComboBox:      
      case elementType.ListBox:
      case elementType.RadioList:      
      case elementType.CheckList:
        let select = control as unknown as WebSelect;
        select.addItem(label, label, selector);
        console.log('===> add option: ', label)    
    }
  }

  private setElement(element: WebElement) : WebControl  {
    switch (element.type) {

      case elementType.RadioList:
        return this.setWebControl<WebRadioList>(element, WebRadioList);

        case elementType.CheckList:
          return this.setWebControl<WebCheckList>(element, WebCheckList);

        case elementType.ListBox:
          return this.setWebControl<WebRadioList>(element, WebRadioList);
  
          case elementType.ComboBox:
            return this.setWebControl<WebComboBox>(element, WebComboBox);

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
export class WebSelect extends WebControl {
  readonly group: WebElement | null;
  readonly domain = new DataOptions();

  get key(): string {
    if (this.group)
      return this.group?.key
    return 'null';
  }

  get log(): string {
    return `[${this.element.getType()}] ${this.element.name}: { ${this.options} }`
  }

  get options(): string {
    return this.domain.show('value');
  }

  constructor(element: WebElement) {
    super(element);
    this.group = this.setGroupOptions();
  }

  addItem(value: string, alias?: string, selector?: string) {
    if (!this.key)
      console.log('no key')
    this.domain.add(value, alias, selector);
  }

  setGroupOptions(): WebElement | null{
    let group = this.element.parent;
    while (group) {
      const label = group.label;
      if (label !== this.element.label)
        return group;
      group = group.parent;
    }
    return null;
  }

}

export class WebRadioList extends WebSelect {
}

export class WebCheckList extends WebSelect {

}

export class WebListBox extends WebSelect {
}

export class WebComboBox extends WebSelect {
}
