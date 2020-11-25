class Receipt extends HTMLElement {

    connectedCallback() {
        this.orderItems = {};
        this.total = 0;

        window.addEventListener("team-two-buy", (e) => {
            const productKey = e.detail["product-type"];
            console.log(`[TEAM 3] Receive event buy ${productKey}`);
            const productDetail = products[productKey];
            if (productDetail) {
                this._addItem(productKey, productDetail);
                this.render();
            }
        });

        window.addEventListener("team-two-sell", (e) => {
            const productKey = e.detail["product-type"];
            console.log(`[TEAM 3] Receive event sell ${productKey}`);
            const productDetail = products[productKey];
            if (productDetail && this.orderItems[productKey]) {
                this._removeItem(productKey, productDetail);
                this.render();
            }
        });

        this.render();
    }

    render() {
        if (this.orderItems) {
            this.innerHTML = `
                <table class="receipt-table pure-table pure-table-horizontal center">
                    <tbody>
                        ${this._generateDom(this.orderItems)}
                        <tr>
                            <td>TOTAL</td>
                            <td class="text-right price" colspan="2">$${this.total}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }
    }

    _addItem(productKey, productDetail) {
        const orderItems = this.orderItems;
        if (!orderItems[productKey]) {
            this.orderItems = {
                [productKey]: {
                    itemName: productDetail.name,
                    unitPrice: productDetail.price,
                    quantity: 1
                }, ...orderItems
            };
        } else {
            this.orderItems[productKey] = {
                itemName: productDetail.name,
                unitPrice: productDetail.price,
                quantity: orderItems[productKey].quantity + 1
            };
        }
        this._updateTotal();
    }

    _removeItem(productKey, productDetail) {
        const orderItems = this.orderItems;
        if (orderItems[productKey].quantity > 1) {
            this.orderItems[productKey] = {
                itemName: productDetail.name,
                unitPrice: productDetail.price,
                quantity: orderItems[productKey].quantity - 1
                // Deduct one item
            };
        } else {
            delete this.orderItems[productKey]
        }
        this._updateTotal();
    }

    _updateTotal() {
        this.total = Object.values(this.orderItems)
            .map(item => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
        this.dispatchEvent(
            new CustomEvent("team-three-update-total", {
                bubbles: true,
                detail: { 'amount': this.total }
            })
        );
    }

    _generateDom(items) {
        const orderDetail = Object.values(items);
        return orderDetail.map(item => `
            <tr>
                <td>${item.itemName}</td>
                <td class="text-right">x${item.quantity}</td>
                <td class="text-right price">$${item.unitPrice * item.quantity}</td>
            </tr>`
        ).join("");
    }

}

window.customElements.define("three-receipt", Receipt);