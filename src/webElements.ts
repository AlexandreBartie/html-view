import { WebNode } from "./webNode";

type dataValue = string;

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
  Notice = 'Notice',
  Undefined = ''
}

class WebLocator {

  protected node: HTMLElement;

  get parent() : WebElement | null {
    const parent = this.node.parentElement
    if (parent)
      return new WebElement(parent)
    return null
  }
 
  get parent_key(): string {
    if (this.parent)
      return this.parent.key
    return ''
  }

  get id(): string {
    return this.node.id;
  }

  get className(): string {
    return this.node.className;
  }

  get tagName(): string {
    return this.node.tagName.toLowerCase();
  }  

  get textContent(): string | null {
    return this.node.textContent?.trim() ?? null;
  }  

  get html() : string {
    let clone = this.node.cloneNode(false) as HTMLElement;
    return clone.outerHTML
  }

  constructor(node: HTMLElement) {
    this.node = node;
  }

  getSelector_2(): string {
  
    let selector = this.tagName;
  
    if (this.id) {
      selector += `#${this.id}`;
      return selector;
    }
  
    if (this.className) {
      const classList = this.className.split(/\s+/).filter(Boolean);
      if (classList.length > 0) {
        selector += `.${classList.join('.')}`;
      }
    }
  
    const attributes = Array.from(this.node.attributes).filter(attr => attr.name !== 'id' && attr.name !== 'class');
    if (attributes.length > 0) {
      attributes.forEach(attr => {
        selector += `[${attr.name}="${attr.value}"]`;
      });
    }
  
    return selector;
  }

  getSelector(): string {
    let key = this.tagName;
    if (this.id) {
        key += '#' + this.id;
    }
    if (this.className) {
        key += '.' + this.className;
    }
    let siblingIndex = this.getSiblingIndex(this.node.previousElementSibling, this.tagName);
    key += ':nth-of-type(' + siblingIndex + ')';
    return key;
}

  private getSiblingIndex(element: Element | null, tagName: string, index = 1): number {
    if (!element || element.tagName !== tagName) {
        return index;
    }
    return this.getSiblingIndex(element.previousElementSibling, tagName, index + 1);
  }  

}

export class WebGroup extends WebLocator {
 
  get type(): string {
    return this.getVirtualType();
  }

  private get list(): string[] {
    return [elementType.RadioList, elementType.CheckList];
  }

  isTypeList(): boolean {
    return this.list.includes(this.type);
  }

  isTypeSelect(): boolean {
    return this.isTagSelect() || this.isTagOption() ;
  }

  isTagSelect(): boolean {
    return (this.tagName === 'select');
  }

  isTagOption(): boolean {
    return (this.tagName === 'option');
  }

  isOption(): boolean {
    return this.isTypeList() || (this.tagName === 'option');
  }

  getOption(): string {
    if (this.isOption())
      return this.get('value');
    return '';
  }

  get(name: string): dataValue {
    return this.node.attributes.getNamedItem(name)?.value || '';
  }

  private getVirtualType(): string {
    if (this.isTagSelect())
        return this.getSelectBox();
    if (this.isTagOption())
      return this.getParentType();
    return this.get('type')
  }

  private getSelectBox(): string {
    if (this.get('multiple'))
      return elementType.ListBox;
    return elementType.ComboBox;
  }

  private getParentType(): string {
    if (this.parent)
      return this.parent.type;
    return elementType.Undefined;
  }

}



export class WebKey extends WebGroup {

  get name(): string {
    return this.get('name');
  }

  get key(): string {
    if ((!this.isTypeList) && (this.id))
      return this.id;
    if (this.name)
      return this.name;
    return this.getSelector();
  }
  
  get key_group(): string {
    if (this.isOption())
      return this.parent_key;
    return this.key;
  }


  get label(): string | null {
    if (this.textContent)
      return this.textContent;
    if (this.parent)
      return this.parent.textContent;
    return null
  }

  match(key: string): boolean {
    return this.key === key;
  }

}


export class WebElement extends WebKey {

  get value(): string {
    return this.get('value');
  }

  get for(): string {
    return this.get('for');
  }

  get log(): string {
    let ref = this.id;
    if (ref === undefined)
      ref = this.for;
    if (ref === undefined)
      ref = this.name;

    return `[${this.type}]${ref}//${this.html}` ;
  }

  getValue(): string {
    if (this.value)
      return this.value
    if (this.label)
      return this.label;
    return 'null';
  }

  getLabel(): string {
    if (this.label)
      return this.label;
    return 'null';
  }

  getType(): string {
    let type = '';

    if (this.tagName)
      type += `${this.tagName}`;

    if (this.type)
      type += `#${this.type}`;

    return type;

  }

}

export class WebElements extends Array<WebElement> {

  get hasData(): boolean {
    return this.length > 0;
  }

  add(node: WebNode): WebElement {
    const element = new WebElement(node.node as HTMLElement);
    this.push(element);
    return element;
  }

  show(title: string, tags: string[]) {
    console.log('====================')
    console.log(`\n${title}`)
    console.log('====================')
    for (const element of this) {
      if (tags.includes(element.tagName)) {
        console.log('==>', element.log);
      }
    }

  }

}
