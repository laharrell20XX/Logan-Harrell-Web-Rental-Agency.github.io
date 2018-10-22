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
    if (formContainer) {
        addFormEvents(formContainer.querySelector("form"), object);
        button.addEventListener("click", function() {
            closeOtherForms(formContainer); // closes other open forms before opening another form
            showDropdown(formContainer); // re-rendering the templates gets rid of the button events (have to call makeRent Buttons again)
        });
    }
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
    for (var listElm of listElms) {
        addEvents(listElm);
    }
}

function showDropdown(form) {
    form.classList.toggle("hide");
    form.classList.toggle("show");
}
function closeOtherForms(cur_form) {
    if (cur_form.classList.contains("show")) {
        // checks if the form the event was fired from is currently being shown
        return; // rest of function will get ignored
    } else {
        var shownForm = document.querySelector(".dropdown-form.show"); // collects any shown forms and stores them in a variable
        if (shownForm) {
            // checks if a shown form exists
            shownForm.classList.toggle("show"); // removes the show class from the shown form
            shownForm.classList.toggle("hide"); // adds the hide class to the shown form, hiding it
        }
    }
}

function addFormEvents(form, object) {
    formElements = form.elements;
    nameRegEx = /[A-Za-z](?=[-'\s]*)(?=[^'-\s0-9]*$)/; // checks for (letter'-(optional)(letter/number))
    phoneRegEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/; //regression statements only work for America
    receipt = document.getElementById("receipt");
    function checkValidity(event, regex, errorMsg) {
        var curFormElm = event.target;
        var error = form.querySelector(
            "p#" + event.target.getAttribute("name") + "-error"
        );
        error.innerText = errorMsg;
        inputValue = curFormElm.value;
        if (regex.test(inputValue.trim()) && inputValue) {
            // double check for inputs with white space
            error.classList.add("hide");
            inputValue = inputValue.trim();
            curFormElm.setCustomValidity("");
        } else {
            error.classList.remove("hide");
            curFormElm.setCustomValidity(errorMsg);
        }
    }
    function finishTransaction(curReceipt) {
        PAGE_DATA.receipt = [];
        receiptButton = document.getElementById("show-receipt");
        receiptButton.addEventListener("click", function() {
            renderReceiptTemp(curReceipt);
        });
    }
    formElements["name"].addEventListener("change", function(event) {
        checkValidity(event, nameRegEx, "Please enter a valid name");
    });
    formElements["phone"].addEventListener("change", function(event) {
        checkValidity(
            event,
            phoneRegEx,
            "Please enter a valid phone number (e.g. 123-456-7890)"
        );
    });
    formElements["address"].addEventListener("change", function(event) {
        checkValidity(event, /\w.*/, "Please enter a valid address");
    });
    formElements["zip"].addEventListener("change", function(event) {
        checkValidity(event, /[0-9]{5}/, "Please enter a valid zip code");
    });
    formElements["city"].addEventListener("change", function(event) {
        checkValidity(event, /\w.*\w$/, "Please enter a valid city name");
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
