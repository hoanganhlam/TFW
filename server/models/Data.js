'use strict';
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Data';

const NewSchema = new Schema({
    script: {type: mongoose.Schema.Types.ObjectId, ref: 'Script'},
    campaign: {type: mongoose.Schema.Types.ObjectId, ref: 'Campaign'},
    key: String,
    value: Object,
    tags: Array
}, {
    versionKey: true,
    collection: collection,
    timestamps: true
});

NewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(collection, NewSchema);
