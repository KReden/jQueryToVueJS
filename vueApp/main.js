"use strict"
new Vue({
  el: "#app",
  data: {
    title: "A Vue.js POS!",
    cart: [],
    salesTax: 0.1,
    currentId: 1,
    subtotal: 0,
    itemName: "",
    itemPrice: null,
    presetItems: [
      { name: "Chicken", price: 1.99, text: "Chicken - 1.99 a lb" },
      { name: "Rice", price: 2.15, text: "Rice - 2.15 a lb" },
      { name: "Potatoes", price: .99, text: "Potatoes - .99 a lb" }
    ]
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
    cartEmpty(){
      return this.cart.length === 0
    }
  },

  methods:{
    addItemToCart(item){
      // Don't do anything if no item or item.name/item.price is blank
      if(!item || item.name === "" || item.price === "") { return }
      // Can pass item object
      // No need to do any DOM id lookup or switch statement
      this.cart.push(item)
      this.newItem = ""
    }
  }
})