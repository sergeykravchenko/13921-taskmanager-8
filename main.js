'use strict';

const FILTERS_CONTAINER = document.querySelector(`.main__filter`);
FILTERS_CONTAINER.innerHTML = ``;
const CARDS_CONTAINER = document.querySelector(`.board__tasks`);
CARDS_CONTAINER.innerHTML = ``;
const CARDS_COUNT = 7;
const TASK_FILTERS = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];
const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;

TASK_FILTERS.forEach((item, i) => createFilter(
    item,
    getRandomInteger(0, 30),
    i === 0 ? true : ``,
    i === 1 || i === 2 ? true : ``
)
);

createCards(CARDS_COUNT);

FILTERS_CONTAINER.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  onFilterClick(evt);
});

function onFilterClick(evt) {
  const target = evt.target;
  const sibling = target.previousElementSibling;

  if (target.classList.contains(`filter__label`) && !sibling.checked === true && !sibling.disabled === true) {
    const activeElement = FILTERS_CONTAINER.querySelector(`[checked]`);
    if (activeElement) {
      activeElement.checked = false;
    }
    sibling.checked = true;
    createCards(getRandomInteger(0, CARDS_COUNT));
  }
}

function createFilter(filterName, count, isChecked = false, isDisabled = false) {
  const filterTemplate = `<input
  type="radio"
  id="filter__${filterName}"
  class="filter__input visually-hidden"
  name="filter"
  ${isChecked ? ` checked` : ``}
  ${isDisabled ? ` disabled` : ``}
/>
<label for="${filterName}" class="filter__label">
${filterName.toUpperCase()} <span class="filter__${filterName}-count">${count}</span></label
>`;

  FILTERS_CONTAINER.innerHTML += filterTemplate;
}

function createCards(count) {
  CARDS_CONTAINER.innerHTML = ``;
  for (let i = 1; i <= count; i++) {
    createCard(i);
  }
}

function dayTemplate(color, cardIndex, isChecked = false) {
  return `<input
  type="radio"
  id="color-${color}-${cardIndex}"
  class="card__color-input card__color-input--${color} visually-hidden"
  name="color"
  value="${color}"
  ${isChecked ? ` checked` : ``}
/>
<label
  for="color-${color}-${cardIndex}"
  class="card__color card__color--${color}"
  >${color}</label
>`;
}

function colorsTemplate(color, cardIndex, isChecked = false) {
  return `<input
  type="radio"
  id="color-${color}-${cardIndex}"
  class="card__color-input card__color-input--${color} visually-hidden"
  name="color"
  value="${color}"
  ${isChecked ? ` checked` : ``}
/>
<label
  for="color-${color}-${cardIndex}"
  class="card__color card__color--${color}"
  >${color}</label
>`;
}

function createRepeatNodes(data, template, cardIndex) {
  let result = ``;
  data.forEach(function (item, i) {
    result += template(item, cardIndex, i === 0 ? true : ``);
  });
  return result;
}

function createCard(index) {
  const cardTemplate = `<article class="card card--blue">
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
          ></textarea>
        </label>
      </div>

      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            <button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">no</span>
            </button>

            <fieldset class="card__date-deadline" disabled>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder="23 September"
                  name="date"
                />
              </label>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__time"
                  type="text"
                  placeholder="11:15 PM"
                  name="time"
                />
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">
              repeat:<span class="card__repeat-status">no</span>
            </button>

            <fieldset class="card__repeat-days" disabled>
              <div class="card__repeat-days-inner">
                ${createRepeatNodes(DAYS, dayTemplate, index)}
              </div>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="repeat"
                  class="card__hashtag-hidden-input"
                />
                <button type="button" class="card__hashtag-name">
                  #repeat
                </button>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>

              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="repeat"
                  class="card__hashtag-hidden-input"
                />
                <button type="button" class="card__hashtag-name">
                  #cinema
                </button>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>

              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="repeat"
                  class="card__hashtag-hidden-input"
                />
                <button type="button" class="card__hashtag-name">
                  #entertaiment
                </button>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>
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

        <label class="card__img-wrap card__img-wrap--empty">
          <input
            type="file"
            class="card__img-input visually-hidden"
            name="img"
          />
          <img
            src="img/add-photo.svg"
            alt="task picture"
            class="card__img"
          />
        </label>

        <div class="card__colors-inner">
          <h3 class="card__colors-title">Color</h3>
          <div class="card__colors-wrap">
            ${createRepeatNodes(COLORS, colorsTemplate, index)}
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

  CARDS_CONTAINER.innerHTML += cardTemplate;
}
