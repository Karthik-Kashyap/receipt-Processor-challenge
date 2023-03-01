const { v4: uuidv4 } = require('uuid');
const backendUtils = require("../../common/backendUtils");
const logger = require("../../logger/logger");

const Item = require('./Item');
const Receipt = require('./Receipt');

let globalReceiptDict = {};

function isNumeric(num) {
    if (num === '' || num === null) {
        return true
    }
    return isNaN(num)
}

const checkIfPriceIsNum = async (price) => {
    if (isNumeric(price)) {
        const error = new Error(`${price} is not a number.`);
        if (price == "") error.message = "Price cannot be empty";
        error.code = 403;
        throw error;
    }
}

const checkIfNullOrEmpty = async (receiptProperty, propertyValue) => {
    if (!propertyValue || propertyValue.length == 0) {
        const error = new Error();
        error.code = 403;
        error.message = `${receiptProperty} cannot be NULL or empty.`;
        throw error;
    }
}

const getDateTime = function (date, time) {
    dateTime = new Date(date + `T${time}:00`)
    if ((dateTime === "Invalid Date") || isNaN(dateTime)) {
        const error = new Error();
        error.code = 403;
        error.message = `${date} or ${time} is invalid.`;
        throw error;
    }
    return dateTime;
}

const verifyReceipt = async (receipt) => {
    logger.info("Receipt verification initiated");
    await checkIfNullOrEmpty('Retailer', receipt.retailer);
    await checkIfNullOrEmpty('Purchase date', receipt.purchaseDate);
    await checkIfNullOrEmpty('Purchase time', receipt.purchaseTime);
    await checkIfNullOrEmpty('Total', receipt.total);
    await checkIfNullOrEmpty('Items', receipt.items);
    await checkIfPriceIsNum(receipt.total);
    getDateTime(receipt.purchaseDate, receipt.purchaseTime);
    let totalOfItems = 0;
    for (let item of receipt.items) {
        await checkIfPriceIsNum(item.price);
        totalOfItems += parseFloat(item.price);
    }
    if (parseFloat(receipt.total) != totalOfItems.toFixed(2)) {
        const error = new Error("Items' price isn't adding upto total.");
        error.code = 403;
        throw error;
    }
}

const pointsFromDateTime = async (dateTime) => {
    let points = 0;
    if (dateTime.getDate() % 2 != 0) points += 6;
    if (dateTime.getHours() >= 14 && dateTime.getHours() <= 16) points += 10;
    return points;
}

const getNewReceiptObject = async (receipt) => {
    const items = [];
    for (let item of receipt.items) {
        let newItem = new Item(item.shortDescription, await parseFloat(item.price));
        items.push(newItem);
    }
    const newReceipt = new Receipt(receipt.retailer, await getDateTime(receipt.purchaseDate, receipt.purchaseTime), items, parseFloat(receipt.total), 0);
    let points = 0;
    points += newReceipt.retailer.replace(/[^0-9a-zA-Z]/g, '').length
    if (parseInt(newReceipt.total) == parseFloat(newReceipt.total)) points += 50;
    if (parseFloat(newReceipt.total) % 0.25 == 0) points += 25;
    points += parseInt(newReceipt.items.length / 2) * 5
    for (let item of newReceipt.items) {
        if (item.shortDescription.trim().length % 3 == 0) {
            points += Math.ceil(0.2 * item.price);
        }
    }
    points += await pointsFromDateTime(newReceipt.dateTime);
    newReceipt.setPoints(points);
    return newReceipt;
}

const getPointsByReceiptId = async (req, res) => {
    try {
        id = req.params.id;
        backendUtils.respond(res, 200, { "points": globalReceiptDict[id].points });
    } catch (err) {
        logger.error(`error: ${err}`);
        backendUtils.respond(res, err.code, err.message);
    }
}

const saveReceipt = async (req, res) => {
    try {
        const receipt = req.body;
        await verifyReceipt(receipt);
        let newId = uuidv4();
        newReceipt = await getNewReceiptObject(receipt);
        globalReceiptDict[newId] = newReceipt;
        logger.info("Saved receipt successfully.");
        backendUtils.respond(res, 200, { "id": newId });
    } catch (err) {
        logger.error(`error: ${err}`);
        backendUtils.respond(res, err.code, err.message);
    }
}

module.exports = {
    checkIfNullOrEmpty,
    checkIfPriceIsNum,
    getPointsByReceiptId,
    getDateTime,
    pointsFromDateTime,
    saveReceipt,
    verifyReceipt
};