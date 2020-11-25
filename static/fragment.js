class Receipt extends HTMLElement {

    connectedCallback() {
        this.products = this._fetchProducts();
        this.orderItems = {};
        this.total = 0;

        window.addEventListener("team-two-buy", (e) => {
            const productKey = e.detail["product-type"];
            console.log(`[TEAM 3] Receive event buy ${productKey}`);
            const productDetail = this.products[productKey];
            if (productDetail) {
                this._addItem(productKey, productDetail);
                this.render();
            }
        });

        window.addEventListener("team-two-sell", (e) => {
            const productKey = e.detail["product-type"];
            console.log(`[TEAM 3] Receive event sell ${productKey}`);
            const productDetail = this.products[productKey];
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

    _fetchProducts() {
        return {
            airpods: { name: "Airpods", price: "199", img: "airpods.jpg" },
            shoe: { name: "Air Jordans", price: "125", img: "air-jordans.jpg" },
            iphone: { name: "Smartphone", price: "699", img: "smartphone.jpg" },
            book: { name: "Book", price: "15", img: "book.jpg" },
            bike: { name: "Bike", price: "800", img: "bike.jpg" },
            videoGame: { name: "Gaming Console", price: "299", img: "video-game.jpg" },
            movieTicket: { name: "Movie Ticket", price: "12", img: "movie-ticket.jpg" },
            amazonEcho: { name: "Amazon Echo", price: "99", img: "amazon-echo.jpg" },
            drone: { name: "Drone", price: "350", img: "drone.jpg" }
        }
    }

}

window.customElements.define("three-receipt", Receipt);