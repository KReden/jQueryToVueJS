const template = `
  <button :id="item.name" class="item-btn" @click="addToReciept">
    {{ item.text }}
  </button>
`

Vue.component("item-button", {
  template,
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addToReciept() {
      this.$emit("add-to-receipt", this.item)
    },
  },
})
