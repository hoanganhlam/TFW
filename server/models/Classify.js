const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');

let NewSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true, sparse: true},
    title: String,
    description: String,
    classify: {type: mongoose.Schema.Types.ObjectId, ref: 'Classify'}
}, {
    timestamps: true,
});

NewSchema.plugin(uniqueValidator, {message: 'is already taken'});

NewSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }
    next();
});

module.exports = mongoose.model('Classify', NewSchema);
