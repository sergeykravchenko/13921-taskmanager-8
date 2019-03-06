import util from './util';

export default class Task {
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
    this._cardIndex = cardIndex;
    this.fn = this._onEditButtonClick.bind(this);
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
    const dateToArray = standardDate.toString().split(` `);
    const dateTemplate = {
      day: dateToArray[2],
      month: this._months[standardDate.getMonth()],
      time: dateToArray[4].slice(0, 5)
    };
    return dateTemplate;
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="card card--${this._color} ${this._isRepeated() ? `card--repeat` : ``} ${this._dueDate < Date.now() ? `card--deadline` : ``}">
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

              <fieldset class="card__repeat-days" disabled>
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
                </span>
                `)).join(``)}
              </div>
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
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this.fn);
  }

  unbind() {
    this._element.querySelector(`.card__btn--edit`)
        .removeEventListener(`click`, this.fn);
  }
}
