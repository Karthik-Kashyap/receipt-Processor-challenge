class Receipt {
    constructor(retailer, dateTime, items, total, points) {
        this.retailer = retailer;
        this.dateTime = dateTime;
        this.items = items;
        this.total = total;
        this.points = points;
    }
    getName() {
        return this.name;
    }
    setPoints(points) {
        this.points = points;
    }
}

module.exports = Receipt;