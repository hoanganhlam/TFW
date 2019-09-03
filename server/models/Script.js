'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Script';

const NewSchema = new Schema({
    title: String,
    options: {
        type: Object,
        default: {
            cType: 'HEADLESS',
            key: 'url',
            params: {}
        },

    },
    jobs: []
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

module.exports = mongoose.model(collection, NewSchema);
