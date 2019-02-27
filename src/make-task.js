function dayTemplate(days, cardIndex, isChecked = false) {
  let daysTemplate = ``;
  for (const day in days) {
    if (days.hasOwnProperty(day)) {
      daysTemplate += `<input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${day}-${cardIndex}"
    name="repeat"
    value="${day}"
    ${isChecked ? ` checked` : ``}
  />
  <label class="card__repeat-day" for="repeat-${day}-${cardIndex}"
    >${day}</label
  >`;
    }
  }
  return daysTemplate;
}

function hashtagTemplate(hashtag) {
  let hashtagsTemplate = ``;
  hashtag.forEach((item) => {
    hashtagsTemplate += `<span class="card__hashtag-inner">
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
</span>`;
  });
  return hashtagsTemplate;
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

function isRepeated(days) {
  for (const day in days) {
    if (days.hasOwnProperty(day)) {
      if (days[day]) {
        return true;
      }
    }
  }
  return false;
}

const months = [
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

function convertDate(date) {
  const standardDate = new Date(date);
  const dateToArray = standardDate.toString().split(` `);
  const dateTemplate = {
    day: dateToArray[2],
    month: months[standardDate.getMonth()],
    time: dateToArray[4].slice(0, 5)
  };
  return dateTemplate;
}

export default (task, index) => `<article class="card card--${task.colors} ${isRepeated(task.repeatingDays) ? `card--repeat` : ``} ${task.dueDate < Date.now() ? `card--deadline` : ``}">
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
          >${task.title}</textarea>
        </label>
      </div>

      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            <button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">no</span>
            </button>

            <fieldset class="card__date-deadline" ${task.dueDate ? `` : `disabled`}>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder="${convertDate(task.dueDate).day} ${convertDate(task.dueDate).month}"
                  name="date"
                />
              </label>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__time"
                  type="text"
                  placeholder="${convertDate(task.dueDate).time}"
                  name="time"
                />
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">
              repeat:<span class="card__repeat-status">${isRepeated(task.repeatingDays) ? `yes` : `no`}</span>
            </button>

            <fieldset class="card__repeat-days" disabled>
              <div class="card__repeat-days-inner">
                ${dayTemplate(task.repeatingDays, index)}
              </div>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
              ${hashtagTemplate(task.tags)}
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

        <label class="card__img-wrap ${task.picture ? `` : `card__img-wrap--empty`}">
          <input
            type="file"
            class="card__img-input visually-hidden"
            name="img"
          />
          <img
            src="${task.picture}"
            alt="task picture"
            class="card__img"
          />
        </label>

        <div class="card__colors-inner">
          <h3 class="card__colors-title">${task.colors}</h3>
          <div class="card__colors-wrap">
            ${colorsTemplate(task.colors, index)}
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
