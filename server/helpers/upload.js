const multer = require('multer');
const path = require('path');
const slug = require('slug');
const utilities = require('./utilities')

const storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        let today = new Date()
        let xpath = utilities.removeLastPath(path.dirname(require.main.filename)) + '/static/uploads/'
        xpath = xpath
            + today.getFullYear().toString() + '/'
            + today.getMonth().toString() + '/'
            + today.getDate().toString()
        utilities.mkDirByPathSync(xpath)
        callback(null, xpath);
    },
    filename: function (req, file, callback) {
        callback(null, slug(path.parse(file.originalname).base) + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage})

module.exports = upload
