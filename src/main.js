import createFilter from './make-filter';
import createCard from './make-task';

const FILTERS_CONTAINER = document.querySelector(`.main__filter`);
FILTERS_CONTAINER.innerHTML = ``;

const CARDS_CONTAINER = document.querySelector(`.board__tasks`);
CARDS_CONTAINER.innerHTML = ``;
const CARDS_COUNT = 7;
const TASK_FILTERS = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;

TASK_FILTERS.forEach(function (item, i) {
  FILTERS_CONTAINER.innerHTML += createFilter(
      item,
      getRandomInteger(0, 30),
      i === 0 ? true : ``,
      i === 1 || i === 2 ? true : ``
  );
}
);

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
    createCards(getRandomInteger(1, CARDS_COUNT));
  }
}

createCards(CARDS_COUNT);

function createCards(count) {
  CARDS_CONTAINER.innerHTML = ``;
  for (let i = 1; i <= count; i++) {
    CARDS_CONTAINER.innerHTML += createCard(i);
  }
}
