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
      { name: "Chicken", price: 1.99 },
      { name: "Rice", price: 2.15 },
      { name: "Potatoes", price: .99 }
    ],
  },
})