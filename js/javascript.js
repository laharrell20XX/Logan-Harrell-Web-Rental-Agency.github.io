// helper function that takes in a stock count; in addition to returning the stock, function also
// calls a function that uses the stock count as a parameter

// helper function to find the right object based on the name of the event being added to

function getObjByName(list, button) {
    for (i of list) {
        if (`${i.name}-rental-button` in button.classList) {
            return i;
        }
    }
}

function renderItemTemp() {
    var storeItemUl = document.querySelector("div.store-items ul");
    clearTemp(storeItemUl);
    var source = document.getElementById("store-item-temp").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(PAGE_DATA.storeItems);
    storeItemUl.insertAdjacentHTML("beforeend", html);
}

function clearTemp(element) {
    if (element.innerHTML) {
        element.innerHTML = "";
    }
}
// want to add event to each button that decreases the stock count everytime the button is clicked
/* ideas:
- make the stock count into a template;
- from each button target the stock for each list item
- use handlebars helper functions to add the event to the button(side effect) 
  real effect returns a string to use as the tooltip; ( (not) bingo)
- iterate through PAGE_DATA to find the correct name of the item the button is under 

^^ iterate through each list item and add the event as it goes along (works)
  *make sure you create a function that takes in an element and adds the controls appropriately so you can
  pass the function through the for loop with each element (or just use let)
 *how to get the data?
 
  */

listOfItems = PAGE_DATA.storeItems;
function addEvent(listElm) {
    button = listElm.querySelector("button");
    button.addEventListener("click", () => {
        object = getObjByName();
        rentItem(object);
    });
}

function rentItem(object) {
    object.stock = Number(object.stock) - 1;
}
