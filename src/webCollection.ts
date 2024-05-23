export class Collection<T> extends Array<T> {

  get hasData(): boolean {
    return this.length > 0;
  }

  get next(): number {
    return this.length + 1;
  }

  constructor(...item: T[]) {
    super(...item);
  }

  setup(items: T[]): void {
    this.clear();
    if (items) items.forEach((item) => this.push(item)); // Add all elements from the parameter array
  }

  clear() {
    this.length = 0
  }  

  findBy(condition: (item: T) => boolean): T | null {
    for (const item of this) {
      if (condition(item)) {
        return item;
      }
    }
    return null;
  }

  filterBy(condition: (item: T) => boolean): Collection<T> {
    const filteredItems = this.filter(condition);
    return new Collection(...filteredItems);
  }

  list<K extends keyof T>(attr: K): T[K][] {
    return this.map(item => item[attr]);
  }

  show(attr: keyof T, delimiter: string = ' | '): string {
    return this.map(item => item[attr]).join(delimiter);
  }

}
