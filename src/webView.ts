import Path from 'path';

import { existsSync, mkdirSync, readFileSync } from 'fs';
import { WebDOM, WebNode } from './webNode';
import { expect } from '@playwright/test';

type dataValue = string;

class WebElement {

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

  get(name: string): dataValue {
    return this.node.attributes.getNamedItem(name)?.value || '';
  }

}

class WebElements extends Array<WebElement> {

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

class WebView {

  private browser: WebBrowser;

  private dom: WebDOM;

  readonly elements = new WebElements();

  constructor(browser: WebBrowser, html: any, scope?: string) {
    this.browser = browser;

    this.dom = new WebDOM(html, scope);

    this.load(this.dom.root);
  }

  // Function to recursively print the hierarchy
  private load(node: WebNode, indent: number = 0): void {
    if (node.isTagValid) {

      if (node.isTagShow)
        this.elements.add(node);
    }
    for (const child of node.nodes) {
      this.load(child, indent + 1);
    }
  }

  save(fileName: string): void {
    const filePath = this.browser.getFilePath(fileName);
    // Save HTML file
    this.dom.save(filePath);
    // Optionally, assert that the file exists
    expect(existsSync(filePath)).toBeTruthy();
  }
}

class WebViews extends Array<WebView> {
  readonly browser: WebBrowser;

  get hasData(): boolean {
    return this.length > 0;
  }

  constructor(browser: WebBrowser) {
    super();
    this.browser = browser;
  }

  add(html: any, scope?: string): WebView {
    const view = new WebView(this.browser, html, scope);
    this.push(view);
    return view;
  }
}

export class WebBrowser {
  
  readonly views = new WebViews(this);     
  
  readonly folder: string;

    // List of types to check
    get tags() : string[] {
      return ['form', 'input', 'select', 'textarea', 'button', 'span', 'option'];
    }

    get labels() : string[] { 
      return ['label'];
    }

    get types() : string[] { 
      return ['label', 'text', 'password', 'email', 'radio', 'checkbox', 'submit']; // Add more types as needed
    }
  constructor(folder: string) {
    this.folder = Path.join(process.cwd(), 'test', folder);
  }

  setLoad(fileName: string): WebView {
    const file = Path.join(this.folder, fileName);
    const data = readFileSync(file, 'utf8');
    return this.setView(data);
  };

  setView(html: any, scope?: string): WebView {
    return this.views.add(html, scope);
  }

  getFilePath(filename: string): string {
    // Create folder if it doesn't exist
    if (!existsSync(this.folder)) {
      mkdirSync(this.folder);
    }
    return Path.join(this.folder, filename);
  }

}
