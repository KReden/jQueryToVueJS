"use strict"
String.prototype.capitalize = String.prototype.capitalize || function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

$(() => {
  const SALES_TAX = 0.1
  let currentId = 1
  let subtotal = 0
  let cart = []
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

  $("#item-submit").click(function(){
    let $itemNameInput = $(this).siblings("#item-name")
    let $itemPriceInput = $(this).siblings("#item-price")

    addItemToCart({
      name: $itemNameInput.val(),
      price: $itemPriceInput.val()
    })

    $itemNameInput.val('')
    $itemPriceInput.val('')
  })

  $("#cart-list").on("click", ".remove-item", function(){
    let key = $(this).parent().data("key")
    let indexOfItem = cart.findIndex(item => item.id == key)

    // Remove from total, cart array, and DOM
    cart.splice(indexOfItem, 1)
    updateSubtotal()
    $(this).parent().remove()

    // Check if no more items in cart
    if(cart.length === 0){
      let htmlString = `<div class="item" data-key="-1">
                          Nothing in the cart
                        </div>`
      $("#cart-list").html(htmlString)
    }
  })

  // Functions
  function addItemToCart(item) {
    let htmlString = ""
    item.id = currentId
    currentId = ++currentId
    cart.push(item)
    updateSubtotal()

    // For each item in our cart, add another div element to the html string.
    cart.forEach(item => {
      htmlString += `<div class="item" data-key="${item.id}">
                        <button class="remove-item">X</button>
                        <div class="left">${item.name.capitalize()}</div>
                        <div class="right">$${item.price}</div>
                      </div>`
    })
    // Set the html of our #cart-list to the html string
    $("#cart-list").html(htmlString)
  }

  function updateSubtotal() {
    let subtotal = 0
    cart.forEach(item => {
      subtotal += item.price
    })
    calculateTax(subtotal)
    $("#subtotal > .value").html(`$${subtotal.toFixed(2)}`)
  }

  function calculateTax(subtotal) {
    let calculatedTax = (subtotal * SALES_TAX)
    calculateTotal(subtotal, calculatedTax)
    $("#tax > .value").html(`$${calculatedTax.toFixed(2)}`)
  }

  function calculateTotal(subtotal, tax) {
    let calculatedTotal = subtotal + tax
    $("#total > .value").html(`$${calculatedTotal.toFixed(2)}`)
  }
})