# jQuery To Vue

Recently I helped run a workshop where we showed how to make the game [2048 in VueJS]. During this workshop we were asked a number of questions along the lines of "How do you target an element by an attribute?" or "How does Vue handle hooking up events to elements that don't exist on the page initially?" Later on I overheard people saying things like "I just think about things in terms of jQuery too much."

This got me thinking that maybe writing a post showing how to convert a jQuery app into a Vue app might be in order. I then found out that I wasn't the only one with this thought. The fine folks over on the [Laveral Blog beat me to it!] I even unknowingly made a very similar app to theirs for this post. Great minds think alike I suppose.

Note: While you don't need to have had any experience with VueJS you will need to have a basic understanding of JavaScript and jQuery.

In this post I am going to cover the basics of building a Vue application. By the end of the post you will have been introduced to:

- Bootstrapping a new Vue application.
- The structure of a Vue app
- Data attributes
- Directives
- Event handlers
- Filters
- Computed Properties

You will find the repo [here](https://github.com/KReden/jQueryToVueJS) if you want to follow along. 

## The jQuery App

The jQuery app simulates a point of sales system. If you open up `jQueryApp/index.html` in your browser you should see this:

![](https://i.imgur.com/Wq4g5s7.png)

The app consists of:
- A title
- 4 buttons that when pressed will add items to the Receipt
- Two text boxes that a name and price can be entered into.
- An enter button that adds the aforementioned to the receipt.
- An area that lists the names and prices of each item.
- A remove button on for each row that will remove the item from the receipt.
- Subtotal, tax, and total that auto calculate when items are added or removed from the receipt.

There is nothing terribly exciting or complex going on here but it will serve as a good intro into what Vue can do!

## The Vue App

[Vue.js] is a `progressive framework` for building user interfaces. Similar to React and Angular it is component based and in fact borrows a number of ideas and paradigms from them. Check out this [comparison guide] to learn more about how they all stack up against each other.

## Step 1 - The Setup
Create a new folder named `vueApp`. In that folder we will create our `index.html`, `main.js`, `styles.css`, and the `lib` folder. Once that is done go and [download vue.js] and put it in `/lib`. When you are done you should have a folder structure that looks like:

![](https://i.imgur.com/1X65KM3.png)

After that open up `vueApp/index.html` and add:

```html
<!doctype html>
<html>
    <head>
        <title>VueJs Receipt!</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div id="app" class="card">
            <h1>VueJs Receipt!</h1>

            <div class="button container">
                <button id="Chicken" class="item-btn">Chicken - 1.99 a lb</button>
                <button id="Rice" class="item-btn">Rice - 2.15 a box</button>
                <button id="Potatoes" class="item-btn">Potatoes - .99 a lb</button>
            </div>

            <div class="item-entry container">
                Item Name: <input type="text" id="item-name">
                Item Price: <input type="number" id="item-price">
                <button id="item-submit">Enter</button>
            </div>

            <div class="card receipt container">
                <p>Cart</p>
                <div id="cart-list">
                    <!-- Receipt items will go here -->
                    <div class="item" data-key="-1">No Items added</div>
                </div>

                <hr>

                <div id="tax-and-total">
                    <div id="subtotal">
                        <div class="left">
                            Subtotal
                        </div>
                        <div class="right value">
                            <!-- Subtotal Value goes here -->
                             $0.00
                        </div>
                    </div>

                    <div id="tax">
                        <div class="left">
                            Tax - 10%
                        </div>
                        <div class="right value">
                            <!-- Tax value goes here -->
                            $0.00
                        </div>
                    </div>

                    <hr>

                    <div id="total">
                        <div class="left">
                            Total
                        </div>
                        <div class="right value">
                            <!-- Total Value goes here -->
                             $0.00
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <script src="lib/vue.js"></script>
        <script src="main.js"></script>
    </body>
</html>
```

If you look in `jQueryApp/index.html` this should look familiar to you. The only things we have modified are the title and loading Vue instead of jQuery.

We can also copy over the contents of `jQueryApp/styles.css` into `vueApp/styles.css`. There isn't anything special here, just plan old css.

And finally in `main.js` the only thing we are going to put is the `use strict` [declaration][use strict].

And that's all she wrote for this step.

## Step 2 - Let's make a Vue app.

In `vueApp/main.js` add:

```javascript
new Vue({
  el: "#app",
  data: {
    title: "A bound data attribute!"
  },
})
```

Let's stop a moment and look at what we are doing here. `new Vue` will create a [Vue instance] passing it an options object that Vue will use to bootstap the page.
- `el: "#app"` tells Vue that we want to attach this instance to an element with an id of app. This means that any child elements of the parent #app will have access to Vue data attributes.
- `data` is like the apps state. Properties added will be read by Vue and added to its reactivity tree, or in other words Vue will create a data binding for these properties. If they are changed Vue will detect it and update the view to reflect those changes. 
  - Something important to keep in mind: Vue will only add properties to its reactivity tree that were present when the instance was created.

Now open up `vueApp/index.html` and change line 9 to look like `<h1>{{ title }}</h1>`. Open `vueApp/index.html` in your browser and you should see:

![](https://i.imgur.com/pmmGuhT.png)

Change title to `title: A Vue.js Point Of Sales!`, refresh the page and you should see it reflected in the header.

Now that we know about `data` and reactivity, let’s start to build out our apps data attributes. Open `vueApp/main.js` up and change data to look like:

```javascript
...
data: {
  title: "A Vue.js POS!",
  cart: [],
  salesTax: 0.1,
  currentId: 1,
  subtotal: 0,
  presetItems: [
    { name: "Chicken", price: 1.99 },
    { name: "Rice", price: 2.15 },
    { name: "Potatoes", price: .99 },
  ],
},
```

Awesome! Now all of the variables we’ve declared in `jQueryApp/main.js` are data attributes. Next, we will hook up the `presetItems` buttons.

## Step 3: Buttons and `v-for`

Take a quick look at the `presetItems` buttons and how they are hooked up in the jQueryApp. First the HTML:

```html
...
<div class="button container">
    <button id="Chicken" class="item-btn">Chicken - 1.99 a lb</button>
    <button id="Rice" class="item-btn">Rice - 2.15 a box</button>
    <button id="Potatoes" class="item-btn">Potatoes - .99 a lb</button>
</div>
...
```

And the javascript:
```javascript
...
let presetItems = [
  { name: "Chicken", price: 1.99 },
  { name: "Rice", price: 2.15 },
  { name: "Potatoes", price: .99 }
]

// Click handlers
$(".item-btn").click(function() {
  let domId = $(this).attr('id')
  presetItems.forEach((item) => {
    switch (true) {
      case item.name === domId:
        addItemToCart(item)
        break
      case item.name === domId:
        addItemToCart(item)
        break
      case item.name === domId:
        addItemToCart(item)
        break
    }
  })
  console.log(subtotal, cart);
})
...
```

What we are doing here is classic jQuery. We assign a click handler to all elements with the `item-btn` class. When the user clicks on one of those elements we fire off a function that grabs the id of the element clicked on. We then use this id to match to the name of the item we want to add to the cart.

Anyone who has ever had to deal with this in a large application can tell you that it does not scale well at all. It is very manual and prone to a multitude of issues (maintaining the HTML for all the buttons, classes and id’s might be changed or removed, ect.). Luckily Vue has a solution for this that scales quite well: `v-for`.

`v-for` is a [directive] that works just like a for loop in javascript. Using this directive we can modify our buttons in `vueApp/index.html` to look like:

```html
<button v-for="item in presetItems" class="item-btn">
    {{ item.name }}
</button>
```

Load that index file up in your browser and you should see:

![](https://i.imgur.com/hrhGv9v.png)

As you can see this is so much more simple and easy to maintain. As our app scales we don't need to worry about updating anything but our data.

Hooking up the click event is just as simple and we will use another directive: `@click`.

`@click` is shorthand for `v-bind:click` which is how we attach custom click handlers to elements. Change the html for the button so that it looks like:

```html
<button v-for="item in presetItems"
        @click="addItemToReciept(item)"
        class="item-btn">
    {{ item.name }}
</button>
```
Something interesting is happening with that line we just added. We are directly passing the item to the `addItemToReciept` function. This is one of the powerful things about Vue, it allows you to write something that looks very similar to javascript and most of the same rules apply.

To complete this in `vueApp/main.js` we are going to add:

```javascript
methods:{
  addItemToReciept(item){
    // Can pass item object
    // No need to do any DOM id lookup or switch statement
    this.cart.push(item)
  }
}
```

`methods` is another key in the options object for the vue instance. This key will always be an object that contains functions which will be accessible by the view. In it we will place our `addItemToReciept` function.

While we are at it, go on and change out `presetItems` array to look like:

```javascript
...
presetItems: [
  { name: "Chicken - 1.99 a lb", price: 1.99},
  { name: "Rice - 2.15 a lb", price: 2.15 },
  { name: "Potatoes - .99 a lb", price: .99 }
]
...
```

Next we will hook up the text boxes and submit button.

## Step 4: Text boxes, v-model, and computed properties.
In the jQuery app the enter button here:
![](https://i.imgur.com/yznL8IB.png)

Is controlled by this code:
```javascript
$("#item-submit").click(function(){
  let $itemNameInput = $(this).siblings("#item-name")
  let $itemPriceInput = $(this).siblings("#item-price")

  addItemToCart({
    name: $itemNameInput.val(),
    price: parseFloat($itemPriceInput.val()),
  })

  $itemNameInput.val('')
  $itemPriceInput.val('')
})
```

Which is fairly straightforward, we attach a click handler to an element with an id of `item-submit`. When that element is clicked we grab the value of the text boxes for name and price, pass them into `addItemToReciept` as a hash (parsing the price as a float), and then clear out the text boxes.

To get this to work in the Vue app we will need to do a few things:
- Add two new properties to the `data` hash.
- Attach a `v-model` directive to each input.
- Attach a click handler to the `enter` button and have it call the `addItemToReciept` function.
- Clear the inputs

Let's start by adding the following to the `data` hash in `vueApp/main.js`

```javascript
...
  itemName: "",
  itemPrice: null,
},
```
and in `vueApp/index.html` change the inputs to look like:
```html
Item Name: <input v-model="itemName" type="text" id="item-name">
Item Price: <input v-model="itemPrice" type="number" id="item-price">
```

The [`v-model` directive] is pretty nifty, it's how we hook up two way data binding for form inputs in Vue and it will even auto detect how to properly update the input based on its type!

Here we are saying that the inputs for the item name and price will be bound to the `itemName` and `itemPrice` keys on the `data` hash.

To hook up the `enter` button change its html to:

```html
<button @click="addItemToReciept()" id="item-submit">Enter</button>
```

and edit the `addItemToReciept` function to look like:

```javascript
addItemToCart(item = null){
  item = item || { name: this.itemName, price: this.itemPrice }
  this.cart.push(item)
  this.itemName = ""
  this.itemPrice = ""
  console.log(this.cart)
}
```

Now if you load up the vue app, open up the chrome dev tools, and add items via the text boxes you should see the console logs.

While this works, we can actually change it to be more 'vue' like. To do that we are going to need to use a [computed property]. Computed properties are functions that we can use to do complex logic on some data and then return the result.

Most times computed properties will look something like this:

```javascript
// this.firstName = 'Han'
// this.lastName = 'Solo'

fullName(){
  return `${this.firstName} ${this.lastName}`
},
```

Calling `this.fullName` will return 'Han Solo'. Notice that I left off the parentheses? This is because computed properties are NOT like normal methods. Think of the above as a getter method, it is meant to return something. In fact here is another way to write it:

```javascript
fullName: {
  get(){
    return `${this.firstName} ${this.lastName}`
  },
},
```

Looking at the above you might wonder "Can I also have a setter?" to which the answer is yes. With a setter things would look like:

```javascript
fullName: {
  get(){
    return `${this.firstName} ${this.lastName}`
  },
  set(newValue){
    const names = newValue.split(' ')
    this.firstName = names[0]
    this.lastName = names[names.length - 1]
  },
},
```

Now if you were to set `this.fullName = 'Luke Skywalker'` and then check the value of `this.firstName` you will get 'Luke'.

For our Vue app we are going to do something similar to the above. In `vueApp/main.js` add:

```javascript
data: {
  ...
},
computed: {
  newItem: {
    get(){
      return { name: this.itemName, price: this.itemPrice }
    },
    set(val){
      this.itemName = val
      this.itemPrice = val
    }
  },
},
...
```

Here we have registered a new computed property called `newItem`. Its getter will return an object with the item name and price and its setter will set the values of `this.itemName` and `this.itemPrice` that whatever `val` is.

We will also have to change the `addItemToReciept` method to look like:

```javascript
addItemToReciept(item){
  if(!item || item.name === "" || item.price === "") { return }
  this.cart.push(item)
  this.newItem = ""
},
```

and the html to look like:

```html
<button @click="addItemToCart(newItem)" id="item-submit">Enter</button>
```

And we are done! Now when we click the button we will pass in the computed property `newItem`, run some checks, add it to the cart and finally set the value of `newItem` to an empty string which is really setting the value of `itemName` and `itemPrice` to an empty string.

Next we are going to display the items in the cart.

## Step 5: The List and v-else

Pop open `jQueryApp/main.js` and take a look at `addItemToReceipt`:

```javascript
function addItemToReceipt(item) {
  let htmlString = ""
  item.id = currentId
  currentId = ++currentId
  receipt.push(item)
  updateSubtotal()

  // For each item in our list, add another div element to the html string.
  cart.forEach(item => {
    htmlString += `<div class="item" data-key="${item.id}">
                      <button class="remove-item">X</button>
                      <div class="left">${item.name.capitalize()}</div>
                      <div class="right">$${item.price}</div>
                    </div>`
  })
  // Set the html of our #cart-list to the html string
  $("#receipt-list").html(htmlString)
}
```

This function is responsible for pushing an item into the receipt array and building the HTMl for display.

In Vue this becomes much simpler. Open up `vueApp/index.html` and around line 25 change the innards of `<div id="receipt-list">` to:

```html
<div v-if="receiptEmpty" class="item">Nothing Scanned</div>
<div v-else v-for="item in cart" class="item">
    <button class="remove-item">X</button>
    <div class="left">{{item.name}}</div>
    <div class="right">${{item.price}}</div>
</div>
```

Here we have introduced two new directives: [`v-if` and `v-else`]. The concept here should be familiar to you but be aware, this is not the same as CSS display toggling. This is a true conditional and only the HTML attached to a truthy condition will be rendered. Like everything else in Vue, `v-if` is reactive and will reevaluate when the property it’s watching (in this case `receiptEmpty`) changes.

If you want to do CSS display toggling Vue has you covered with [`v-show`].

`v-for` here iterates over the receipt array and will render a line for each item we have. The only other thing we need to do here is to make a new computed property named `receiptEmpty` which will return a boolean.

```javascript
...
receiptEmpty(){
  return this.receipt.length === 0
},
...
```

Now if you load up the app and add some items to the receipt you should see something like:

![](https://i.imgur.com/vxfWjI1.png)

Things are really starting to shape up! Next I want to do something about that pesky String.prototype...

## Step 6: Filters

At the top of the jQuery app we added a new function to the prototype chain of `String`:

```javascript
String.prototype.capitalize = String.prototype.capitalize || function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
```

There was no particular reason I added this to the prototype chain, it could have just as easily been a function that gets a string passed and does the same thing:

```javascript
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
```

Either way, in the Vue app we can change this into a [filter]. In Vue filters serve as a way to apply common text formatting and are accessible via mustache interpolations. To add this capitalize function as a filter all need to do is open up `vueApp/main.js` and after the `data` hash add:

```javascript
...
// Taken from https://vuejs.org/v2/guide/filters.html#ad
filters: {
    capitalize: (value) => {
      if(!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
...
```
Then in `vueApp/index.html` change the cart item HTMl to look like:

```html
<div v-if="receiptEmpty" class="item">Nothing in the cart</div>
<div v-else v-for="item in cart" class="item">
    <button class="remove-item">X</button>
    <div class="left">{{item.name | capitalize}}</div>
    <div class="right">${{item.price}}</div>
</div>
```

Reload the page, add a product and observe as its first letter is capitalized.

A few things to note about filters:
- You add a filter to a mustache interpolation via a pipe i.e. `<div class="left">{{item.name | capitalize}}</div>`
- Filters are Javascript functions and can have multiple arguments passed in.
  - The first value passed into the function will always be the string the operation will be performed on. This is implicit. You do not need to add it to the function call:

  ```html
  <div class="left">{{item.name | capitalize('foo', 'bar')}}</div>
  ```

  ```javascript
  // arg1 === 'foo'
  // arg2 === 'bar'
  filters: {
      capitalize: (value, arg1, arg2) => {
        if(!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
    },
  ```

- Filters can be chained. This works similar to chaining method calls and passing the result of each method to the next: `<div class="left">{{item.name | capitalize | reverse }}</div>`

Up next: Removing items from the cart list.

## Step 7: Remove an item

In the jQuery app in order to wire up the remove button for a receipt item we can't just attach a click handler to it like we did for the `item-submit` button.

The reason we can't is because jQuery can only attach its events to elements that exist on document ready and the remove button won't be around until sometime in the future.

In order to get this working we have to use the `.on()` function like so:

```javascript
$("#reciept-list").on("click", ".remove-item", function(){
  let key = $(this).parent().data("key")
  let indexOfItem = receipt.findIndex(item => item.id == key)

  // Remove from total, cart array, and DOM
  receipt.splice(indexOfItem, 1)
  updateSubtotal()
  $(this).parent().remove()

  // Check if no more items in cart
  if(receipt.length === 0){
    let htmlString = `<div class="item" data-key="-1">
                        Nothing Scanned
                      </div>`
    $("#receipt-list").html(htmlString)
  }
})
```

What we have to do here is attach the event handler to the parent element which will then listen for any click events bubbling up from its child `.remove-item` elements. While this is a totally valid way of doing things, Vue gives us a much more intuitive way to do it.

In Vue [event handling] is quite a bit better. In the HTML we only need to get the index of the item we are iterating over and add an `@click` handler to the remove button passing that index:

```html
<div v-else v-for="(item, index) in receipt" class="item">
    <button @click="removeItemFromReceipt(index)" class="remove-item">X</button>
    ...
</div>
```

And Vue will take care of wiring up the event handlers from there. The only other thing we need to do is add the `removeItemFromReceipt` function to our methods:

```javascript
removeItemFromCart(index){
  this.cart.splice(index, 1)
},
```

And that's it! Seriously...try it out. In this post this maybe one of the more dramatic examples of how Vue (and most modern day frameworks) makes developing an app much more straightforward. Compare the Vue code to the jQuery code and you can immediately see how Vue allows you to focus on the logic of your app.

We only have two more things to do before we are done, first up: getting the subtotal, tax, and total values calculated and displayed on the page.


## Step 8: Subtotal, Tax, and Total

This part is pretty straight forward, we are going to make 3 new computed properties and one new filter. First the properties:

In `vueApp/main.js`
```javascript
...
  subtotal(){
    if(this.receiptEmpty) return
    let result = 0
    this.receipt.forEach(item => {
      result += item.price
    })
    return result
  },
  calculatedTax(){
    if (this.receiptEmpty) return
    return this.subtotal * this.salesTax
  },
  calculatedTotal(){
    if (this.receiptEmpty) return
    return this.subtotal + this.calculatedTax
  },
...
```
Oh...and remember to remove `subtotal` from the data hash. If you don’t Vue will throw an error because you cannot have a data prop also be a computed prop.

Next the filter:
```javascript
...
formatMoney: (value) => {
  if (!value) return '$0.00'
  value = parseFloat(value)
  return `$${value.toFixed(2)}`
},
...
```

And change the relevant HTML (`vueApp/index.html`):
```html
<div id="subtotal">
  <div class="left">
      Subtotal
  </div>
  <div class="right value">
    <!-- Subtotal Value goes here -->
    {{ subtotal | formatMoney }}
  </div>
</div>

<div id="tax">
  <div class="left">
      Tax - 10%
  </div>
  <div class="right value">
    <!-- Tax value goes here -->
    {{ calculatedTax | formatMoney }}
  </div>
</div>

<hr>

<div id="total">
  <div class="left">
    Total
  </div>
  <div class="right value">
    <!-- Total Value goes here -->
    {{ calculatedTotal | formatMoney }}
  </div>
</div>
```

Reload the page and as you add and remove items you should see the subtotal, tax, and total values change!

![](https://i.imgur.com/yrV3vWb.png)

We have one last thing to do and then we are done...


## Step 9: Styles and Sales

Finally, lets add a sale item and look at how we can use a new directive to style it. First we need to add some CSS. Open up `vueApp/styles.css` and add:

```css
...
.sale {
  color: green;
}
```

Then open up `vueApp/main.js` and add another item to the `presetItems` array:

```javascript
...
presetItems: [
  { name: "Chicken", price: 1.99, text: "Chicken - 1.99 a lb" },
  { name: "Rice", price: 2.15, text: "Rice - 2.15 a lb" },
  { name: "Potatoes", price: .99, text: "Potatoes - .99 a lb" },
  { name: "Milk", price: 2.49, text: "Milk - SALE 2.49 a gallon", sale: true },
]
...
```
Notice that on the new item we added a new key `sale` and set it to true. The purpose of this will become apparent when we modify the HTML:

```html
<div id="cart-list">
  ...
  <div v-else
       v-for="(item, index) in receipt"
       v-bind:class="{ sale: item.sale }"
       class="item">
      <button @click="removeItemFromReceipt(index)" class="remove-item">X</button>
      <div class="left">
        {{item.name | capitalize}} {{ item.sale ? '- On Sale!' : '' }}
      </div>
      <div class="right">{{item.price | formatMoney}}</div>
  </div>
</div>
```

[V-bind:class] is that new directive I mentioned. With it we can toggle classes via a boolean in javascript! You can use `v-bind:class` (or `:class` for short) in conjunction with the `class` attribute. Vue will only toggle the classes that you specify in the binding and leave everything else alone.


## Thats all

This is a small sample of what Vue can do and hopefully you can see how much more straightforward and simple your app can be.


[jquery]: http://jquery.com/download/
[vue.js]: https://vuejs.org/v2/guide/
[download vue.js]: https://vuejs.org/v2/guide/installation.html
[use strict]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
[vue instance]: https://vuejs.org/v2/guide/instance.html
[directive]: https://vuejs.org/v2/guide/syntax.html#Directives
[`v-model` directive]: https://vuejs.org/v2/guide/forms.html
[computed property]: https://vuejs.org/v2/guide/computed.html
[`v-if` and `v-else`]: https://vuejs.org/v2/guide/conditional.html#v-if
[`v-show`]: https://vuejs.org/v2/guide/conditional.html#v-show
[filter]: https://vuejs.org/v2/guide/filters.html#ad
[event handleing]: https://vuejs.org/v2/guide/events.html
[V-bind:class]: (https://vuejs.org/v2/guide/class-and-style.html#ad)
[comparison guide]: https://vuejs.org/v2/guide/comparison.html
[Laveral Blog beat me to it!]: https://laravel-news.com/jquery-vue
[2048 in VueJS]: https://medium.com/babystep/build-2048-from-scratch-using-vue-js-part-1-3bc555298ad5

