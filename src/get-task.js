import util from './util';

const TAGS_COUNT = 3;

const Time = {
  DAYS: 7,
  MS_IN_DAY: 86400000
};

const titles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const tags = new Set([
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `entertainment`,
  `myself`,
  `cinema`
]);

const colors = new Set([
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
]);

const repeatingDays = () => ({
  'mo': util.getRandomBoolean(),
  'tu': util.getRandomBoolean(),
  'we': util.getRandomBoolean(),
  'th': util.getRandomBoolean(),
  'fr': util.getRandomBoolean(),
  'sa': util.getRandomBoolean(),
  'su': util.getRandomBoolean(),
});

export {colors};

export default () => ({
  title: util.getRandomFrom(titles),
  dueDate: Date.now() + util.getRandomInteger(Time.DAYS + 1, -Time.DAYS) * util.getRandomInteger(Time.MS_IN_DAY),
  tags: util.getRandomsFrom([...tags], TAGS_COUNT),
  picture: `//picsum.photos/100/100?r=${util.getRandomInteger(100)}`,
  color: util.getRandomFrom([...colors]),
  repeatingDays: repeatingDays(),
  isFavorite: util.getRandomBoolean(),
  isDone: util.getRandomBoolean()
});
