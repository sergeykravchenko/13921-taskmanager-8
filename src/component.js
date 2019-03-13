import util from './util';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = util.createElement(this.template);
    this.setListeners();
    return this._element;
  }

  setListeners() {}

  removeListeners() {}

  unrender() {
    this.removeListeners();
    this._element.remove();
    this._element = null;
  }

  update() {}
}
