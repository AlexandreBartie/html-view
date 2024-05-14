import axios from 'axios';
import { JSDOM } from 'jsdom';

class WebInput {
  private input: HTMLInputElement;

  get type(): string {
    return this.input.type;
  }

  get value(): string {
    return this.input.value;
  }

  constructor(element: HTMLElement) {
    this.input = element as unknown as HTMLInputElement;
  }
}

class WebElement {
  readonly element: HTMLElement;

  get input(): WebInput {
    return new WebInput(this.element);
  }

  get tag(): string {
    return this.element.tagName;
  }

  constructor(element: HTMLElement, selector?: string) {
    if (selector)
      this.element = element.querySelector(selector) as HTMLElement;
    else
      this.element = element
  }

}

export class WebBrowser {

  readonly view = new WebView();

  private data: any

  // Fetch the HTML content of the webpage
  async setup(url: any) {
    const response = await axios.get(url);
    this.data = response.data;
  }

  show(root?: string) {
    // Print the hierarchy starting from the root element
    this.view.show(this.data, root);
  }


}

class WebDOM {

  private dom: JSDOM;

  protected root: HTMLElement

  get body() : HTMLElement {
    // Get the document object from the JSDOM instance
    return this.dom.window.document.body;
  }

  constructor(html: any, root?: string) {

    // Create a JSDOM instance and parse the HTML content
    this.dom = new JSDOM(html);

    this.root = this.getRoot(root);

  }

  getElement(selector: string) : WebElement {
    return new WebElement(this.root, selector);
  }

  private getRoot(selector?: string) : HTMLElement {
    let root = null;
    
    if (selector)
      // define root with element found by selector
      root = this.body.querySelector(selector);      
    
    // define root with Body element 
    if (!root)
      root = this.body;  
  
    return root as HTMLElement
  
  }

}

export class WebView {

  async show(html: any, scope?: string) {

    const dom = new WebDOM(html, scope);

    const element = dom.getElement('#username');
    const tagName = element.tag; // Get tag name in lower case
    const value = element.input.value; // Access the value attribute
    const type = element.input.type; // Access the value attribute
    
    console.log('TagName: ', tagName);
    console.log('Value: ', value);
    console.log('Type: ', type);

  }

  //   // Print the hierarchy starting from the root element
  //   if (element) view(element, scope);
  //   else console.error('Element not found');
  // } catch (error) {
  //   console.error('Failed to fetch the webpage:', error);
  // }

}
// Function to recursively print the hierarchy
function view(element: HTMLElement, scope?: string, indent: number = 0): void {
  const tagName = element.tagName;

  if (element !== null && element instanceof HTMLInputElement) {
    // 'element' is not null and compatible with HTMLInputElement
    console.log('Element is compatible with HTMLInputElement');
  } else {
    // 'element' is either null or not an instance of HTMLInputElement
    console.log('Element is not compatible with HTMLInputElement');
  }

  if (isTagValid(tagName)) {
    const tab = ' '.repeat(indent) + ' >>> ';

    console.log(tab + `TagName: ${tagName}`);

    if (isTagShow(tagName)) {
      if (element.childNodes.length !== 0) {
        const textContent = element.textContent;
        if (textContent) {
          console.log(tab + `textContent: ${textContent.trim()}`);
          if (textContent == 'Password') console.log('ok');
        }

        const className = element.getAttribute('class');
        if (className) console.log(tab + `Class Name: ${className}`);

        const id = element.getAttribute('id');
        if (id) console.log(tab + `ID: ${id}`);

        const name = element.getAttribute('name');
        if (name) console.log(tab + `Name: ${name}`);

        if (element instanceof HTMLInputElement) {
          const input = element as HTMLInputElement;
          const value = input.value;
          if (value) console.log(tab + `Value: ${value}`);
        }
      }
    }
  }
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE)
      view(child as HTMLElement, scope, indent + 1);
  }
}

function isTagValid(tagName: string): boolean {
  if (tagName) {
    const excludedTags = ['HTML', 'HEAD', 'BODY'];
    return !excludedTags.includes(tagName);
  }
  return false;
}

function isTagShow(tagName: string): boolean {
  if (tagName) {
    const excludedTags = ['SCRIPT'];
    return !excludedTags.includes(tagName);
  }
  return false;
}








