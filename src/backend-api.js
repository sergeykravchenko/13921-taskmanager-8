import ModelTask from './model-task';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusCode = {
  OK: 200,
  REDIRECT: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

const checkStatus = (response) => {
  if (response.status >= StatusCode.OK && response.status < StatusCode.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class Api {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then(toJSON)
      .then(ModelTask.parseTasks);
  }

  createTask({task}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  deleteTask({id}) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  syncTasks({tasks}) {
    return this._load({
      url: `tasks/sync`,
      method: `POST`,
      body: JSON.stringify(tasks),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
