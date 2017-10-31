var parser = require('rss-parser');

module.exports = (url) => {
    return {
        retrieveEvents: () => {
            return new Promise((resolve, reject) => {
                parser.parseURL(url, (err, parsed) => {
                    if (err || !parsed.feed || !parsed.feed.entries) {
                        reject(err);
                    }
                    resolve(parsed.feed.entries);
                });
            });
        }
    };
};