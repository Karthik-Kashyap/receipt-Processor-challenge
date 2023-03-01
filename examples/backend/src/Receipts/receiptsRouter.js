const router = require('express').Router();
const ReceiptsOperations = require('./ReceiptsOperations.js');
const corsMethodsAllowed = require('../corsMethodsAllowed.js');

router.get('/:id/points', corsMethodsAllowed(['GET']), ReceiptsOperations.getPointsByReceiptId);
router.post('/process', corsMethodsAllowed(['POST']), ReceiptsOperations.saveReceipt);

module.exports = router;