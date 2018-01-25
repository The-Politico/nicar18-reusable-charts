import '../scss/app.scss';
import chart from './chart';
import d3 from './d3';
import linearData from '../data/linear.json';

const myChart = new chart();
const parseDate = d3.timeParse('%Y');

// PROCESS OUR DATA
const data = linearData.map((d) => {
  return {
    x: parseDate(d.year),
    y: d.value,
  };
});

// This is the initial draw, using our create method.
// It needs a selection string (html element), data and our custom props object.
myChart.create('#chart', data, {
  // yScale: d3.scaleOrdinal(),
  parseDate: d3.timeParse('%Y'),
  xTickFormat: d => `Q1 ${d3.timeFormat('%y')(d)}`,
  yTickFormat: (d, i, o) => {
    if (i === o.length - 1) {
      return `${d3.format('$.0f')(d)}`;
    }
    return d;
  },
  yTickSteps: d3.range(35, 100, 10),
});
