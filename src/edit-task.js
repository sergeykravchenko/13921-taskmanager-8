import util from './util';
import {colors} from './get-task';

export default class EditTask {
  constructor(data, cardIndex) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;
    this._element = null;
    this._onSubmit = null;
    this._cardIndex = cardIndex;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._months = [
      `January`,
      `February`,
      `March`,
      `April`,
      `May`,
      `June`,
      `July`,
      `August`,
      `September`,
      `October`,
      `November`,
      `December`
    ];
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _convertDate(date) {
    const standardDate = new Date(date);
    const dateToString = standardDate.toString();
    const dateTemplate = {
      day: dateToString.match(/\d+/)[0],
      month: this._months[standardDate.getMonth()],
      time: dateToString.match(/\d+\:\d+/)[0]
    };
    return dateTemplate;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onSubmit === `function` && this._onSubmit();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `<article class="card card--edit card--${this._color} ${this._isRepeated() ? `card--repeat` : ``} ${this._dueDate < Date.now() ? `card--deadline` : ``}">
    <form class="card__form" method="get">
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
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >${this._title}</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">no</span>
              </button>

              <fieldset class="card__date-deadline" ${this._dueDate ? `` : `disabled`}>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder="${this._convertDate(this._dueDate).day} ${this._convertDate(this._dueDate).month}"
                    name="date"
                  />
                </label>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__time"
                    type="text"
                    placeholder="${this._convertDate(this._dueDate).time}"
                    name="time"
                  />
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${this._isRepeated() ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__repeat-days" ${this._isRepeated() ? `` : `disabled`}>
                <div class="card__repeat-days-inner">
                  ${Object.entries(this._repeatingDays).map(([day, value]) => (`
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-${day}-${this._cardIndex}"
                    name="repeat"
                    value="${day}"
                    ${value ? ` checked` : ``}
                  />
                  <label class="card__repeat-day" for="repeat-${day}-${this._cardIndex}"
                    >${day}</label>
                  `)).join(``)}
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${this._tags.map((item) => (`
                <span class="card__hashtag-inner">
                  <input
                    type="hidden"
                    name="hashtag"
                    value="repeat"
                    class="card__hashtag-hidden-input"
                  />
                  <button type="button" class="card__hashtag-name">
                    #${item}
                  </button>
                  <button type="button" class="card__hashtag-delete">
                    delete
                  </button>
                </span>
                `)).join(``)}
              </div>

              <label>
                <input
                  type="text"
                  class="card__hashtag-input"
                  name="hashtag-input"
                  placeholder="Type new hashtag here"
                />
              </label>
            </div>
          </div>

          <label class="card__img-wrap ${this._picture ? `` : `card__img-wrap--empty`}">
            <input
              type="file"
              class="card__img-input visually-hidden"
              name="img"
            />
            <img
              src="${this._picture}"
              alt="task picture"
              class="card__img"
            />
          </label>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              ${Array.from(colors).map((item) => (`
              <input
                type="radio"
                id="color-${item}-${this._cardIndex}"
                class="card__color-input card__color-input--${item} visually-hidden"
                name="color"
                value="${item}"
                ${this._color === item ? ` checked` : ``}
              />
              <label
                for="color-${item}-${this._cardIndex}"
                class="card__color card__color--${item}"
                >${item}</label>
              `)).join(``)}
            </div>
          </div>
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>`;
  }

  render() {
    this._element = util.createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.querySelector(`.card__form`)
        .addEventListener(`submit`, this._onSubmitButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__form`)
        .removeEventListener(`submit`, this._onSubmitButtonClick);
  }
}
