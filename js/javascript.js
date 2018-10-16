var listOfItems = PAGE_DATA.storeItems;
renderItemTemp();

// helper function to find the right object based on the name of the event being added to

function getObjByName(list, button) {
    for (var i of list) {
        if (button.classList.contains(i.name + "-rental-button")) {
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
    makeRentButtons(); //remakes the rent buttons everytime the template is rendered
}

function clearTemp(element) {
    if (element.innerHTML) {
        element.innerHTML = "";
    }
}

function addEvent(listElm) {
    var button = listElm.querySelector("button"); // turned buttons and object into set vars instead of reassigning them
    var object = getObjByName(listOfItems, button);
    button.addEventListener("click", function() {
        rentItem(object);
        renderItemTemp(); // re-rendering the templates gets rid of the button events (have to call makeRent Buttons again)
    });
}

function rentItem(object) {
    object.stock = Number(object.stock) - 1;
}

function makeRentButtons() {
    var listElms = document.querySelectorAll("div.store-items li"); //adds events to all rent buttons
    for (listElm of listElms) {
        addEvent(listElm);
    }
}
