var mongoDb = require ('./mongoDb');


module.exports.updateOrderBook = updateOrderBook;

function updateOrderBook(orderBookFrame)
{
mongoDb.createMongoCollection("orderBook",orderBookFrame);
console.log("#"+JSON.stringify(orderBookFrame));
}