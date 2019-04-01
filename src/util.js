const util = {
  getRandomInteger: (max, min = 0) => Math.floor(Math.random() * (max - min)) + min,
  getRandomBoolean: () => [true, false][util.getRandomInteger(2)],
  getRandomFrom: (array) => array[util.getRandomInteger(array.length)],
  getRandomsFrom: (array, count) => array.slice(array.length - util.getRandomInteger(count + 1)),
  createElement: (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template.trim();
    if (newElement.children.length > 1) {
      return newElement;
    }
    return newElement.firstChild;
  },
  objectToArray: (object) => {
    return Object.keys(object).map((id) => object[id]);
  }
};

export default util;
