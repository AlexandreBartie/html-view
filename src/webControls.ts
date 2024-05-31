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
    if (this.element.isGroup)
      return this.matchGroup(element);
    return this.element.match(element.key);
  }

  private matchGroup(element: WebElement): boolean {
    if ((element.parent) && (this.element.parent)) {
      const a = this.element.parent.key 
      const b = element.parent.key
      return this.element.parent.match(element.parent.key);
    }
    return false;
  }

}

export class WebControls extends Collection<WebControl> {
  add(element: WebElement) {
    let control = this.findBy((item) => item.match(element));
    // Add a new control if it does not exist
    if (control === null) {
      console.log('new control', element.key)
      control = this.setElement(element);
    } else {
      console.log('reused control', element.key)
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

      case elementType.RadioList:
        return this.setWebControl<WebRadioList>(element, WebRadioList);

        case elementType.CheckList:
          return this.setWebControl<WebCheckList>(element, WebCheckList);

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
    return `key:${this.key}[${this.element.getType()}] ${this.element.name}: { ${this.options} }`
  }

  get options(): string {
    return this.domain.show('value');
  }

  constructor(element: WebElement) {
    super(element);
    this.group = this.setGroupOptions();
  }

  addItem(value: string, alias?: string, selector?: string) {
    if (this.key)
      console.log('ok')
    else{
      console.log('no')
    }
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

