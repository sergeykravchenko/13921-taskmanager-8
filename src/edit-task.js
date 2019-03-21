import Component from './component';
import {colors} from './get-task';
import flatpickr from 'flatpickr';
import moment from 'moment';

export default class EditTask extends Component {
  constructor(data, cardIndex) {
    super();
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
    this._onDelete = null;
    this._cardIndex = cardIndex;
    this._onSubmit = null;
    this._state.isDate = false;
    this._state.isRepeated = false;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._setBarColorOnEdit = this._setBarColorOnEdit.bind(this);
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this._partialUpdate();
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this._partialUpdate();
  }

  _setBarColorOnEdit() {
    const color = this._element.querySelector(`.card__color-input:checked`).value;
    this._color = color;
    const newColorClass = this._element.className.replace(/(?!card|\--|edit)\b\S+/, color);
    this._element.className = newColorClass;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _partialUpdate() {
    this.removeListeners();
    const oldElement = this._element;
    this.render();
    oldElement.parentElement.replaceChild(this._element, oldElement);
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: new Date(),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    const editTaskMapper = EditTask.createMapper(entry);

    for (const [property, value] of formData.entries()) {
      if (editTaskMapper[property]) {
        editTaskMapper[property](value);
      }
    }

    return entry;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
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
                date: <span class="card__date-status">${this._state.isDate ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__date-deadline" ${this._state.isDate ? `` : `disabled`}>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder="${moment(this._dueDate).format(`DD MMMM`)}"
                    name="date"
                  />
                </label>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__time"
                    type="text"
                    placeholder="${moment(this._dueDate).format(`hh:mm`)}"
                    name="time"
                  />
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__repeat-days" ${this._state.isRepeated ? `` : `disabled`}>
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

  setListeners() {
    this._element.querySelector(`.card__form`)
        .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__form`)
        .addEventListener(`change`, this._setBarColorOnEdit);
    this._element.querySelector(`.card__delete`)
        .addEventListener(`click`, this._onDeleteButtonClick);

    if (this._state.isDate) {
      flatpickr(this._element.querySelector(`.card__date`), {altInput: true, altFormat: `j F`, dateFormat: `j F`});
      flatpickr(this._element.querySelector(`.card__time`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `h:i K`});
    }
  }

  removeListeners() {
    this._element.querySelector(`.card__form`)
        .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
        .removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
        .removeEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__form`)
        .removeEventListener(`change`, this._setBarColorOnEdit);
    this._element.querySelector(`.card__delete`)
        .removeEventListener(`click`, this._onDeleteButtonClick);
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  static createMapper(target) {
    return {
      hashtag: (value) => target.tags.add(value),
      text: (value) => (target.title = value),
      color: (value) => (target.color = value),
      repeat: (value) => (target.repeatingDays[value] = true),
      date: (value) => target.dueDate[value],
    };
  }
}
