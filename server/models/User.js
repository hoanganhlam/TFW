'use strict';

const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken')
var secret = require('../config').secret;

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const collection = 'User';

const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    hash: String,
    salt: String,
    firstName: String,
    lastName: String,
    avatar: {type: mongoose.Schema.Types.ObjectId, ref: 'File'},
    bio: String,
    isFiend: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    collection: collection,
    timestamps: true
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        avatar: this.avatar
    };
};

UserSchema.index({
    username: 1
}, {
    background: true,
    name: 'idx_users_by_username'
});

UserSchema.methods.toAuthJSONFor = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        firstName: this.firstName,
        lastName: this.lastName,
        avatar: this.avatar
    };
};

UserSchema.methods.vote = function (fact, value) {
    if (value) {
        let _this = this
        let voted = fact.votes.filter(vote => {
            return vote.user.toString() === _this._id.toString()
        })
        if (voted.length) {
            voted[0].value = value
        } else {
            fact.votes.push({
                user: this._id,
                value: value
            });
        }
    } else {
        fact.votes = fact.votes.filter(vote => vote.user.toString() !== this._id.toString())
    }
    return fact.save();
};

UserSchema.methods.isVoted = function (fact) {
    let _this = this
    let voted = fact.votes.filter(vote => {
        return vote.user.toString() === _this._id.toString()
    })
    return voted.length ? voted[0] : false;
};

UserSchema.methods.random = async function () {
    return this.count(function(err, count) {
        if (err) return cb(err);
        let rand = Math.floor(Math.random() * count);
        this.findOne().skip(rand);
    }.bind(this));
};

module.exports = mongoose.model(collection, UserSchema);
