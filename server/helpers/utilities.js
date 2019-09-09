const path = require('path');
const fs = require('fs')
const sharp = require('sharp');


exports.mkDirByPathSync = (targetDir, {isRelativeToScript = false} = {}) => {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        } catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                throw err; // Throw if it's just the last created dir.
            }
        }

        return curDir;
    }, initDir);
}

exports.removeLastPath = (the_url) => {
    let the_arr = the_url.split('/');
    the_arr.pop();
    return (the_arr.join('/'));
}

exports.removeFirstPath = (the_url) => {
    let the_arr = the_url.split('/');
    the_arr.shift();
    the_arr.shift();
    return (the_arr.join('/'));
}


exports.resize = async (filePath, sizes) => {
    let outSize = {}
    for (let size of sizes) {
        let sizeArr = size.split("_")
        let width = Number.parseInt(sizeArr[0]), height = Number.parseInt(sizeArr[1])
        let current = this.removeLastPath(path.dirname(require.main.filename))
        let inPath = `${current}/static/${filePath}`
        let outPath = `${current}/static/realized/${size}/${path.basename(filePath)}`
        let checkPath = require('path').dirname(outPath);
        this.mkDirByPathSync(checkPath)
        try {
            if (!fs.existsSync(outPath)) {
                await sharp(inPath).resize({height: height, width: width}).toFile(outPath)
                    .catch(err => {
                        console.log(err);
                    })
            }
            outSize[size] = `realized/${size}/${path.basename(filePath)}`
        } catch (err) {
            console.error(err)
        }
    }
    return outSize
}
