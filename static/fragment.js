class Receipt extends HTMLElement {

    connectedCallback() {
        this.products = this.fetchProducts();
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

    fetchProducts() {
        return {
            "big-mac": { "name": "Big Mac", "price": "20", "img": "big-mac.jpg" },
            "flip-flops": { "name": "Flip Flops", "price": "30", "img": "flip-flops.jpg" },
            "coca-cola-pack": { "name": "Coca-Cola Pack", "price": "50", "img": "coca-cola-pack.jpg" },
            "movie-ticket": { "name": "Movie Ticket", "price": "12000", "img": "movie-ticket.jpg" },
            "book": { "name": "Book", "price": "15000", "img": "book.jpg" },
            "lobster-dinner": { "name": "Lobster Dinner", "price": "450", "img": "lobster-dinner.jpg" },
            "video-game": { "name": "Video Game", "price": "600", "img": "video-game.jpg" },
            "amazon-echo": { "name": "Amazon Echo", "price": "99000", "img": "amazon-echo.jpg" },
            "year-of-netflix": { "name": "Year of Netflix", "price": "1000", "img": "year-of-netflix.jpg" },
            "air-jordans": { "name": "Air Jordans", "price": "125000", "img": "air-jordans.jpg" },
            "airpods": { "name": "Airpods", "price": "199000", "img": "airpods.jpg" },
            "gaming-console": { "name": "Gaming Console", "price": "299000", "img": "gaming-console.jpg" },
            "drone": { "name": "Drone", "price": "350000", "img": "drone.jpg" },
            "smartphone": { "name": "Smartphone", "price": "699000", "img": "smartphone.jpg" },
            "bike": { "name": "Bike", "price": "800000", "img": "bike.jpg" },
            "kitten": { "name": "Kitten", "price": "15000", "img": "kitten.jpg" },
            "puppy": { "name": "Puppy", "price": "15000", "img": "puppy.jpg" },
            "auto-rickshaw": { "name": "Auto Rickshaw", "price": "23000", "img": "auto-rickshaw.jpg" },
            "horse": { "name": "Horse", "price": "25000", "img": "horse.jpg" },
            "acre-of-farmland": { "name": "Acre of Farmland", "price": "30000", "img": "acre-of-farmland.jpg" },
            "designer-handbag": { "name": "Designer Handbag", "price": "55000", "img": "designer-handbag.jpg" },
            "hot-tub": { "name": "Hot Tub", "price": "60000", "img": "hot-tub.jpg" },
            "luxury-wine": { "name": "Luxury Wine", "price": "70000", "img": "luxury-wine.jpg" },
            "diamond-ring": { "name": "Diamond Ring", "price": "100000", "img": "diamond-ring.jpg" },
            "jet-ski": { "name": "Jet Ski", "price": "120000", "img": "jet-ski.jpg" },
            "rolex": { "name": "Rolex", "price": "150000", "img": "rolex.jpg" },
            "ford-f-150": { "name": "Ford F-150", "price": "300000", "img": "ford-f-150.jpg" },
            "tesla": { "name": "Tesla", "price": "750000", "img": "tesla.jpg" },
            "monster-truck": { "name": "Monster Truck", "price": "1500000", "img": "monster-truck.jpg" },
            "ferrari": { "name": "Ferrari", "price": "2500000", "img": "ferrari.jpg" },
            "single-family-home": { "name": "Single Family Home", "price": "3000000", "img": "single-family-home.jpg" },
            "gold-bar": { "name": "Gold Bar", "price": "7000000", "img": "gold-bar.jpg" },
            "mcdonalds-franchise": { "name": "McDonalds Franchise", "price": "1500000", "img": "mcdonalds-franchise.jpg" },
            "superbowl-ad": { "name": "Superbowl Ad", "price": "5250000", "img": "superbowl-ad.jpg" },
            "yacht": { "name": "Yacht", "price": "7500000", "img": "yacht.jpg" },
            "m1-abrams": { "name": "M1 Abrams", "price": "8000000", "img": "m1-abrams.jpg" },
            "formula-1-car": { "name": "Formula 1 Car", "price": "1500000", "img": "formula-1-car.jpg" },
            "apache-helicopter": { "name": "Apache Helicopter", "price": "3100000", "img": "apache-helicopter.jpg" },
            "mansion": { "name": "Mansion", "price": "4500000", "img": "mansion.jpg" },
            "make-a-movie": { "name": "Make a Movie", "price": "1000000", "img": "make-a-movie.jpg" },
            "boeing-747": { "name": "Boeing 747", "price": "1480000", "img": "boeing-747.jpg" },
            "mona-lisa": { "name": "Mona Lisa", "price": "7800000", "img": "mona-lisa.jpg" },
            "skyscraper": { "name": "Skyscraper", "price": "8500000", "img": "skyscraper.jpg" },
            "cruise-ship": { "name": "Cruise Ship", "price": "9300000", "img": "cruise-ship.jpg" },
            "nba-team": { "name": "NBA Team", "price": "2120000", "img": "nba-team.jpg" }
        };
    }

}

window.customElements.define("three-receipt", Receipt);