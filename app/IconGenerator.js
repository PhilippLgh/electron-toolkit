const png2icons = require("png2icons");
const ImageUtils = require("./ImageUtils.js")
const path = require("path")
const fs = require("fs")

class IconGenerator {

    constructor(projectDir) {

        this.buildDir = path.join(projectDir, "build");
        this.pngDir = path.join(this.buildDir, "png");

    }

    prepareIconDirs() {

        return new Promise((resolve, reject) => {
            this.prepareDirectory(this.buildDir)
                .then(data => {
                    return this.prepareDirectory(this.pngDir)
                })
                .then(data => {
                    resolve();

                })
        });

    }

    prepareDirectory(dir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if (err) {
                    if (err.code == "EEXIST") {
                        return resolve(dir);
                    }
                    reject(err);
                } else {
                    resolve(dir);
                }
            });
        });
    }

    readFile(p) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, function(error, data) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }

    writeFile(p, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(p, data, err => {
                if (err) {
                    return reject(err);
                }
                resolve(p);
            });
        });
    }

    //create dir if not exists and return path
    getWritableDir() {
        return new Promise((resolve, reject) => {});
    }

    getExtension(p) {
        return path.extname(p).toLowerCase();
    }

    generatePng(imagePath) {
        return this.prepareIconDirs()
            .then(() => {
                if (ImageUtils.isPng(imagePath)) {
                    return Promise.resolve(imagePath);
                }
                if (!ImageUtils.isSvg(imagePath)) {
                    throw new Error("svg or png input required");
                }

                const outPath = path.join(this.buildDir, "512x512.png");

                return ImageUtils.svg2png(imagePath, { width: 512, height: 512 })
                    .then(buffer => this.writeFile(outPath, buffer))
                    .then(filePath => {

                        // console.log("RETURNING OUT", outPath);
                        return outPath;
                    })
            })
    }

    generatePngBundle(pngPath) {
        if (!ImageUtils.isPng(pngPath)) {
            return Promise.reject(new Error("png input required"));
        }

        // console.log("png path", this);
        var OUT_DIR = this.pngDir;

        var scales = [16, 24, 32, 48, 64, 96, 128, 256, 512];

        var promises = scales.map(scale => { return ImageUtils.resizePng(pngPath, scale, OUT_DIR) });

        return Promise.all(promises).then(data => {
            return {
                //in: pngPath,
                //use 512px generated png from bundle as input for .ico & .icns
                //for performance
                in: path.join(OUT_DIR, "512x512.png"),
                out: OUT_DIR
            };
        });
    }

    generateIcns(pngPath) {
        var icnsPath = path.join(this.buildDir, "icon.icns");
        if (!ImageUtils.isPng(pngPath)) {
            return Promise.reject(new Error("png input required"));
        }

        return this.readFile(pngPath).then(data => {
            var output = png2icons.PNG2ICNS(data, png2icons.BILINEAR, false, 0);
            if (!output) {
                throw new Error("conversion to Icns failed");
            }
            return this.writeFile(icnsPath, output).then(filePath => {
                return { in: pngPath,
                    out: icnsPath
                };
            });
        });
    }

    generateIco(pngPath) {
        var icoPath = path.join(this.buildDir, "icon.ico");

        if (!ImageUtils.isPng(pngPath)) {
            return Promise.reject(new Error("png input required"));
        }

        return this.readFile(pngPath).then(data => {
            //var output = png2icons.PNG2ICO_PNG(data, png2icons.BEZIER, false, 0);
            // Microsoft ICO using BMP icons with bicubic interpolation. 
            var output = png2icons.PNG2ICO_BMP(data, png2icons.BICUBIC, false);
            if (!output) {
                throw new Error("conversion to Ico failed");
            }
            return this.writeFile(icoPath, output).then(filePath => {
                return { in: pngPath,
                    out: icoPath
                };
            });
        });
    }
}

module.exports = IconGenerator;