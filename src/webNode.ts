import { JSDOM } from 'jsdom';
import { writeFileSync } from 'fs';

export class WebDOM {
  private dom: JSDOM;

  readonly root: WebNode;

  get body(): HTMLElement {
    // Get the document object from the JSDOM instance
    return this.dom.window.document.body;
  }

  constructor(html: any, root?: string) {
    // Create a JSDOM instance and parse the HTML content
    this.dom = new JSDOM(html);

    this.root = this.getRoot(root);
  }

  save(filePath: string): void {
    const rootHTML = this.root.node.outerHTML;
    writeFileSync(filePath, rootHTML, 'utf8');
  }

  // getNode(selector: string): WebNode {
  //   return new WebNode(this.root.node, selector);
  // }

  private getRoot(selector?: string): WebNode {
    let root = null;

    if (selector)
      // define root with element found by selector
      root = this.body.querySelector(selector);

    // define root with Body element
    if (!root) root = this.body;

    return new WebNode(root as HTMLElement);
  }
}

class WebNodes extends Array<WebNode> {
  readonly parent: WebNode;

  get hasData(): boolean {
    return this.length > 0;
  }

  constructor(parent: WebNode) {
    super();
    this.parent = parent;
    for (const child of parent.node.childNodes) {
      const element = new WebNode(child as HTMLElement);
      this.push(element);
    }
  }
}

export class WebAttributes {
  readonly node: HTMLElement;

  get class(): string | null {
    return this.getAttribute('class');
  }
  get id(): string | null {
    return this.getAttribute('id');
  }

  get name(): string | null {
    return this.getAttribute('name');
  }

  constructor(node: HTMLElement, selector?: string) {
    if (selector) this.node = node.querySelector(selector) as HTMLElement;
    else this.node = node;
  }

  hasAttribute(name: string): boolean {
    return this.getAttribute(name) !== null;
  }

  getAttribute(name: string): string | null {
    return this.node.getAttribute(name);
  }
}

export class WebNode extends WebAttributes {
  get isInput(): boolean {
    return this.tag == 'INPUT';
  }

  get input(): WebInput | null {
    if (this.isInput) return new WebInput(this.node);
    return null;
  }

  get tag(): string {
    return this.node.tagName;
  }

  get text(): string {
    if (this.node.textContent) return this.node.textContent.trim();
    return '';
  }

  get isTagValid(): boolean {
    if (this.tag) {
      const excludedTags = ['HTML', 'HEAD', 'BODY'];
      return !excludedTags.includes(this.tag);
    }
    return false;
  }

  get isTagShow(): boolean {
    if (this.tag) {
      const excludedTags = ['SCRIPT'];
      return !excludedTags.includes(this.tag);
    }
    return false;
  }

  get isTagInput(): boolean {
    if (this.tag) {
      const excludedTags = ['INPUT'];
      return !excludedTags.includes(this.tag);
    }
    return false;
  }

  get hasNodes(): boolean {
    return this.nodes.hasData;
  }

  get notNodes(): boolean {
    return !this.hasNodes;
  }

  get nodes(): WebNodes {
    return new WebNodes(this);
  }

  getLine(): string {
    const input = this.input;

    const tagName = this.tag;
    const textContent = this.text;

    const id = this.id;
    const className = this.class;
    const name = this.name;

    const logStatement = [];

    if (tagName) logStatement.push(`Tag: ${tagName}`);
    if (id) logStatement.push(`ID: ${id}`);
    if (className) logStatement.push(`Class Name: ${className}`);
    if (name) logStatement.push(`Name: ${name}`);
    if (textContent && this.notNodes)
      logStatement.push(`textContent: ${textContent}`);
    if (input) logStatement.push(`Input: { ${input.getLine()} }`);

    return logStatement.join(`, `);
  }
}

class WebInput {
  private input: HTMLInputElement;

  get type(): string {
    return this.input.type;
  }

  get value(): string {
    return this.input.value;
  }

  get label(): string {
    return this.input.innerText;
  }

  get path(): string {
    return this.input.outerHTML;
  }

  constructor(element: HTMLElement) {
    this.input = element as unknown as HTMLInputElement;
  }

  getLine(): string {
    const logStatement = [];

    logStatement.push(`Type: ${this.type}`);
    if (this.value) logStatement.push(`Value: ${this.value}`);
    if (this.label) logStatement.push(`Label: ${this.label}`);
    if (this.path) logStatement.push(`Path: ${this.path}`);

    return logStatement.join(`, `);
  }
}
