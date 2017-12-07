const jimp = require("jimp");
const path = require('path');
const fs = require('fs');
const { nativeImage } = require('electron');

class ImageUtils {
    static isSvg(imagePath) {
        return path.extname(imagePath).toLowerCase() == ".svg";
    }

    static isPng(imagePath) {
        return path.extname(imagePath).toLowerCase() == ".png";
    }

    static resizePng(imagePath, scale, dir) {
        //console.log("resize", imagePath, scale, dir);
        return new Promise((resolve, reject) => {
            jimp
                .read(imagePath)
                .then(function(img) {
                    img
                        .resize(scale, scale)
                        .write(`${dir}/${scale}x${scale}.png`, err => {
                            if (err) return reject();
                            resolve();
                        });
                })
                .catch(function(err) {
                    console.log(err);
                    reject();
                });
        });
    }

    //FIXME support more formats / mime types and async loading
    static loadAsDataUri(pngUri) {
        var content = fs.readFileSync(pngUri);
        var dataUri = "data:image/png;base64," + content.toString("base64");
        return dataUri;
    }

    static dataUriToBuf(pngUri) {
        //alternative without native image
        //var base64Data = pngUri.replace(/^data:image\/png;base64,/, "");
        //var binaryData = new Buffer(base64Data, "base64").toString("binary");
        //return binaryData;
        var pngNative = nativeImage.createFromDataURL(pngUri);
        return pngNative.toPng();
    }

    static svg2png(svgPath) {
        return new Promise((resolve, reject) => {
            var canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
            var ctx = canvas.getContext("2d");
            var img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                var pngUri = canvas.toDataURL("image/png");
                // console.log("data uri is ready", pngUri.length)
                var buf = ImageUtils.dataUriToBuf(pngUri);
                resolve(buf); //resolve png buffer
            };
            img.onerror = e => {
                reject(e);
            };

            fs.readFile(svgPath, (err, content) => {
                if (err) return reject(err);
                var dataUri = "data:image/svg+xml;base64," + content.toString("base64");
                img.src = dataUri;
            });
        });
    }
}

module.exports = ImageUtils;