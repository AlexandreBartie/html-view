import { WebNode } from "./webNode";

type dataValue = string;

export class WebElement {

  readonly node: HTMLElement;

  get type(): string {
    return this.get('type');
  }

  get id(): string {
    return this.get('id');
  }

  get for(): string {
    return this.get('for');
  }

  get name(): string {
    return this.get('name');
  }

  get tagValue(): string {
    if (this.node.textContent)
      return this.node.textContent;
    return 'null'
  }

  get tagName(): string {
    return this.node.tagName.toLowerCase();
  }

  get tagHtml(): string {
    return this.node.innerHTML;
  }

  get tagType(): string {
    let type = '';

    if (this.tagName)
      type += `${this.tagName}`;

    if (this.type)
      type += `#${this.type}`;

    return type;

  }

  get txt(): string {
    let ref = this.id;
    if (ref === undefined)
      ref = this.for;
    if (ref === undefined)
      ref = this.name;

    return `[${this.type}]${ref}//${this.tagHtml}` ;
  }

  constructor(node: HTMLElement) {
    this.node = node;
  }

  match(key: string): boolean {
    return this.name === key;
  }

  get(name: string): dataValue {
    return this.node.attributes.getNamedItem(name)?.value || '';
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
        console.log('==>', element.txt);
      }
    }

  }

}
