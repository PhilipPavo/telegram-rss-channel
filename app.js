var config = require('./config');

var eventParser = require('./modules/EventParser')(config.rss_url);
var eventStorage = require('./modules/EventStorage')(config.mongo_url);
var telegramPublisher = require('./modules/TelegramPublisher')(config.telegram_bot_token, config.telegram_chat_id, config.telegram_per_second_limit);

var Event = require('./models/event');
var Logger = require('./modules/Logging');

console.info(`\napp started`);

function updateItems() {
    eventParser.retrieveEvents().then((res) => {
        console.log(`Retrieved: ${res.length} records`);

        let isset = 0;
        res.map(entry => {
            entry.published = false;
            return entry;
        });

        return eventStorage.appendItems(res);
    }).then(res => res.filter(item => {
        return item;
    })).then(inserted => {
        console.log(`Inserted items: ${inserted.length}`);
        return eventStorage.getNotPublished();
    }).then(items => {
        console.log(`Checking not published items: ${items.length} found`);
        return telegramPublisher.publishItems(items);
    }).then(() => {
        console.log('done');
    });
}

//setInterval(updateItems, config.interval);

updateItems();