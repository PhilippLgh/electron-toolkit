module.exports = {
    prod: process.env["ELECTRON_ENV"] !== "development",
    dev: process.env["ELECTRON_ENV"] === "development"
};