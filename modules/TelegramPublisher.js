const PromiseThrottle = require('promise-throttle');
const TelegramBot = require('node-telegram-bot-api');


module.exports = (token, chat_id, messages_limit) => {
    const bot = new TelegramBot(token, { polling: true });

    const promiseThrottle = new PromiseThrottle({
        requestsPerSecond: messages_limit,
        promiseImplementation: Promise
    });

    function publishItem(item) {
        return new Promise((res, rej) => {
            bot.sendMessage(chat_id, prepareContent(item.content), { parse_mode: "HTML" });
            res();
        });
    }

    function prepareContent(content) {
        return content.replace(/<br\s?\/>/g, "\n")
    }

    return {
        publishItems: (items) => {
            items = items.map(item => promiseThrottle.add(() => {
                return publishItem(item).then(() => {
                    res();
                });
            }));
            return Promise.all(items);
        },
    }
};