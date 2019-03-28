import Task from './task';
import EditTask from './edit-task';
import Filter from './filter';
import moment from 'moment';
import {default as statsInit, STATS} from './stats';
import Api from './backend-api.js';

const BOARD = document.querySelector(`.board.container`);
const TASKS_EMPTY = BOARD.querySelector(`.board__no-tasks`);
const FILTERS_CONTAINER = document.querySelector(`.main__filter`);
const TASKS_CONTAINER = document.querySelector(`.board__tasks`);
const tasksButton = document.querySelector(`#control__task`);
const statsButton = document.querySelector(`#control__statistic`);
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;

const TaskFilters = [
  {
    filterName: `ALL`,
    filterId: `all`,
    count: ``,
    isActive: true
  },
  {
    filterName: `OVERDUE`,
    filterId: `overdue`,
    count: ``,
    isActive: false
  },
  {
    filterName: `TODAY`,
    filterId: `today`,
    count: ``,
    isActive: false
  },
  {
    filterName: `REPEATING`,
    filterId: `repeating`,
    count: ``,
    isActive: false
  }
];

const api = new Api({endPoint: END_POINT, authorization: AUTHORIZATION});

const onLoadTasks = () => {
  TASKS_CONTAINER.classList.add(`visually-hidden`);
  TASKS_EMPTY.classList.remove(`visually-hidden`);
  TASKS_EMPTY.innerHTML = `Loading tasks...`;
};

const onLoadTasksError = () => {
  TASKS_EMPTY.innerHTML = `Something went wrong while loading your tasks. Check your connection or try again later`;
};

const onLoadTasksEnd = () => {
  TASKS_CONTAINER.classList.remove(`visually-hidden`);
  TASKS_EMPTY.classList.add(`visually-hidden`);
};

const filterTypes = (data) => ({
  all: () => data,
  overdue: () => data.filter((item) => item.dueDate < moment()),
  today: () => data.filter((item) => moment(item.dueDate).isSame(moment(), `day`)),
  repeating: () => data.filter((item) => Object.values(item.repeatingDays).includes(true))
});

const createFilters = (data) => {
  FILTERS_CONTAINER.innerHTML = ``;
  const fragment = document.createDocumentFragment();

  TaskFilters.forEach(function (item) {
    const filter = new Filter(item);

    filter.onFilter = () => {
      const result = filterTypes(data)[filter.id]();
      renderTasks(TASKS_CONTAINER, result);
    };

    filter.render();
    fragment.appendChild(filter.element);
  });
  FILTERS_CONTAINER.appendChild(fragment);
};

const createTasks = (data) => {
  const fragment = document.createDocumentFragment();

  data.forEach((item, i) => {
    const task = new Task(item, i + 1);
    const editTask = new EditTask(item, i + 1);

    task.onEdit = () => {
      editTask.render();
      TASKS_CONTAINER.replaceChild(editTask.element, task.element);
      task.unrender();
    };

    editTask.onSubmit = (newObject) => {
      task.update(newObject);
      editTask.setBorderColor(`#000`);
      editTask.blockOnSave();

      api.updateTask({id: task.id, data: task.toRAW()})
        .then((newTask) => {
          editTask.enableAfterSave();
          task.update(newTask);
          task.render();
          TASKS_CONTAINER.replaceChild(task.element, editTask.element);
          editTask.unrender();
          api.getTasks().then((updatedTasks) => createFilters(updatedTasks));
        })
        .catch(() => {
          editTask.styleOnError();
          editTask.enableAfterSave();
        });
    };

    editTask.onDelete = ({id}) => {
      editTask.setBorderColor(`#000`);
      editTask.blockOnDelete();
      api.deleteTask({id})
        .then(() => api.getTasks())
        .then((newTasks) => {
          createFilters(newTasks);
          renderTasks(TASKS_CONTAINER, newTasks);
        })
        .catch(() => {
          editTask.styleOnError();
          editTask.enableAfterDelete();
        });
    };

    task.render();
    fragment.appendChild(task.element);
  });

  return fragment;
};

const renderTasks = (container, data) => {
  container.innerHTML = ``;
  const tasks = createTasks(data);
  container.appendChild(tasks);
};

const onTasksButtonClick = () => {
  document.querySelector(`.board.container`).classList.remove(`visually-hidden`);
  STATS.classList.add(`visually-hidden`);
};

let tasksData = [];
const onStatsButtonClick = () => {
  BOARD.classList.add(`visually-hidden`);
  STATS.classList.remove(`visually-hidden`);
  statsInit(tasksData);
};

tasksButton.addEventListener(`click`, onTasksButtonClick);
statsButton.addEventListener(`click`, onStatsButtonClick);

onLoadTasks();

api.getTasks()
  .then((tasks) => {
    tasksData = tasks;
    createFilters(tasks);
    renderTasks(TASKS_CONTAINER, tasks);
  })
  .then(onLoadTasksEnd)
  .catch(onLoadTasksError);
