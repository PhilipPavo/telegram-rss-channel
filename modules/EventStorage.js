var mongoose = require('mongoose');
mongoose.Promise = Promise;
let Event = require('../models/event');

module.exports = (mongo_url) => {
    mongoose.connect(mongo_url, {
        useMongoClient: true
    }).then((db) => {
        console.log();
    }, err => {
        console.log(err);
    });


    return {
        appendItems: (items) => {
            const promises = items.map(data => {
                return new Promise((resolve, reject) => {
                    new Event(data).save((err, res) => {
                        if (err && err.code === 11000) {
                            resolve(false);
                        }

                        resolve(res);
                    });
                });
            });
            return Promise.all(promises);
        },

        getNotPublished: () => {
            return Event.find({ published: false }).exec();
        },

        setPublished: (item) => {
            item.published = true;
            return item.save();
        }
    };
};