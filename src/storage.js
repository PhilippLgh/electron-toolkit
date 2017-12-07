import store from "./store.js";

class Storage {


    constructor() {

    }

    getProperty(property) {

        var key = this.computeKey(property);
        ///console.log("storage storage", window.localStorage);

        //window.localStorage.removeItem(key);
        // console.log()
        var data = JSON.parse(window.localStorage.getItem(key));
        // console.log("saving", value);
        if (property == "website" && data) {
            this.addDataUrls(data);
        }
        return data;
    }

    setProperty(property, value) {

        let val = JSON.parse(JSON.stringify(value));
        if (property == "website") {
            this.removeDataUrls(val);
        }

        var key = this.computeKey(property);
        window.localStorage.setItem(key, JSON.stringify(val));

    }

    computeKey(key) {
        var val = 'electron-toolkit-' + store.id + "-" + key + '-setting';
        return val;
    }

    removeDataUrls(website) {
        this.replaceDataUrlWithPath(website.screenshot);
        this.replaceDataUrlWithPath(website.logo);
        _.forEach(website.features, (feature) => {
            this.replaceDataUrlWithPath(feature.asset);
        })
    }

    replaceDataUrlWithPath(asset) {
        if (asset.url.startsWith("data:")) {
            asset.url = "data:" + asset.path;
        }
    }

    addDataUrls(website) {
        this.generateDataUrlFromPath(website.screenshot);
        this.generateDataUrlFromPath(website.logo);
        _.forEach(website.features, (feature) => {
            this.generateDataUrlFromPath(feature.asset);
        })
    }

    generateDataUrlFromPath(asset) {
        if (asset.url.startsWith("data:")) {
            var path = asset.url.split("data:")[1];
            // console.log(path);
            try {
                asset.url = Toolkit.base64_abs(path);
            } catch (error) {
                //path does not exist
            }
            // asset.url = "data:"+asset.path;
        }
    }
}



const storage = new Storage();
export default storage;