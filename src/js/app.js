import '../scss/app.scss';
import _ from 'lodash';
import chart from './chart';
import d3 from './d3';
import singleLine from '../data/single-line.json';
import multipleLine from '../data/multiple-line.json';

const myChart = new chart();
const parseDate = d3.timeParse('%Y');

// PROCESS OUR DATA
const singleLineData = singleLine.map((d) => {
  return {
    x: parseDate(d.year),
    y: d.value,
  };
});

const multiLineData = multipleLine.map((d) => {
  return {
    key: d.key,
    x: d.values.map(x => parseDate(x.Year)),
    y: d.values.map(y => y.Value),
  };
});

console.log(singleLineData, multiLineData)

// This is the initial draw, using our create method.
// It needs a selection string (html element), data and our custom props object.
// myChart.create('#chart', singleLineData, {
//   // yScale: d3.scaleOrdinal(),
//   parseDate: d3.timeParse('%Y'),
//   xTickFormat: d => `Q1 ${d3.timeFormat('%y')(d)}`,
//   yTickFormat: (d, i, o) => {
//     if (i === o.length - 1) {
//       return d3.format('$.0f')(d);
//     }
//     return d;
//   },
//   yTickSteps: d3.range(35, 100, 10),
// });

myChart.create('#chart', multiLineData, {
  // yScale: d3.scaleOrdinal(),
  // parseDate: d3.timeParse('%Y'),
  // xTickFormat: d => `Q1 ${d3.timeFormat('%y')(d)}`,
  // yTickFormat: (d, i, o) => {
  //   if (i === o.length - 1) {
  //     return d3.format('$.0f')(d);
  //   }
  //   return d;
  // },
  // yTickSteps: d3.range(35, 100, 10),
});
