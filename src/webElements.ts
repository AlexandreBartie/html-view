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
  Notice = 'Notice'
}

class WebLocator {

  protected node: HTMLElement;

  get parent() : WebElement | null {
    const parent = this.node.parentElement
    if (parent)
      return new WebElement(parent)
    return null
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
    return this.get('type');
  }

  get isGroup(): boolean {
    return this.listGroup.includes(this.type);
  }

  private get listGroup(): string[] {
    return [elementType.RadioList, elementType.CheckList];
  }

  get(name: string): dataValue {
    return this.node.attributes.getNamedItem(name)?.value || '';
  }

}

export class WebKey extends WebGroup {

  get name(): string {
    return this.get('name');
  }

  get key(): string {
    if ((!this.isGroup) && (this.id))
      return this.id;
    if (this.name)
      return this.name;
    return this.getSelector();
  }
  
  get label(): string | null {
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

    return `[${this.type}]${ref}//${this.getHtml()}` ;
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

  getHtml() : string {
    let clone = this.node.cloneNode(false) as HTMLElement;
    return clone.outerHTML
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
