import '../scss/app.scss';
import _ from 'lodash';
import chart from './chart';
import d3 from './d3';
import singleLine from '../data/single-line.json';
import multipleLine from '../data/multiple-line.json';

const myChart = new chart();
const parseDate = d3.timeParse('%Y');
const parseTime = d3.timeParse('%Y%m%d');

// PROCESS OUR SINGLE LINE DATA
const singleLineData = singleLine[0].map((d) => {
  return {
    x: parseDate(d.year),
    y: d.value,
  };
});

console.log(singleLineData)

// This is the initial draw, using our create method.
// It needs a selection string (html element), data and our custom props object.
myChart.create('#chart', singleLineData, {
  parseDate: d3.timeParse('%Y'),
  xTickFormat: d => `Q1 ${d3.timeFormat('%y')(d)}`,
  yTickFormat: (d, i, o) => {
    if (i === o.length - 1) {
      return d3.format('$.0f')(d);
    }
    return d;
  },
  yTickSteps: d3.range(35, 100, 10),
});


// PROCESS OUR MULTILINE DATA
// create an array of our dataValue keys
const dataKeys = d3.keys(multipleLine[0]).filter(key => key !== 'date');

// map our dataValue keys to our data
const multipleLineData = dataKeys.map(key => multipleLine.map(val => ({
  x: parseTime(val.date),
  y: val[key],
  z: key,
})));

// console.log(multipleLineData)

// concat our arrays of objects into one array of objects
// const mergedMultipleLineData = [].concat(...multipleLineData);

// myChart.create('#chart', multipleLineData, {
//   xTickFormat: d => d3.timeFormat('%b')(d),
// });
