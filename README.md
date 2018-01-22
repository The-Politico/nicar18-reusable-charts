# NICAR 2018 Reusable charts session

## Using the repo

### Development

To start developing with this repository, run the following:

```
$ npm install
$ npm start
```

Then, visit localhost:3000 in your browser. You should see the page load.

### Building

To build the project into production-ready Javascript, run `npm run build`

NOTES:
As long as there is a package.json, it’s a publishable package
Public facing repo
Aim for a finished code example and copy and paste from there

How do you demonstrate reusability?
- Pass in props
- Different data sets: two data sets (time axes vs. ordinal axes)
- Call update function
- Small multiples

Walk through our starter files
- Create/draw/update => basically. Here’s what we start with.

Crib from: https://github.com/The-Politico/generator-politico-graphics/blob/master/generators/app/templates/DEVELOPING.md
Steps:
1. Install d3 in your project `yarn add d3`
2. But you'll notice even though we installed d3 in our project (see `node_modules` folder) we still have a d3.js file in the root of our js folder. And that's because we use a version of d3 where we call custom methods to make our lives easier. Our d3 methods `moveToFront` and `moveToBack` are useful for tooltip events, but let's focus on our bread and butter method `appendSelect`.

This custom method looks for a selector and it's class and then takes what would be a convoluted ternary statement that we would need to use repeatedly in our code and instead constructs it as a method we can call (and chain), so now we only have to write the ternary statement once.

```
// Use this...
const svg = d3.select('#chart').appendSelect('svg', 'chart');
// ... instead of this...
const svg = d3.select('#chart').select('svg.chart').size() === 0 ?
  d3.select('#chart').append('svg').attr('class', 'chart') :
  d3.select('#chart').select('svg.chart');
```
