"use strict"
String.prototype.capitalize = String.prototype.capitalize || function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

$(() => {
  const SALES_TAX = 0.1
  let currentId = 1
  let subtotal = 0
  let reciept = []
  let presetItems = [
    { name: "Chicken", price: 1.99 },
    { name: "Rice", price: 2.15 },
    { name: "Potatoes", price: .99 },
    { name: "Milk", price: 2.49, sale: true },
  ]

  // Click handlers
  $(".item-btn").click(function() {
    let name = $(this).attr('id')
    presetItems.forEach((item) => {
      switch (true) {
        case item.name === name:
          addItemToReciept(item)
          break
        case item.name === name:
          addItemToReciept(item)
          break
        case item.name === name:
          addItemToReciept(item)
          break
        case item.name === name:
          addItemToReciept(item)
          break
      }
    })
    console.log(subtotal, reciept);
  })

  $("#item-submit").click(function(){
    let $itemNameInput = $(this).siblings("#item-name")
    let $itemPriceInput = $(this).siblings("#item-price")

    addItemToReciept({
      name: $itemNameInput.val(),
      price: parseFloat($itemPriceInput.val())
    })

    $itemNameInput.val('')
    $itemPriceInput.val('')
  })

  $("#reciept-list").on("click", ".remove-item", function(){
    let key = $(this).parent().data("key")
    let indexOfItem = reciept.findIndex(item => item.id == key)

    // Remove from total, reciept array, and DOM
    reciept.splice(indexOfItem, 1)
    updateSubtotal()
    $(this).parent().remove()

    // Check if no more items in reciept
    if(reciept.length === 0){
      let htmlString = `<div class="item" data-key="-1">
                          Nothing in the reciept
                        </div>`
      $("#reciept-list").html(htmlString)
    }
  })

  // Functions
  function addItemToReciept(item) {
    let htmlString = ""
    item.id = currentId
    currentId = ++currentId
    reciept.push(item)
    updateSubtotal()

    // For each item in our reciept, add another div element to the html string.
    reciept.forEach(item => {
      let saleClass = ''
      let saleText = ''

      if(item.sale){
        saleClass = item.sale ? 'sale' : ''
        saleText = "- On Sale!"
      }

      htmlString += `<div class="item ${saleClass}" data-key="${item.id}">
                        <button class="remove-item">X</button>
                        <div class="left">${item.name.capitalize()} ${saleText}</div>
                        <div class="right">$${item.price}</div>
                      </div>`
    })
    // Set the html of our #reciept-list to the html string
    $("#reciept-list").html(htmlString)
  }

  function updateSubtotal() {
    let subtotal = 0
    reciept.forEach(item => {
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
