// Init sandbox products
var pricingTables = document.getElementById("pricing-tables");
for (const key in dummyProducts) {
    if (dummyProducts.hasOwnProperty(key)) {
        const element = dummyProducts[key];
        pricingTables.innerHTML += `
            <div class="pure-u-1 pure-u-md-1-3">
                <div class="pricing-table dummy-product stripe">
                    <div class="pricing-table-header">
                        <span class="pricing-table-price">${element.name} ${element.price}$</span>
                    </div>
                    <div class="pricing-table-footer">
                        <button class="sell-button pure-button" data-product="${key}">Sell</button>
                        <button class="buy-button pure-button pure-button-primary" data-product="${key}">Buy</button>
                    </div>
                </div>
            </div>`;
    }
}

// Simulate team 1 sell buy button: Add dummy sell / buy button for sending custom event
var dispatchSellEvent = function() {
    productId = this.getAttribute("data-product");
    console.log(`[SIMULATE TEAM 2] Emit event sell ${productId}`);
    this.dispatchEvent(
        new CustomEvent("team-two-sell", {
            bubbles: true,
            detail: { 'product-type': productId }
        })
    );
};

var dispatchBuyEvent = function() {
    productId = this.getAttribute("data-product");
    console.log(`[SIMULATE TEAM 2] Emit event buy ${productId}`);
    this.dispatchEvent(
        new CustomEvent("team-two-buy", {
            bubbles: true,
            detail: { 'product-type': productId }
        })
    );
};

var sellButtons = document.getElementsByClassName('sell-button');
for (var i = 0; i < sellButtons.length; i++) {
    sellButtons[i].addEventListener("click", dispatchSellEvent);
}

var buyButtons = document.getElementsByClassName('buy-button');
for (var i = 0; i < buyButtons.length; i++) {
    buyButtons[i].addEventListener("click", dispatchBuyEvent);
}

// Simulate team 3 event receiver: Add listener to listen for update total
window.addEventListener("team-three-update-total", (e) => {
    console.log(`[SIMULATE TEAM 1] Received total amount is: ${e.detail.amount}`);
    document.getElementById("total-amount").innerHTML = currency(100000000000 - e.detail.amount, { fromCents: true, precision: 0 }).format();
});

