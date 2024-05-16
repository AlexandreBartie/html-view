import axios from 'axios';
import { JSDOM } from 'jsdom';
import { WebElement } from './webElement';

export class WebBrowser {
  readonly view = new WebView();

  private data: any;

  async show(url: any, root?: string) {
    // Fetch the HTML content of the webpage
    const response = await axios.get(url);

    if (response.status === 200) {
      this.data = response.data;
      // Print the hierarchy starting from the root element
      this.view.show(this.data, root);
    }
  }
}

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

  getElement(selector: string): WebElement {
    return new WebElement(this.root.element, selector);
  }

  private getRoot(selector?: string): WebElement {
    let root = null;

    if (selector)
      // define root with element found by selector
      root = this.body.querySelector(selector) as HTMLElement;

    // define root with Body element
    if (!root) root = this.body;

    return new WebElement(root as HTMLElement);
  }
}

export class WebView {
  async show(html: any, scope?: string) {
    const dom = new WebDOM(html, scope);

    this.view(dom.root);
  }

  // Function to recursively print the hierarchy
  view(element: WebElement, indent: number = 0): void {
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
