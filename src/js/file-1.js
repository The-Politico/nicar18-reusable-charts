// Import our custom d3 module using ES6
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
    let props = {};

    function chart(selection) {
      selection.each(function (data) { // eslint-disable-line func-names
      // This is the inner chart function where we actually draw our chart.
      // Here we'll set up our chart width and height
      // And pass our chart data.
      });
    }

    // Right outside of chart function is an important piece of boilerplate code.
    // It's known as a getter-setter.
    // What that means, in our case, is it merges default properties with user provided properties.
    chart.props = (obj) => {
      if (!obj) return props;
      props = Object.assign(props, obj);
      // console.log(props);
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

    console.log(this._props);

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
