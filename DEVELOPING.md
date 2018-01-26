# Writing reusable chart modules in D3
### What we're going to build:
A reusable, responsive line chart module that can draw one line or many, many lines.

### Introducing idempotence and our friend `appendSelect`
#### file: `d3.js`
We've got a lot to cover in the hour, so let's get started and walk through the files in our project.

First things first, you'll notice even though d3 is installed in our project as a dependency (see `node_modules` folder and `package.json`) we still have a `d3.js` file in the root of our js folder.

This is because we're using a custom version of d3 with methods we can call in our chart module to make our lives easier. Our d3 methods `moveToFront` and `moveToBack` are useful for tooltip events, but today we're going to focus on our bread and butter method `appendSelect`.

What this method does is checks to see if an element already exists. If the element doesn't exist, the element is appended (with a class). But if the element already exists, it will not be appended again — instead the first existing element that matches the given selector will be returned.

It takes two parameters. A selector (i.e. `svg`, `g`, `circle`, etc.) and the selector's class.

Which means we get to write this when we create new chart elements:

`const svg = d3.select('#chart').appendSelect('svg', 'chart');`

Instead of this ternary statement ...

`const svg = d3.select('#chart').select('svg.chart').size() === 0 ?
  d3.select('#chart').append('svg').attr('class', 'chart') :
  d3.select('#chart').select('svg.chart');`

At this point `appendSelect` might not seem all that exciting, after all it just checks to see if an element exists on the page. But the concept of `appendSelect` is core to understanding how reusable chart modules work.

It's what some programmers call idempotent, which is a fancy of way saying it's code that's been abstracted so that it can take any variation of its parameters (in this case, a selector and a class)
and return it's function — in this case, check to see whether or not an element is already appended or not.

This kind of functionality is *incredibly powerful* and in the case of our d3 chart module, `appendSelect` allows us to do 3 relatively complicated things fairly easily:
1. Update our chart with different slices of data without re-rendering our chart.
2. Call separate instances of our chart on the same page using different data (i.e. small multiples)
3. Helps make our chart module naturally responsive.

### The basic chart module structure
#### file: `file-1.js`
Ok, time to dig into the nitty gritty of our chart module.

First, we import our custom `d3.js`. Any other libraries or scripts we need for our chart would be declared here.

Next, you'll notice our chart is wrapped in an `export default()` function. We do this because wrapping our chart function in a module means we can easily export (and import!) our code into other projects. In fact, we're already importing/exporting a module w/ our custom d3 script.

Inside our module, there are 5 methods with which you can call our chart.
1. `render()`
2. `draw()`
3. `create()`
4. `update()`
5. `resize()`

Our `render()` function is our first method. It's also the only method we'll really touch. Here we declare the defaults for our `props` object (more on that in a bit) and in our inner `chart()` function, we pass our chart a HTML selector and data so we can append svg elements and write our d3 chart code.

Outside of our inner `chart()` function is a bit of boilerplate code that might look unfamiliar. It's what programmers call a "getter-setter", or when you can both set and get properties on an object. In our case, it's a function that looks to merge default properties we declare in our chart module with user provided properties when we create our chart. It then creates one object of both default and user defined properties.

Let's go ahead and uncomment `console.log(props)`. You should see an object returned with one function inside, `labelAccessor()`. And that's because we're passing our chart this props in `app.js` when we create our chart. More detail on how this works in a bit, but for now you can see our chart module has access to a props object.

Next up is our `draw()` function where we call our `render()` function and actually draw our chart. Here we pass our chart our `props` object and use `d3` to select our chart's HTML selector and pass it data while calling our actual chart function to draw the chart.

But to first draw our chart we need to call `draw()` inside our `create()` function, as this method passes `chart()` the 3 parameters it needs to render our chart:
1. `selection`, a HTML selector
2. `data`, the data we want to plot
3. `props`, an object of properties for interacting with and customizing our chart.

