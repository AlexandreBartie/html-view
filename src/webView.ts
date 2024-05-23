import Path from 'path';

import { existsSync, mkdirSync, readFileSync } from 'fs';
import { WebDOM, WebNode } from './webNode';
import { expect } from '@playwright/test';
import { WebForm } from './webForm';

export class WebView {

  readonly browser: WebBrowser;

  private dom: WebDOM;

  readonly form = new WebForm(this)

  constructor(browser: WebBrowser, html: any, scope?: string) {
    this.browser = browser;

    this.dom = new WebDOM(html, scope);

    this.load(this.dom.root);
    this.form.setup();
  }

  // Function to recursively print the hierarchy
  private load(node: WebNode, indent: number = 0): void {
    if (node.isTagValid) {

      if (node.isTagShow)
        this.form.elements.add(node);
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
