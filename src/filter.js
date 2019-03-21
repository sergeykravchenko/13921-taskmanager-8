import Component from './component';


export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.filterName;
    this.id = data.filterId;
    this._count = data.count;
    this._element = null;
    this._isActive = data.isActive;
    this._onFilter = null;
    this._onClick = this._onClick.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _isDisabled() {
    if (this._count === 0) {
      return true;
    }
    return false;
  }

  get template() {
    return `
      <input type="radio" id="filter__${this.id}" class="filter__input visually-hidden" name="filter" ${this._isActive ? `checked` : ``} ${this._isDisabled() ? `disabled` : ``}>
      <label for="filter__${this.id}" class="filter__label">${this._name}
        <span class="filter__${this.id}-count">${this._count}</span>
      </label>`;
  }

  _onClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  setListeners() {
    this._element.querySelector(`.filter__input`)
        .addEventListener(`click`, this._onClick);
  }

  removeListeners() {
    this._element.querySelector(`.filter__input`)
        .removeEventListener(`change`, this._onClick);
  }
}