As for our last two chart methods: `update()` and `resize()`, you'll notice they have one method in common with `create()` – `this.draw()`. So, at this stage, it might seem as if these three methods are redundant — and you'd be right, they are. But as you'll soon see, it's helpful to breakout these methods, so we can easily pass our chart new data or resize it without re-rendering our chart.

### Let's build a chart!
#### files: `app.js` + `file-2.js`

Ok, first let's hop over to `app.js`. As you can see, there are a ton of import statements at the top of the file. We're interested in commenting out `import chart from './file-1';` and uncommenting `import chart from './file-2';`

Save your file and what do you see? A line chart 🎉

What's happening is that in `app.js` we've imported our chart module and then created a variable called `myChart` on which we then call our chart's `create()` method. We then give `create()` the three parameters it needs to render our chart:

1. `selection`: our element's id from `index.html`, which in this case is `#single-line-chart`
2. `data`: our data imported above as `singleLine`
3. `props`: which currently has one prop called `labelAccessor` and then a lot of commented out code. We'll talk about `props` in greater detail in just a bit.

Now that we've seen `create()` in action, let's pop over to `./file2.js` and see what's happening in `render()`.

Inside `render()` in our inner `chart()` function you'll see pretty standard `d3 (v4)` for rendering a line chart — margins, calculations for our domain and range, scales and where we actually append our svg, axes and line.

You might also see some unfamiliar ES6 js syntax like `const` which is essentially `var` and `=>` functions which are a condensed way of writing `function(d) { return d }`.

The one big difference between our code and a standard `d3` chart at this stage is we're using `appendSelect` and not `append` to append our elements.

To quickly see one powerful benefit of `appendSelect` in action, let's hop back over to `app.js` and scroll to the bottom of our file and uncomment our resize function (leave `myMultiLineChart.resize()` commented out for now). Save and resize your page.

Our chart is now entirely responsive! And all we did was call our `resize()` method in a `debounce()` function. This means we no longer have to keep track of which elements to update with a new width on window resize. (There is a max-width of 600px set on our element in our `scss` if you're wondering why our chart isn't full-width).

But at this point, our chart module isn't reusable. If you pop back over to `file-2.js`, you'll see that our data is hardcoded to values in our `single-line.json` data (i.e. `d.year`, `d.value`).

Let's fix that. In `app.js` comment out `import chart from './file-2';` and uncomment `import chart from './file-3';`

### Make our chart reusable with data accessors
#### files: `file-3.js` + `app.js`

Ok, we still have a line chart. Phew. And at this stage we've taken the first step to make our chart reusable. We've declared our first default props `xAccessor` and `yAccessor` in our `props` object in `file-3.js`. We call these props `data accessors` because they're functions that tell our chart how to interact with our data.

Let's see these props in action. Look at `line 44` in `file-3.js`. Here we're normalizing our data using our data accessors. We're creating a new array of objects called `normData` where our xValue is renamed as `x` and our yValue is renamed as `y`.

Open up your console and compare our raw data to our processed data. What do you see?

Our data structure has remained the same (both are an array of arrays of objects), but you'll notice our object keys have been renamed in `normData` from `year` and `value` to `x` and `y`, respectively. And there's a new key in `normData` called `label` with a really long string. Where is this coming from?

It's coming from `app.js` where we're passing in a prop called `labelAccessor`. If you open up our `data` directory and look at our `single-line.json`, you'll notice there are only two properties (`year` and `value`), which is why we're passing in an empty function and a meaningless string that could be anything.

Why do we need a `labelAccessor` if it isn't in our data? It's because `labelAccessor` is used by our `colorScale` (`lines 74-76` in `file-3.js`) to assign colors to our lines. In this example, we only draw one line, so having a label in our data isn't necessary, which is why we pass in a meaningless string. But in our next example when we draw a multi-line chart, you'll see `labelAccessor` in action.

