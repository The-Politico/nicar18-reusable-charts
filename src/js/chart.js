import d3 from './d3';

const defaultData = require('../data/data.json');

// This is the chart function that will be exported
export default () => ({

  // Develop the reusable function for your chart in this render function.
  // cf. https://bost.ocks.org/mike/chart/
  render() {
    // Set default chart properties in this object. Users can overwrite
    // them by passing a props object to the chart creator.
    let props = {
      stroke: '#eee',
    };

    // Inner chart function
    function chart(selection) {
      selection.each(function (data) { // eslint-disable-line func-names
        // "this" refers to the selection
        const bbox = this.getBoundingClientRect();
        const width = bbox.width < bbox.height ? bbox.width : bbox.height;
        const height = width;
        const t = d3.transition()
          .duration(750);

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
          .style('display', 'block')
          .style('margin', 'auto')
          .appendSelect('g');

        const circles = g.selectAll('circle') // Data join
          .data(data, (d, i) => i);

        circles.transition(t) // Update properties
          .attr('fill', '#0f516e');

        circles.enter().append('circle') // Enter
          .attr('fill', '#FF7216') // Enter properties
          .attr('cy', '60')
          .style('stroke', props.stroke)
          .style('stroke-width', '1px')
          .attr('cx', (d, i) => {
            function add(a, b) { return a + b; }
            return data.slice(0, i).reduce(add, 0) + (d / 2);
          })
          .merge(circles)
          .transition(t) // Enter + Update properties
          .attr('cx', (d, i) => {
            function add(a, b) { return a + b; }
            return data.slice(0, i).reduce(add, 0) + (d / 2);
          })
          .attr('r', d => d / 2);
      });
    }

    // Getter-setters merge any provided properties with defaults.
    chart.props = (obj) => {
      if (!obj) return props;
      props = Object.assign(props, obj);
      return chart;
    };

    return chart;
  },


  // This function actually draws the chart using the
  // idempotent render function.
  draw() {
    const chart = this.render()
      .props(this._props);

    d3.select(this._selection)
      .datum(this._data)
      .call(chart);
  },

  // Creates the chart initially.
  create(selection, data, props) {
    this._selection = selection;
    this._data = data ? data : defaultData;
    this._props = props || {};

    this.draw();
  },

  // Updates the elements with new data.
  update(data) {
    this._data = data ? data : defaultData;
    this.draw();
  },

  // Resizes the chart.
  resize() {
    this.draw();
  },
});
