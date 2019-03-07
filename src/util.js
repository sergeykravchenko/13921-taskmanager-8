const util = {
  getRandomInteger: (max, min = 0) => Math.floor(Math.random() * (max - min)) + min,
  getRandomBoolean: () => [true, false][util.getRandomInteger(2)],
  getRandomFrom: (array) => array[util.getRandomInteger(array.length)],
  getRandomsFrom: (array, count) => array.slice(array.length - util.getRandomInteger(count + 1)),
  createElement: (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }
};

export default util;
