function renderItemTemp() {
    var source = document.getElementById("store-item-temp").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(PAGE_DATA.storeItems);
    document.querySelector("div.store-items ul").insertAdjacentHTML("beforeend", html)
}