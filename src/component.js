import util from './util';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = util.createElement(this.template);
    this.createListeners();
    return this._element;
  }

  createListeners() {}

  removeListeners() {}

  unrender() {
    this.removeListeners();
    this._element.remove();
    this._element = null;
  }
}
