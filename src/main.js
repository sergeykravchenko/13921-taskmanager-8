import util from './util';
import getTask from './get-task';
import Task from './task';
import EditTask from './edit-task';
import Filter from './filter';
import moment from 'moment';
import {default as statsInit, STATS} from './stats';

const FILTERS_CONTAINER = document.querySelector(`.main__filter`);
const CARDS_CONTAINER = document.querySelector(`.board__tasks`);
const tasksButton = document.querySelector(`#control__task`);
const statsButton = document.querySelector(`#control__statistic`);
const CARDS_COUNT = 7;
let cardsData = createData(CARDS_COUNT);
const FILTER_MAX_COUNT = 30;

const TaskFilters = [
  {
    filterName: `ALL`,
    filterId: `all`,
    count: util.getRandomInteger(FILTER_MAX_COUNT),
    isActive: true
  },
  {
    filterName: `OVERDUE`,
    filterId: `overdue`,
    count: util.getRandomInteger(FILTER_MAX_COUNT),
    isActive: false
  },
  {
    filterName: `TODAY`,
    filterId: `today`,
    count: util.getRandomInteger(FILTER_MAX_COUNT),
    isActive: false
  },
  {
    filterName: `REPEATING`,
    filterId: `repeating`,
    count: util.getRandomInteger(FILTER_MAX_COUNT),
    isActive: false
  }
];

const filterTypes = {
  all: () => cardsData,
  overdue: () => cardsData.filter((item) => item.dueDate < moment()),
  today: () => cardsData.filter((item) => moment(item.dueDate).isSame(moment(), `day`)),
  repeating: () => cardsData.filter((item) => Object.entries(item.repeatingDays).some((entry) => entry[1]))
};

createFilters();
renderTasks(CARDS_CONTAINER, cardsData);
tasksButton.addEventListener(`click`, onTasksButtonClick);
statsButton.addEventListener(`click`, onStatsButtonClick);

function onTasksButtonClick() {
  document.querySelector(`.board.container`).classList.remove(`visually-hidden`);
  STATS.classList.add(`visually-hidden`);
}

function onStatsButtonClick() {
  document.querySelector(`.board.container`).classList.add(`visually-hidden`);
  STATS.classList.remove(`visually-hidden`);
  statsInit(cardsData);
}

function createFilters() {
  const fragment = document.createDocumentFragment();

  TaskFilters.forEach(function (item) {
    const filter = new Filter(item);

    filter.onFilter = () => {
      const data = filterTypes[filter.id]();
      renderTasks(CARDS_CONTAINER, data);
    };

    filter.render();
    fragment.appendChild(filter.element);
  });
  FILTERS_CONTAINER.appendChild(fragment);
}

function renderTasks(container, data) {
  container.innerHTML = ``;
  const tasks = createTasks(data);
  container.appendChild(tasks);
}

function createTasks(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((item, i, array) => {
    const task = new Task(item, i + 1);
    const editTask = new EditTask(item, i + 1);

    task.onEdit = () => {
      editTask.render();
      CARDS_CONTAINER.replaceChild(editTask.element, task.element);
      task.unrender();
    };

    editTask.onSubmit = (newObject) => {
      const updatedTask = updateTask(cardsData, i, newObject);

      task.update(updatedTask);
      task.render();
      CARDS_CONTAINER.replaceChild(task.element, editTask.element);
      editTask.unrender();
    };

    editTask.onDelete = () => {
      array.splice(i, 1);
      editTask.unrender();
      cardsData = array;
      renderTasks(CARDS_CONTAINER, cardsData);
    };

    task.render();
    fragment.appendChild(task.element);
  });

  return fragment;
}

function updateTask(tasks, i, newTask) {
  tasks[i] = Object.assign({}, tasks[i], newTask);
  return tasks[i];
}

function createData(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(getTask());
  }
  return result;
}
