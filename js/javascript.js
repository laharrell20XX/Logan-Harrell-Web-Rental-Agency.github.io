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

function addEvents(listElm) {
    var button = listElm.querySelector("button");
    var formContainer = listElm.querySelector(".dropdown-form"); // turned buttons and object into set vars instead of reassigning them
    // var object = getObjByName(listOfItems, button);
    addFormEvents(formContainer.querySelector("form"));
    button.addEventListener("click", function() {
        closeOtherForms(formContainer);
        showDropdown(formContainer); // re-rendering the templates gets rid of the button events (have to call makeRent Buttons again)
    });
}

function rentItem(object) {
    object.stock = Number(object.stock) - 1;
}

function makeRentButtons() {
    var listElms = document.querySelectorAll("div.store-items li"); //adds events to all rent buttons
    for (listElm of listElms) {
        addEvents(listElm);
    }
}

function showDropdown(form) {
    form.classList.toggle("hide");
    form.classList.toggle("show");
}
function closeOtherForms(cur_form) {
    if (cur_form.classList.contains("show")) {
        return;
    } else {
        var shownForm = document.querySelector(".dropdown-form.show");
        if (shownForm) {
            shownForm.classList.toggle("show");
            shownForm.classList.toggle("hide");
        }
    }
}

function addFormEvents(form) {
    formElements = form.elements;
    nameRegEx = /^[A-Za-z](?=['-]*)(?=[^'-\s0-9]*$)/; // checks for (letter'-(optional)(letter/number))
    phoneRegEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/; //regression statements only work for America
    function checkValidity(event, regex, errorMsg) {
        if (regex.test(event.target.value)) {
            event.target.setCustomValidity("");
        } else {
            event.target.setCustomValidity(errorMsg);
        }
    }
    formElements["first-name"].addEventListener("input", function(event) {
        checkValidity(event, nameRegEx, "Not a valid name");
    });
    formElements["last-name"].addEventListener("input", function(event) {
        checkValidity(event, nameRegEx, "Not a valid name");
    });
    formElements["phone"].addEventListener("input", function(event) {
        checkValidity(event, phoneRegEx, "Not a valid phone number");
    });
    form.addEventListener("submit", function() {
        form.reportValidity();
    });
}
