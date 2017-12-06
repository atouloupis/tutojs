var MongoDb = require ('./MongoDb');


module.exports.updateOrderBook = updateOrderBook;

function updateOrderBook(orderBookFrame)
{
mongoDb.createMongoCollection("orderBook",orderBookFrame);
console.log("#"+JSON.stringify(orderBookFrame));
}