That said, we should have `labelAccessor` defined in our props object in our chart module (`file-3.js`), as it's good practice to only overwrite props in your `create()` method that already exist as defaults in your chart module. So let's go back to `file-3.js` and uncomment `labelAccessor: d => d.cat` in our `props` object. Save the file and look at your console again.

What is the value of our `labelAccessor` in our `processedData` array? It's still the long string and not our default `labelAccessor` we just uncommented. And that's because any props you pass through in the creation of your chart overwrite default props set in your chart module thanks to that get-setter function at the bottom of `render()` we talked about earlier.

The significance of all this is we can now pass our chart module any data set regardless of how our variables are named and then rename them using our data accessors `xAccessor`, `yAccessor`, and `labelAccessor`.

This makes our chart code reusable. Because instead of calling `d.year` or `d.value`, like we did in `file-2.js`, we can now simply call `d.x`, `d.y` and `d.label`. (In `file-2.js`, we hard coded our stroke color, so didn't use `d.label` or even have a colorScale).

Now, let's test the reusability of our chart with a new data set and draw a multi-line chart.

### Render two charts using the same chart module
#### files: `index.html` + `app.js` + `file-4.js`
First pop over to our `index.html` and uncomment our second div, `multiple-line-chart`.

Next in `app.js` comment out `import chart from './file-3';` and uncomment `import chart from './file-4';`

Then uncomment the code under `MULTI-LINE CHART` (`lines 42-46` in `app.js`). Save `app.js` and what do you see in your browser?

🎉 Two line charts 🎉

And if you uncomment `line 52` in `app.js`, `myMultiLineChart` will be fully responsive too.

### Customize our chart, AKA the power of props
#### files: `app.js` + `file-5.js`
At this point, everything is gravy. But to better understand the role of props in our chart modules, let's comment out `import chart from './file-4';` and uncomment `import chart from './file-5';` and `lines 23-30` in `app.js` where we create our singleLine chart. Save `app.js`. What do you see?

Our first chart now has a nicer formatted x and y axis, plus the steps on our yAxis are better bound by our data set.

What's significant about this, is we made all of these customizations to our chart without altering our chart module code (which is why our second chart looks different, as it doesn't have any custom props passed in.)

Pop open `file-5.js` and check out our props. You can see we've passed in `xTickFormat`, `yTickFormat` and `yTickSteps`, which we've then overwritten in `app.js`. We've also altered our code so that our respective axes have access to `props.xTickFormat` or `props.yTickFormat`.

Props in our chart modules open up a whole world of customization (including passing in different scales or domains, ranges, etc.)

### Update our chart with new data
#### file: `app.js`
The last thing we want to show you is how to quickly pass in new data or — update our chart with data.

Let's go ahead and comment out our props in `myChart` except for `labelAccessor` and then uncomment our `setTimeout` `lines 34-37` in `app.js`.

Wait 5 seconds and what happened to our top chart? The line changed! We passed our `myChart` variable a new data set wrapped in a `setTimeout` function. It's easy peasy to pass our chart new data the possibilities are endless.

### Next steps
#### files: `app.js` + `chart.js`
To see a more extensive use of props, bring in `chart.js` (comment out `file-5.js`) in `app.js` and uncomment `const parseYear = d3.timeParse('%Y');`. Change your `xAccessor` in `myChart` to `xAccessor: d => parseYear(d.year)`. Make sure to add the same `xAccessor` to `myMultiLineChart`.

Other things you should try: pass in a new data set with different field names than `year` and `value`. Just make sure it's an array of arrays of objects as that's the data format our chart module expects :)

All our code is available on Github here: https://github.com/The-Politico/nicar18-reusable-charts

And if you want to start hacking on a new project to build a chart module from scratch check out this bundler/dev environment:
https://github.com/The-Politico/simple-bundler

Thanks for hanging out with us today and hit us up with any questions you might have on twitter [Jeremy](https://twitter.com/Jeremy_CF_Lin) and [Sarah](https://twitter.com/sfrostenson). Also give this a read, as it's the original guide to reusable d3 charts: https://bost.ocks.org/mike/chart/
