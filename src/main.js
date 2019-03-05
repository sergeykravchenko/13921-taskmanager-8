import util from './util';
import getTask from './get-task';
import createFilter from './make-filter';
import createCard from './make-task';

const FILTERS_CONTAINER = document.querySelector(`.main__filter`);
const CARDS_CONTAINER = document.querySelector(`.board__tasks`);
const CARDS_COUNT = 7;
const TASK_FILTERS = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
const taskData = createData(CARDS_COUNT);

createFilters();
createCards(taskData);

FILTERS_CONTAINER.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  onFilterClick(evt);
});

function createFilters() {
  FILTERS_CONTAINER.innerHTML = ``;
  let filterTemplate = ``;
  TASK_FILTERS.forEach(function (item, i) {
    filterTemplate += createFilter(
        item,
        util.getRandomInteger(0, 30),
        i === 0 ? true : ``,
        i === 1 || i === 2 ? true : ``
    );
  });
  FILTERS_CONTAINER.innerHTML = filterTemplate;
}

function onFilterClick(evt) {
  const target = evt.target;
  const sibling = target.previousElementSibling;

  if (target.classList.contains(`filter__label`) && !sibling.checked === true && !sibling.disabled === true) {
    const activeElement = FILTERS_CONTAINER.querySelector(`[checked]`);
    if (activeElement) {
      activeElement.checked = false;
    }
    sibling.checked = true;
    createCards(util.getRandomInteger(1, CARDS_COUNT));
  }
}

function createCards(data) {
  CARDS_CONTAINER.innerHTML = ``;
  const cards = data.map((item, i) => createCard(item, i));
  CARDS_CONTAINER.innerHTML = cards.join(``);
}

function createData(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(getTask());
  }
  return result;
}
