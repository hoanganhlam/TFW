'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'Fact';

const NewSchema = new Schema({
    title: String,
    contentShort: String,
    contentLong: String,
    time: {
        day: String,
        month: String,
        year: String
    },
    number: {
        day: String,
        month: String,
        year: String,
        math: String,
        trivia: String
    },
    photo: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            value: Number
        }
    ],
    taxonomies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Taxonomy'}],
    source: Object,
    comments: [
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            content: String,
            votes: [
                {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
            ],
            createdAt: Date
        }
    ],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    pending: Boolean,
    point: Number,
}, {
    versionKey: false,
    collection: collection,
});

NewSchema.index({
    taxonomies: 1,
    date: 1,
    user: 1,
    votes: 1,
}, {
    background: true,
    name: 'idx_facts'
});

NewSchema.methods.toJSONFor = function (user) {
    return {
        _id: this._id,
        title: this.title,
        contentShort: this.contentShort,
        contentLong: this.contentLong,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        isVoted: user ? user.isVoted(this) : false,
        voteCount: this.point || 0,
        user: this.user.toAuthJSONFor(),
        taxonomies: this.taxonomies,
        photo: this.photo,
        source: this.source,
        comments: this.comments,
        time: this.time,
        number: this.number
    };
};

module.exports = mongoose.model(collection, NewSchema);
