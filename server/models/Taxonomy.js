const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');

let NewSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true, sparse: true},
    title: String,
    description: String,
    isPublic: {type: Boolean, default: true},
    isObject: {type: Boolean, default: true},
    kind: [String],
    photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'File'}],
}, {
    timestamps: true,
});

NewSchema.virtual('facts', {
    ref: 'Fact',
    localField: '_id',
    foreignField: 'taxonomies',
    justOne: false
});

NewSchema.plugin(uniqueValidator, {message: 'is already taken'});

NewSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }
    next();
});

NewSchema.methods.toJsonFor = function () {
    let tempPhotos = []
    for (let i = 0; i < this.facts.length; i++) {
        if (this.facts[i].photo) {
            tempPhotos.push(this.facts[i].photo)
        }
    }
    return {
        _id: this._id,
        slug: this.slug,
        title: this.title,
        description: this.description,
        isObject: this.isObject,
        tempPhotos
    }
};

module.exports = mongoose.model('Taxonomy', NewSchema);
