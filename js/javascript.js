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
 */
// function addEvent(i) {
//     i.addEventListener("click", rentItem)
// }
