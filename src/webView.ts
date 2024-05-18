import Path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { WebAttributes, WebDOM, WebNode } from './webNode';
import { expect } from '@playwright/test';

type dataElement = Record<string, string>;

class WebElement {

  readonly data: dataElement;

  get type(): string {
    return this.get('type');
  }

  constructor(node: HTMLElement) {
    this.data = this.parse(node);
  }

  get(name: string): string {
    return this.data[name];
  }

  private parse(node: HTMLElement): dataElement {
    // Initialize an empty object to hold the JSON representation
    const data: Record<string, string> = {};

    // Loop through all attributes of the element
    for (let attr of node.attributes) {
        data[attr.name] = attr.value;
    }

    // Add the innerHTML to the JSON object
    data['innerHTML'] = node.innerHTML;

    return data;
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

}

class WebView {

  private dom: WebDOM;

  readonly elements = new WebElements();

  constructor(html: any, scope?: string) {
    this.dom = new WebDOM(html, scope);

    this.load(this.dom.root);
  }

  // Function to recursively print the hierarchy
  private load(node: WebNode, indent: number = 0): void {
    if (node.isTagValid) {
      const tab = ' '.repeat(indent);

      
      if (node.isTagInput) {
        const element = new WebElement(node.node as HTMLElement);
        this.elements.push(new WebElement(node.node as HTMLElement));
      }

      if (node.isTagShow) {
        this.elements.add(node);
      }

      // if (node.isTagInput) {
      //   console.log(tab + ` <<< ${node.getLine()}`);
      // }
    }
    for (const child of node.nodes) {
      this.load(child, indent + 1);
    }
  }

  save(fileName: string, folder = 'output'): void {
    // Create folder if it doesn't exist
    const folderPath = Path.join(process.cwd(), 'test', folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }

    const filePath = Path.join(folderPath, fileName);

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
    const view = new WebView(html, scope);
    this.push(view);
    return view;
  }
}

export class WebBrowser {
  readonly views = new WebViews(this);

  setView(html: any, scope?: string): WebView {
    return this.views.add(html, scope);
  }
}
