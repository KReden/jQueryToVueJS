const receiptItemTemplate = `
  <div
    v-bind:class="{ sale: item.sale }"
    class="item"
    :item="item"
    :index="index">
    <button @click="removeItemFromReceipt" class="remove-item">X</button>
    <div class="left">
      {{item.name | capitalize}} {{ item.sale ? '- On Sale!' : '' }}
    </div>
    <div class="right">{{item.price | formatMoney}}</div>
  </div>
`

const receiptItem = {
  template: receiptItemTemplate,
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    removeItemFromReceipt() {
      this.$emit("remove-item-from-receipt", this.index)
    },
  },
}

const receiptListTemplate = `
  <div id="receipt-list">
    <div v-if="receiptEmpty" class="item">Nothing Scanned</div>
    <receipt-item v-else
      v-for="(item, index) in receipt"
      v-on:remove-item-from-receipt="removeItemFromReceipt"
      :item="item"
      :index="index"></receipt-item>
  </div>
`

Vue.component("receipt-list", {
  template: receiptListTemplate,
  components: {
    'receipt-item': receiptItem,
  },
  computed: {
    receipt() {
      return this.$store.state.receipt
    },
    receiptEmpty() {
      return this.receipt.length === 0
    }
  },
  methods: {
    removeItemFromReceipt(index){
      this.$store.commit("removeItemFromReceipt", index)
    }
  }
})
