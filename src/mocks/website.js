
const meta = {
    author: "",
    title: "",
    favicon: "",
    keywords: ""
};


const style = {
    backgroundColor: {
        "h": 0,
        "s": 0,
        "l": 1,
        "a": 1
    },
    backgroundColor2: {
        "h": 0,
        "s": 0,
        "l": 0.97,
        "a": 1
    },
    fontColor: {
        "h": 0,
        "s": 0,
        "l": 0.2,
        "a": 1
    },

    fontColor2: {
        "h": 0,
        "s": 0,
        "l": 0.52,
        "a": 1
    },
    buttonColor: {
        "h": 197,
        "s": 0.48,
        "l": 0.63,
        "a": 1
    },
    buttonFontColor: {
        "h": 0,
        "s": 0,
        "l": 1,
        "a": 1
    },
    accentColor: {
        "h": 0,
        "s": 0,
        "l": 0.4,
        "a": 1
    },
    fontFamily: "Open Sans",
    fontFamily2: "Abel"
};

const website = {
    pro: false,
    availableInstallers: {
        Mac: true,
        Windows: true,
        Linux: true
    },
    style: style,
    meta: meta,

    name: "Product name",
    company: "example Ltd.",
    year: (new Date()).getFullYear() + "",
    email: "example@company.com",

    logo: {
        "path":"",
        "type": "image",
        "id": "f5941a52-7dee-423e-85ca-7e2475b2af40",
        "title": "logo",
        "url": "https://launchfox.co/assets/placeholder_icon.png"
    },

    mission: "Product mission statement",
    description: "Catchy product description text.",
    featuresHeadline: "What's inside?",
    testimonialHeadline: "What people are saying...",
    features: [{
            "id": "89493662-9921-4a77-b829-1230c6bae3e6",
            "name": "Feature 1",
            "description": "What makes this feature awesome?",
            "asset": {
                "path":"",
                "type": "image",
                "id": "f5941a52-7dee-423e-85ca-7e2475b2daf40",
                "title": "Feature image",
                "url": "https://launchfox.co/assets/app_template_placeholder.png"
            }
        },
        {
            "id": "89493662-9921-4a77-b829-1230c6bae3e5",
            "name": "Feature 2",
            "description": "What makes this feature awesome?",
            "asset": {
                "path":"",
                "type": "image",
                "id": "f5941a52-7dee-423e-85ca-7e2475db2af42",
                "title": "Feature image",
                "url": "https://launchfox.co/assets/app_template_placeholder.png"
            }
        },
        {
            "id": "89493662-9921-4a77-b829-1230cd6bae3e4",
            "name": "Feature 3",
            "description": "What makes this feature awesome?",
            "asset": {
                "path":"",
                "type": "image",
                "id": "f5941a52-7dee-423e-85ca-7e2475b2af43",
                "title": "Feature image",
                "url": "https://launchfox.co/assets/app_template_placeholder.png"
            }
        },
        {
            "id": "89493662-9921-4a77-b82d9-1230c6bae3e8",
            "name": "Feature 4",
            "description": "What makes this feature awesome?",
            "asset": {
                "path":"",
                "type": "image",
                "id": "f5941a52-7dee-423e-85cda-7e2475b2af40",
                "title": "Feature image",
                "url": "https://launchfox.co/assets/app_template_placeholder.png"
            }
        }
    ],
    testimonials: [{
            "id": "1",
            "name": "John Doe",
            "text": "You have an amazing product. Keep up the good work!",
            "image": "",
            "src": ""
        },
        {
            "id": "2",
            "name": "Jane Doe",
            "text": "You have an amazing product. Keep up the good work!",
            "image": "",
            "src": ""
        }
    ],
    social: [{
            "id": "1",
            "name": "Twitter",
            "icon": "fa fa-twitter",
            "url": "twitter.com/<your product>"
        },
        {
            "id": "2",
            "name": "Medium",
            "icon": "fa fa-medium",
            "url": "medium.com/<your product>"
        },
        {
            "id": "3",
            "name": "GitHub",
            "icon": "fa fa-github",
            "url": "github.com/<your product>"
        },
        {
            "id": "4",
            "name": "Google Plus",
            "icon": "fa fa-google-plus",
            "url": "plus.google.com/<your product>"
        }
    ],
    deviceTemplate: {
        url: "https://launchfox.co/assets/placeholder_trans.png",
        preview: "https://launchfox.co/assets/placeholder_trans.png"
    },

    screenshot: {
        "path":"",
        "type": "image",
        "id": "6cdf248b-8b56-4dc2-8f55-17751f17252e",
        "title": "Release video",
        "url": "https://launchfox.co/assets/app_template_placeholder.png",
    },
    downloadButtons: [{
        "id": "1",
        "name": "Download now",
        "mac": "",
        "windows": "",
        "linux": ""
    }],
    componentVisibility: {
        "componentProductLogo": true,
        "componentProductCompany": true,
        "componentProductTitle": true,
        "componentProductDescription": true,
        "componentProductMission": true,
        "componentProductDownload": true,
        "componentProductScreenshots": true,
        "componentProductFeatures": true,
        "componentProductTestimonials": true,
        "componentProductSubscription": false,
        "componentProductSocial": true
    },
    menuVisibility: false,
    pagesVisibility: {
        "landing": false,
        "changelog": false,
        "featurelist": false,
        "pricing": false,
        "terms": false
    }
}


module.exports = website;