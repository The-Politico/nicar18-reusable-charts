import '../scss/app.scss';
import chart from './chart';
import d3 from './d3';
import linearData from '../data/linear.json';

const myChart = new chart();

// This is the initial draw, using our create method.
// It needs a selection string (html element), data and our custom props object.
myChart.create('#chart', linearData, {
  // yScale: d3.scaleOrdinal(),
});
