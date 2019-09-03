'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Campaign';

const NewSchema = new Schema({
    title: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    fields: [{label: String, field: String, dataType: String, fields: Array}],
    crawlers: [
        {
            script: Object,
            options: Object,
        }
    ],
    data: [
        {key: String, value: Object}
    ],
    indexes: [
        {key: String, value: Object, crawler: String}
    ]
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

module.exports = mongoose.model(collection, NewSchema);
