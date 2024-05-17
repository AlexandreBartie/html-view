import Path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { WebElement } from './webElement';
import { expect } from '@playwright/test';

// export class WebBrowser {
//   readonly view = new WebView();

//   async save(filename: string, html: string, root?: string) {
//     // Print the hierarchy starting from the root element
//     this.view.save(filename, html, root);
//   }
// }

class WebDOM {
  private dom: JSDOM;

  readonly root: WebElement;

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
    const rootHTML = this.root.element.outerHTML;
    writeFileSync(filePath, rootHTML, 'utf8');
  }

  getElement(selector: string): WebElement {
    return new WebElement(this.root.element, selector);
  }

  private getRoot(selector?: string): WebElement {
    let root = null;

    if (selector)
      // define root with element found by selector
      root = this.body.querySelector(selector);

    // define root with Body element
    if (!root) root = this.body;

    return new WebElement(root as HTMLElement);
  }
}

export class WebView {
  readonly dom: WebDOM;

  constructor(html: any, scope?: string) {
    this.dom = new WebDOM(html, scope);

    this.view(this.dom.root);
  }

  save(fileName: string, folder = "output"): void {
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

  // Function to recursively print the hierarchy
  private view(element: WebElement, indent: number = 0): void {
    if (element.isTagValid) {
      const tab = ' '.repeat(indent);

      if (element.isTagShow) {
        console.log(tab + ` >>> ${element.getLine()}`);
      }
    }
    for (const child of element.nodes) {
      this.view(child, indent + 1);
    }
  }
}
