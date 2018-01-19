"use strict"
const store = window.store

Vue.filter("capitalize", (value) => {
  if(!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter("formatMoney", (value) => {
  if (!value) return '$0.00'
  value = parseFloat(value)
  return `$${value.toFixed(2)}`
})

new Vue({
  el: "#app",
  store,
  data: {
    title: "Vue.js Point Of Sales!",
    itemName: "",
    itemPrice: null,
  },

  computed: {
    presetItems(){
      return this.$store.state.presetItems
    },

    newItem: {
      get(){
        return { name: this.itemName, price: parseFloat(this.itemPrice) }
      },
      set(val){
        this.itemName = val
        this.itemPrice = val
      }
    },
    receipt() {
      return this.$store.state.receipt
    },
    subtotal(){
      return this.$store.getters.subtotal
    },
    calculatedTax(){
      return this.$store.getters.calculatedTax
    },
    calculatedTotal(){
      return this.$store.getters.calculatedTotal
    }
  },

  methods:{
    addItemToReceipt(item){
      // Don't do anything if no item or item.name/item.price is blank
      if(!item || item.name === "" || item.price === "") { return }

      this.$store.dispatch("addItemToReceipt", item).then(() => {
        this.newItem = ""
      })
    },
  }
})
