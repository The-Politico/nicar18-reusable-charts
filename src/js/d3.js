/* eslint-disable func-names */
import * as d3 from 'd3';


d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function () {
  return this.each(function () {
    const firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};


/**
 * appendSelect either selects a child of current selection or appends
 * one to the selection if it doesn't exist. Useful for writing idempotent functions.
 *
 * @param  {string} el  String representation of element to be appended/selected.
 * @param  {String} cls Class string (w/out dots) of element to be appended/
 *                      selected. Can pass none or multiple separated by whitespace.
 * @return {object}     d3 selection of child element
 */
d3.selection.prototype.appendSelect = function (el, cls) {
  const selected = cls ?
    this.select(`${el}.${cls.split(' ').join('.')}`) : this.select(el);
  if (selected.size() === 0) {
    return cls ? this.append(el).classed(cls, true) : this.append(el);
  }
  return selected;
};

export default d3;
