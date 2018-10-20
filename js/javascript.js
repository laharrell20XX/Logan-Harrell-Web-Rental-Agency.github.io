Handlebars.registerHelper("calcTotal", function(array) {
    total = 0;
    for (var obj of array) {
        total += Number(obj.itemPrice);
    }
    return String(total);
});

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
    makeRentButtons(); //remakes the rent buttons every time the template is rendered; important to show any changes in item stock
}
function renderReceiptTemp(curReceipt) {
    var receiptModal = document.getElementById("receipt");
    clearTemp(receiptModal);
    var source = document.getElementById("receipt-temp").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(curReceipt);
    document.getElementById("receipt").insertAdjacentHTML("beforeend", html);
}

function clearTemp(element) {
    if (element.innerHTML) {
        element.innerHTML = "";
    }
}

function addEvents(listElm) {
    var button = listElm.querySelector("button");
    var formContainer = listElm.querySelector(".dropdown-form"); // turned buttons and object into set vars instead of reassigning them
    var object = getObjByName(listOfItems, button);
    addFormEvents(formContainer.querySelector("form"), object);
    button.addEventListener("click", function() {
        closeOtherForms(formContainer);
        showDropdown(formContainer); // re-rendering the templates gets rid of the button events (have to call makeRent Buttons again)
    });
}

function rentItem(object) {
    PAGE_DATA.receipt.push({
        itemName: object.name,
        itemPrice: object.price
    });
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

function addFormEvents(form, object) {
    formElements = form.elements;
    nameRegEx = /^[A-Za-z](?=['-]*)(?=[^'-\s0-9]*$)/; // checks for (letter'-(optional)(letter/number))
    phoneRegEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/; //regression statements only work for America
    receipt = document.getElementById("receipt");
    function checkValidity(event, regex, errorMsg) {
        inputValue = event.target.value;
        if (regex.test(inputValue.trim())) {
            // double check for inputs with white space
            inputValue = inputValue.trim();
            event.target.setCustomValidity("");
        } else {
            event.target.setCustomValidity(errorMsg);
        }
    }
    function finishTransaction(curReceipt) {
        PAGE_DATA.receipt = [];
        receiptButton = document.getElementById("show-receipt");
        receiptButton.addEventListener("click", function() {
            renderReceiptTemp(curReceipt);
        });
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
    formElements["address"].addEventListener("input", function(event) {
        checkValidity(event, /\w.*\w$/, "Not a valid address");
    });
    formElements["zip"].addEventListener("input", function(event) {
        checkValidity(event, /[0-9]{5}/, "Not a valid zip code");
    });
    formElements["city"].addEventListener("input", function(event) {
        checkValidity(event, /\w.*\w/, "Not a valid city name");
    });
    form.addEventListener("submit", function(event) {
        if (form.reportValidity()) {
            event.preventDefault();

            receipt.innerHTML = `<div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p>Show Receipt? </p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn" id="show-receipt">
                                Yes
                            </button>
                            <button
                                class="btn"
                                id="no-receipt"
                                data-dismiss="modal"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>`;
            $("#receipt").modal();
            rentItem(object);
            finishTransaction(PAGE_DATA.receipt);
            renderItemTemp(); // receipt should only be generated after items have been added to it
        }
    });
}
