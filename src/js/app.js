import '../scss/app.scss';
import _ from 'lodash';
import chart from './chart';
import d3 from './d3';
import singleLine from '../data/single-line.json';
import multipleLine from '../data/multiple-line.json';

const myChart = new chart();
const parseYear = d3.timeParse('%Y');
const parseTime = d3.timeParse('%Y%m%d');

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
  xAccessor: d => parseYear(d.year),
  labelAccessor: () => 'if this does not exist in your data, it can be anything!',
});

myChart.create('#multiple-line-chart', multipleLine, {
  xAccessor: d => parseYear(d.year),
  labelAccessor: d => d.cat,
});
