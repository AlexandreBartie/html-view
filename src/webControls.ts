import { Collection } from './webCollection';
import { DataOptions } from './webData';
import { WebElement } from './webElements';


export enum elementType {
  LabelBox = 'LabelBox',
  TextBox = 'TextBox',
  DataBox = 'DataBox',
  ComboBox = 'ComboBox',
  ListBox = 'ListBox',
  RadioList = 'radio',
  CheckList = 'CheckList',
  Button = 'Button',
  Link = 'Link',
  Toggle = 'Toggle',    
  Notice = 'Notice'
}

export class WebControls extends Collection<WebControl> {

  add(element: WebElement) {
    let control = this.findBy((item) => item.match(element));
    // Add a new control if it does not exist
    if (control === null) {
      this.setElement(element);
    }
  }

  private setElement(element: WebElement) {
    switch (element.type) {
      // case elementType.LabelBox:
      //   return this.setWebControl<WebLabelBox>(
      //     type,
      //     name,
      //     selector,
      //     WebLabelBox
      //   );
      // case elementType.TextBox:
      //   return this.setWebControl<WebLabelBox>(
      //     type,
      //     name,
      //     selector,
      //     WebTextBox
      //   );
      // case elementType.DataBox:
      //   return this.setWebControl<WebDataBox>(type, name, selector, WebDataBox);
      // case elementType.ComboBox:
      //   return this.setWebControl<WebComboBox>(
      //     type,
      //     name,
      //     selector,
      //     WebComboBox
      //   );
      // case elementType.ListBox:
      //   return this.setWebControl<WebListBox>(type, name, selector, WebListBox);

      case elementType.RadioList:
        return this.setWebControl<WebRadioList>(
          element,
          WebRadioList
        );
      // case elementType.CheckList:
      //   return this.setWebControl<WebCheckList>(
      //     type,
      //     name,
      //     selector,
      //     WebCheckList
      //   );
      // case elementType.Button:
      //   return this.setWebControl<WebButton>(type, name, selector, WebButton);
      // case elementType.Link:
      //   return this.setWebControl<WebLink>(type, name, selector, WebLink);
      // case elementType.Toggle:
      //   return this.setWebControl<WebToggle>(type, name, selector, WebLink);
      // case elementType.Notice:
      //   return this.setWebControl<WebNotice>(type, name, selector, WebNotice);
      default:
        throw new Error('Invalid control type');
    }
  }

  private setWebControl<T extends WebControl>(
    element: WebElement,
    webControl: new (
      element: WebElement
    ) => T
  ): T {
    const newElement = new webControl(element);
    this.push(newElement);
    return newElement;
  }

}


export class WebControl {

  readonly element: WebElement;

  constructor(element: WebElement) {
    this.element = element;
  }

  match(element: WebElement): boolean {
    return this.element.match(element.name)
  }

}


class WebSelect extends WebControl {

  readonly domain = new DataOptions();
  
  addItem(value: string, alias?: string, selector?: string) {
    this.domain.add(value, alias, selector);
  }
}

export class WebRadioList extends WebSelect {
  // async select(key: string) {
  //   if (key !== null) {
  //     let item = this.domain.get(key);
  //     if (item !== null) {
  //       let selector = this.getPathSelector(
  //         `text=${item.value}`,
  //         item.selector
  //       );
  //       await this.web.find(selector).check();
  //     }
  //   }
  // }
}

export class WebListBox extends WebSelect {
  // async select(list: string) {
  //   if (list !== null) {
  //     let itens = this.domain.getValues(list);

  //     await this.web.find(this.selector).selectOption(itens);
  //   }
  // }
}

export class WebCheckList extends WebSelect {
  // async select(list: string) {
  //   if (list !== null) {
  //     for (let value of this.domain.getValues(list)) {
  //       var selector = this.getPathSelector(
  //         `text=${value}`,
  //         'input[type="checkbox"]'
  //       );
  //       await this.web.find(selector).check();
  //     }
  //   }
  // }
}
