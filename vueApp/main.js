"use strict"
new Vue({
  el: "#app",
  data: {
    title: "A Vue.js POS!",
    cart: [],
    salesTax: 0.1,
    currentId: 1,
    subtotal: 0,
    presetItems: [
      { name: "Chicken", price: 1.99, text: "Chicken - 1.99 a lb" },
      { name: "Rice", price: 2.15, text: "Rice - 2.15 a lb" },
      { name: "Potatoes", price: .99, text: "Potatoes - .99 a lb" }
    ]
  },

  methods:{
    addItemToCart(item){
      // Can pass item object
      // No need to do any DOM id lookup or switch statement
      this.cart.push(item)
    }
  }
})