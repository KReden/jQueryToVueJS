window.store = new Vuex.Store({
  state: {
    salesTax: 0.1,
    presetItems: [
      { name: "Chicken", price: 1.99, text: "Chicken - 1.99 a lb" },
      { name: "Rice", price: 2.15, text: "Rice - 2.15 a lb" },
      { name: "Potatoes", price: .99, text: "Potatoes - .99 a lb" },
      { name: "Milk", price: 2.49, text: "Milk - SALE 2.49 a gallon", sale: true },
    ],
    receipt: [],
  },

  getters: {
    calculatedTax: (state, getters) => {
      if (state.receipt.length === 0) return
      return getters.subtotal * state.salesTax
    },
    calculatedTotal: (state, getters) => {
      if (state.receipt.length === 0) return
      return getters.subtotal + getters.calculatedTax
    },
    subtotal: (state) => {
      if(state.receipt.length === 0) return
      let result = 0
      state.receipt.forEach(item => {
        result += item.price
      })
      return result
    },
  },

  mutations: {
    addItemToReceipt(state, item){
      state.receipt.push(item)
    },
    removeItemFromReceipt(state, index){
      state.receipt.splice(index, 1)
    },
  },

  actions: {
    addItemToReceipt(context, item){
      return new Promise((resolve, reject) => {
        context.commit("addItemToReceipt", item)
        resolve()
      })
    },
  },
})
