import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';
import moment from 'moment';

export const STATS = document.querySelector(`.statistic`);
const tagsWrap = STATS.querySelector(`.statistic__tags-wrap`);
const tagsCtx = STATS.querySelector(`.statistic__tags`);
const colorsWrap = STATS.querySelector(`.statistic__colors-wrap`);
const colorsCtx = STATS.querySelector(`.statistic__colors`);
const firstDayWeek = moment().startOf(`isoWeek`);
const lastDayWeek = moment().endOf(`isoWeek`);
let tagsChart;
let colorsChart;

function statsInit(tasks) {
  tagsWrap.classList.remove(`visually-hidden`);
  colorsWrap.classList.remove(`visually-hidden`);
  flatpickr(STATS.querySelector(`.statistic__period-input`), {
    mode: `range`,
    defaultDate: [
      firstDayWeek.format(`DD MMMM`),
      lastDayWeek.format(`DD MMMM`)
    ],
    onClose: (selectedDates) => onCloseDate(selectedDates, tasks),
    altInput: true,
    altFormat: `j F`,
    dateFormat: `j F`
  });

  const tagsData = getTagsData(firstDayWeek, lastDayWeek, tasks);
  const colorsData = getColorsData(firstDayWeek, lastDayWeek, tasks);

  tagsChart = new Chart(tagsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: tagsData.labels,
      datasets: [{
        data: tagsData.values,
        backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: TAGS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });

  colorsChart = new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: colorsData.labels,
      datasets: [{
        data: colorsData.values,
        backgroundColor: colorsData.bgColors
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
}

function getTagsData(firstDay, lastDay, data) {
  const tagsStats = {};
  filterByRange(firstDay, lastDay, data).forEach((item) => {
    item.tags.forEach((tag) => {
      if (tagsStats.hasOwnProperty(tag)) {
        tagsStats[tag]++;
      } else {
        tagsStats[tag] = 1;
      }
    });
  });
  const labels = Object.keys(tagsStats);
  const values = Object.values(tagsStats);
  return {labels, values};
}

function getColorsData(firstDay, lastDay, data) {
  const colorsStats = {};
  filterByRange(firstDay, lastDay, data).forEach((item) => {
    if (colorsStats.hasOwnProperty(item.color)) {
      colorsStats[item.color]++;
    } else {
      colorsStats[item.color] = 1;
    }
  });
  const labels = Object.keys(colorsStats);
  const values = Object.values(colorsStats);
  const bgColors = [];
  labels.forEach((item) => bgColors.push(item));
  return {labels, values, bgColors};
}

function filterByRange(firstDay, lastDay, data) {
  return data.filter((item) => item.dueDate > firstDay && item.dueDate < lastDay);
}

function onCloseDate(dates, tasks) {
  const tagsData = getTagsData(dates[0], dates[1], tasks);
  const colorsData = getColorsData(dates[0], dates[1], tasks);
  updateChart(tagsChart, tagsData.labels, tagsData.values);
  updateChart(colorsChart, colorsData.labels, colorsData.values, colorsData.bgColors);
}

function updateChart(chart, labels, values, bgColors = false) {
  chart.data.labels = labels;
  chart.data.datasets.data = values;
  if (bgColors) {
    bgColors = chart.data.datasets.backgroundColor = bgColors;
  }
  chart.update();
}

export default statsInit;
