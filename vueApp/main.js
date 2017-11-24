"use strict"
new Vue({
  el: "#app",
  data: {
    title: "A Vue.js POS!",
    cart: [],
    salesTax: 0.1,
    currentId: 1,
    itemName: "",
    itemPrice: null,
    presetItems: [
      { name: "Chicken", price: 1.99, text: "Chicken - 1.99 a lb" },
      { name: "Rice", price: 2.15, text: "Rice - 2.15 a lb" },
      { name: "Potatoes", price: .99, text: "Potatoes - .99 a lb" },
      { name: "Milk", price: 2.49, text: "Milk - SALE 2.49 a gallon", sale: true },
    ]
  },

  filters: {
    capitalize: (value) => {
      if(!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    formatMoney: (value) => {
      if (!value) return '$0.00'
      value = parseFloat(value)
      return `$${value.toFixed(2)}`
    }
  },

  computed: {
    newItem: {
      get(){
        return { name: this.itemName, price: parseFloat(this.itemPrice) }
      },
      set(val){
        this.itemName = val
        this.itemPrice = val
      }
    },
    cartEmpty(){
      return this.cart.length === 0
    },
    subtotal(){
      if(this.cartEmpty) return
      let result = 0
      this.cart.forEach(item => {
        result += item.price
      })
      return result
    },
    calculatedTax(){
      if (this.cartEmpty) return
      return this.subtotal * this.salesTax
    },
    calculatedTotal(){
      if (this.cartEmpty) return
      return this.subtotal + this.calculatedTax
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
    },
    removeItemFromCart(index){
      this.cart.splice(index, 1)
    }
  }
})
