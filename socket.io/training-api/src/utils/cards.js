const cards = [{
    "number": "4111111111111111",
    "success": true,
    "message": "Transaction successful"
}, {
    "number": "5555555555554444",
    "success": true,
    "message": "Transaction successful"
}, {
    "number": "4000000000009995",
    "success": false,
    "message": "Declined due to insufficient funds"
}, {
    "number": "4000000000000127",
    "success": false,
    "message": "Declined due to incorrect CVV"
}]

module.exports = cards
