const receiptOperation = require('../../src/Receipts/ReceiptsOperations');

describe('getDateTime', () => {
    test('returns a valid date object when given valid date and time strings', () => {
        const date = '2022-03-04';
        const time = '14:55';
    
        const result = receiptOperation.getDateTime(date, time);
    
        expect(result).toBeInstanceOf(Date);
        expect(result.toLocaleString().replace(/\u202F/, ' ')).toBe('3/4/2022, 2:55:00 PM');
    });

    test('throws an error when given an invalid date string', () => {
        const date = '2022-02-32';
        const time = '14:55';
        expect(() => {
            receiptOperation.getDateTime(date, time);
        }).toThrowError(/is invalid/);
    });

    test('throws an error when given an invalid time string', () => {
        const date = '2022-03-04';
        const time = '25:00';

        expect(() => {
            receiptOperation.getDateTime(date, time);
        }).toThrowError('2022-03-04 or 25:00 is invalid.');
    });
});

describe('checkIfPriceIsNum', () => {
    test('should throw 403 error for empty string', async () => {
        expect.assertions(2);
        try {
            await receiptOperation.checkIfPriceIsNum('');
        } catch (error) {
            expect(error).toHaveProperty('code', 403);
            expect(error).toHaveProperty('message', 'Price cannot be empty');
        }
    });

    test('should throw 403 error for non-numeric string', async () => {
        expect.assertions(2);
        try {
            await receiptOperation.checkIfPriceIsNum('abc');
        } catch (error) {
            expect(error).toHaveProperty('code', 403);
            expect(error).toHaveProperty('message', 'abc is not a number.');
        }
    });

    test('should not throw error for numeric string', async () => {
        try {
            await receiptOperation.checkIfPriceIsNum('123');
        } catch (error) {
            expect(error).toBeUndefined();
        }
    });

    test('should not throw error for numeric value', async () => {
        try {
            await receiptOperation.checkIfPriceIsNum(123); // Numeric value
        } catch (error) {
            expect(error).toBeUndefined();
        }
    });
});

describe('pointsFromDateTime', () => {
    test('2022-03-20T04:33:00.000Z Returns 10', async () => {
        const date = new Date('2022-03-20T15:33:00');
        const result = await receiptOperation.pointsFromDateTime(date)
        expect(result).toBe(10);
    });

    test('2022-03-19T21:33:00.000Z Returns 16', async () => {
        const date = new Date('2022-03-18T21:33:00');
        const result = await receiptOperation.pointsFromDateTime(date)
        expect(result).toBe(0);
    });

    test('2022-03-19T21:33:00.000Z Returns 16', async () => {
        const date = new Date('2022-03-19T04:33:00');
        const result = await receiptOperation.pointsFromDateTime(date)
        expect(result).toBe(6);
    });
});

describe('checkIfNullOrEmpty', () => {
    test('should throw 403 error for empty string', async () => {
        expect.assertions(2);
        try {
            await receiptOperation.checkIfNullOrEmpty('Test', '');
        } catch (error) {
            expect(error).toHaveProperty('code', 403);
            expect(error).toHaveProperty('message', 'Test cannot be NULL or empty.');
        }
    });

    test('should throw 403 error for null', async () => {
        expect.assertions(2);
        try {
            await receiptOperation.checkIfNullOrEmpty('Test', null);
        } catch (error) {
            expect(error).toHaveProperty('code', 403);
            expect(error).toHaveProperty('message', 'Test cannot be NULL or empty.');
        }
    });

    test('should not throw error for non-empty string', async () => {
        try {
            await receiptOperation.checkIfNullOrEmpty('Test', 'non-empty');
        } catch (error) {
            // The test should not throw an error in this case
            expect(error).toBeUndefined();
        }
    });
});