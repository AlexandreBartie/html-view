import { WebNode } from "./webNode";

type dataValue = string;

class WebSelector {

  protected node: HTMLElement;

  protected get parent() : HTMLElement | null {
    return this.node.parentElement
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

  getSelector(): string {
  
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

  constructor(node: HTMLElement) {
    this.node = node;
  }

  getKey(): string {
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

  getSiblingIndex(element: Element | null, tagName: string, index = 1): number {
    if (!element || element.tagName !== tagName) {
        return index;
    }
    return this.getSiblingIndex(element.previousElementSibling, tagName, index + 1);
}  

}

export class WebElement extends WebSelector {

  get type(): string {
    return this.get('type');
  }

  get name(): string {
    return this.get('name');
  }

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

  getKey(): string {
    if (this.id)
      return this.id;
    return this.name;
  }

  getValue(): string {
    if (this.value)
      return this.value
    if (this.node.textContent)
      return this.node.textContent;
    return this.getLabel();
  }

  getLabel(): string {
    if (this.parent?.textContent)
      return this.parent.textContent.trim();
    return 'null'
  }

  getHtml() : string {
    let clone = this.node.cloneNode(false) as HTMLElement;
    return clone.outerHTML
  }

  // getInnerHTML(): string {
  //   return this.node.innerHTML;
  // }

  getType(): string {
    let type = '';

    if (this.tagName)
      type += `${this.tagName}`;

    if (this.type)
      type += `#${this.type}`;

    return type;

  }

  findParentOptions(): HTMLElement | null {
    let parent = this.parent;
    while (parent) {
      const label = parent.textContent?.trim();
      if (label !== this.getLabel())
        return parent
      parent = parent.parentElement;
    }
    return null;
  }

  get(name: string): dataValue {
    return this.node.attributes.getNamedItem(name)?.value || '';
  }

  match(key: string): boolean {
    return this.name === key;
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
