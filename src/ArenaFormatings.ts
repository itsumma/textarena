import ArenaNodeFormating from 'ArenaNodeFormating';

type Formatings = {
  [name: string]: ArenaNodeFormating
};

export default class ArenaFormatings {
  formatings: Formatings = { };

  insertFormating(name: string, start: number, end: number): void {
    if (!this.formatings[name]) {
      this.formatings[name] = new ArenaNodeFormating();
    }
    this.formatings[name].addInterval(start, end);
  }
}
