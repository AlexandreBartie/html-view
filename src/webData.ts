import { Collection } from './webCollection';

export interface IDataOptions {
  value: string;
  alias: string;
  selector?: string;
}

export class DataOptions extends Collection<IDataOptions> {

  add(value: string, alias?: string, selector?: string) {
    if (alias === undefined) alias = value;
    this.push({ value, alias, selector });
  }

  get(alias: string): IDataOptions | null {
    for (var item of this)
      if (alias.toLowerCase() == item.alias.toLowerCase()) return item;

    return null;
  }

  getValues(filter: string | string[]): string[] {
    var values: string[] = [];

    for (var alias of this.getlist(filter)) {
      var item = this.get(alias);
      if (item !== null) values.push(item.value);
    }

    return values;
  }

  private getlist(arg: undefined | string | string[]): string[] {
    let list: string[];
    if (typeof arg === 'undefined') arg = String(arg);
    if (typeof arg === 'string') {
      // Split the string by "+" and trim each element
      list = arg.split('+').map((s) => s.trim());
    } else {
      // If input is already an array, return it
      list = arg;
    }
    return list;
  }
}
