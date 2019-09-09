'use strict';
const utilities = require('../helpers/utilities')
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'File';

const NewSchema = new Schema({
    title: String,
    description: String,
    path: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    size: Object
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

NewSchema.post('init', async function () {
    if (this.path) {
        this.size = await utilities.resize(this.path, ['100_100', '200_200', '100_200', '210_260'])
        this.save()
    }
});


module.exports = mongoose.model(collection, NewSchema);
