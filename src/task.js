import Component from './component';
import moment from 'moment';

export default class Task extends Component {
  constructor(data, cardIndex) {
    super();
    this.id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;
    this._cardIndex = cardIndex;
    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._isOverdue = Date.now() > this._dueDate;
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="card card--${this._color} ${this._isRepeated() ? `card--repeat` : ``} ${this._isOverdue ? `card--deadline` : ``}">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites card__btn--disabled"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
        <div>
          <span class="card__text">${this._title}</span>
        </div>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <span class="card__date">${this._dueDate ? moment(this._dueDate).format(`DD MMMM hh:mm`) : ``}</span>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${[...this._tags].map((item) => (`
                <span class="card__hashtag-inner">
                  <input
                    type="hidden"
                    name="hashtag"
                    value="${item}"
                    class="card__hashtag-hidden-input"
                  />
                  <button type="button" class="card__hashtag-name">
                    #${item}
                  </button>
                </span>
                `)).join(``)}
              </div>
            </div>
          </div>

          <span class="card__img-wrap ${this._picture ? `` : `card__img-wrap--empty`}">
            <img src="${this._picture}" alt="task picture" class="card__img"/>
          </span>
        </div>

      </div>
  </article>`;
  }

  setListeners() {
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this._onEditButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.card__btn--edit`)
        .removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  toRAW() {
    return {
      'id': this.id,
      'title': this._title,
      'due_date': this._dueDate,
      'tags': [...this._tags.values()],
      'picture': this._picture,
      'repeating_days': this._repeatingDays,
      'color': this._color,
      'is_favorite': this._isFavorite,
      'is_done': this._isDone,
    };
  }
}
