import util from './util';
import getTask from './get-task';
import createFilter from './make-filter';
import Task from './task';
import EditTask from './edit-task';

const FILTERS_CONTAINER = document.querySelector(`.main__filter`);
const CARDS_CONTAINER = document.querySelector(`.board__tasks`);
const CARDS_COUNT = 7;
const TASK_FILTERS = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

createFilters();
createCards(CARDS_COUNT);

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

function createCards(count) {
  CARDS_CONTAINER.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const task = new Task(getTask(), i + 1);
    const editTask = new EditTask(getTask(), i + 1);

    task.onEdit = () => {
      editTask.render();
      CARDS_CONTAINER.replaceChild(editTask.element, task.element);
      task.unrender();
    };

    editTask.onSubmit = () => {
      task.render();
      CARDS_CONTAINER.replaceChild(task.element, editTask.element);
      editTask.unrender();
    };

    task.render();
    fragment.appendChild(task.element);
  }
  CARDS_CONTAINER.appendChild(fragment);
}
