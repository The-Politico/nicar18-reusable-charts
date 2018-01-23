// Import lodash + our custom d3 module using ES6
import _ from 'lodash';
import d3 from './d3';

// Here we create our own chart module that can be exported
// and imported in other projects, just like we did with our custom d3 script above.
export default () => ({

  // Here's where the bulk of our chart code lives.
  // In our render function, we pass in customizable properties specific to our chart
  // and we also create a chart function where we pass in the html element that contains our chart
  // This structure builds upon concepts from Mike Bostock discussed here: https://bost.ocks.org/mike/chart/
  render() {
    // This is our props object.
    // We set default chart properties in this object that users can overwrite
    // by passing a props object to their chart creator (this will be in our index file).
    let props = {
      margins: {
        top: 25,
        right: 20,
        left: 40,
        bottom: 25,
      },
      xScale: d3.scaleTime(),
      yScale: d3.scaleLinear(),
    };

    function chart(selection) {
      selection.each(function (data) { // eslint-disable-line func-names
      // This is the inner chart function where we actually draw our chart.
      // Here we'll set up our chart width and height
      // And pass our chart data.

        // "this" refers to the selection
        const bbox = this.getBoundingClientRect();
        const { width } = bbox;
        const { height } = bbox;
        const innerWidth = width - props.margins.right - props.margins.left;
        const innerHeight = height - props.margins.top - props.margins.bottom;

        const parseDate = d3.timeParse('%Y');

        const parseData = o => ({
          x: parseDate(o.year),
          y: +o.value,
        });

        const parsedData = _.map(data, parseData);

        const xScale = props.xScale
          .domain([parseDate('2011'), parseDate('2017')])
          .range([0, innerWidth]);

        const yScale = props.yScale
          .domain([30, 100])
          .range([innerHeight, 0]);

        const line = d3.line()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y));

        // appendSelect will either append an element that doesn't exist yet
        // or select one that already does. This is useful for making this
        // function idempotent. Use it this way:
        //
        // selection.appendSelect(<element selector>, <class string>)
        //
        // You can also chain calls like below:
        const g = d3.select(this)
          .appendSelect('svg')
          .attr('width', width)
          .attr('height', height)
          .appendSelect('g', 'chart')
          .attr('transform', `translate(${props.margins.left}, ${props.margins.top})`);

        const lines = g.selectAll('path.line')
          .data([parsedData]);

        lines.enter()
          .append('path')
          .attr('class', 'line')
          .merge(lines)
          .attr('d', line);
      });
    }

    // Right outside of chart function is an important piece of boilerplate code.
    // It's known as a getter-setter.
    // What that means, in our case, is it merges default properties with user provided properties.
    chart.props = (obj) => {
      if (!obj) return props;
      props = Object.assign(props, obj);
      console.log(props);
      return chart;
    };
    // Here's where we return our chart function
    return chart;
  },

  // Here's where we actually draw our chart using our render function.
  // We also pass in our chart properties here.
  draw() {
    const chart = this.render()
      .props(this._props);

    d3.select(this._selection)
      .datum(this._data)
      .call(chart);
  },

  // We use the create method to initially draw our chart
  // Unlike the update and resize methods, this method expects our actual html selector
  // (which is needed by our chart function (inside render) to actually draw the chart)
  // We also pass in our data and custom props here.
  create(selection, data, props) {
    this._selection = selection;
    this._data = data;
    this._props = props || {};

    this.draw();
  },

  // Method that is useful for updating our chart with new data.
  update(data) {
    this._data = data;
    this.draw();
  },

  // Helper method to resize our chart and make it responsive.
  resize() {
    this.draw();
  },
});
