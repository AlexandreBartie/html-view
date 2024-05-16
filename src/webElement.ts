class WebElements extends Array<WebElement> {

  readonly parent: WebElement;

  get hasData(): boolean {
    return this.length > 0;
  }

  constructor(parent: WebElement) {
    super();
    this.parent = parent
    for (const child of parent.element.childNodes) 
    {
      const element = new WebElement (child as HTMLElement)
      this.push(element);
    }

  }

}

class WebAttributes {
  readonly element: HTMLElement;

  get class(): string | null {
    return this.getAttribute('class');
  }
  get id(): string | null {
    return this.getAttribute('id');
  }
  
  get name(): string | null {
    return this.getAttribute('name');
  }
  
  constructor(element: HTMLElement, selector?: string) {
    if (selector) this.element = element.querySelector(selector) as HTMLElement;
    else this.element = element;
  }

  hasAttribute(name: string): boolean {
    return this.getAttribute(name) !== null;
  }

  getAttribute(name: string): string | null {
    return this.element.getAttribute(name);
  }

}


export class WebElement extends WebAttributes {

  get isInput(): boolean {
    return (this.tag == 'INPUT')
  }

  get input(): WebInput | null {
    if (this.isInput)
      return new WebInput(this.element);
    return null;
  }

  get tag(): string {
    return this.element.tagName;
  }

  get text(): string {
    if (this.element.textContent) return this.element.textContent.trim();
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

  get hasNodes(): boolean {
    return this.nodes.hasData;
  }

  get notNodes(): boolean {
    return !this.hasNodes;
  }

  get nodes(): WebElements {
    return new WebElements(this);
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
    if (textContent && this.notNodes) logStatement.push(`textContent: ${textContent}`);
    if (input) logStatement.push(`Input: { ${input.getLine()} }`);

    return (logStatement.join(`, `))

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

    return (logStatement.join(`, `))
  }

}

