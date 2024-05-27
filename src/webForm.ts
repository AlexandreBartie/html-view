import { WebControls } from "./webControls";
import { WebElements } from "./webElements";
import { WebView } from "./webView";
 
export class WebForm {
  readonly view: WebView;

  readonly elements = new WebElements();
  readonly controls = new WebControls();

  get tags(): string[] {
    return this.view.browser.tags;
  }

  constructor(view: WebView) {
    this.view = view
  }

  setup() {
    for (const element of this.elements)
      if (this.tags.includes(element.tagName))
        this.controls.add(element);
    }
  
  show(title: string) {
    console.log('====================')
    console.log(`\n${title}`)
    console.log('====================')
    for (const control of this.controls) {
      console.log('Control ==>', control.log);
    }

  }

}
  