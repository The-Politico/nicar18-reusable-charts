import '../scss/app.scss';
import _ from 'lodash';
import d3 from './d3';
import singleLine from '../data/single-line.json';
import multipleLine from '../data/multiple-line.json';
// import chart from './file-1';
// import chart from './file-2';
// import chart from './file-3';
// import chart from './file-4';
import chart from './file-5';

// import chart from './chart';
// const parseYear = d3.timeParse('%Y');

// Declare our singleLine chart module
const myChart = new chart();

// SINGLE LINE CHART
// This is the initial draw, using our create method.
// It needs a selection string (html element), data and our custom props object.
myChart.create('#single-line-chart', singleLine, {
  // xTickFormat: d => `Q1 ${d3.timeFormat('%y')(d)}`,
  // yTickFormat: (d, i, o) => {
  //   if (i === o.length - 1) {
  //     return d3.format('$.0f')(d);
  //   }
  //   return d;
  // },
  // yTickSteps: d3.range(35, 100, 10),
  // xAccessor: d => d.year,
  // yAccessor: d => d.value,
  labelAccessor: () => 'if this does not exist in your data, it can be anything!',
});


// MULTI-LINE CHART
// Declare our multiLine chart module
// const myMultiLineChart = new chart();
// // This is the initial draw, using our create method.
// // It needs a selection string (html element), data and our custom props object.
// myMultiLineChart.create('#multiple-line-chart', multipleLine, {
// });


// RESIZE FUNCTION
// const resizeDb = _.debounce(() => {
//   myChart.resize();
//   // myMultiLineChart.resize();
// }, 400);
//
// window.addEventListener('resize', () => {
//   resizeDb();
// });
