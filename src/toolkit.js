import Vue from 'vue'
import VueRouter from 'vue-router'

import "bootstrap/dist/css/bootstrap.min.css";

import Toast from "./widgets/fx-toast.vue";

import Overview from './Overview.vue'

//Asset Views
import AssetOverview from './assets/asset-overview.vue';
import IconGenerator from './assets/icon-generator.vue';
import ScreenshotTool from './assets/screenshot-tool.vue';

//Installer Views
import InstallerView from './installer-view.vue';

//Publish Views
import PublishOverview from './publish/publish-overview.vue';
import PublishLaunchfoxView from "./publish/publish-form-launchfox.vue";
import PublishGithubView from "./publish/publish-form-github.vue";
import PublishS3View from "./publish/publish-form-s3.vue";

//Website Views
import WebsiteBuilderView from './website-builder-view.vue';

import MoreToolsView from './more-tools.vue';

const Toolkit = window.Toolkit;

const LAUNCHFOX_HOST = Toolkit.Config.LAUNCHFOX_HOST;

const routes = [

    { path: '/', component: Overview },

    { path: '/assets', component: AssetOverview },
    { path: '/assets/appicon', component: IconGenerator },
    { path: '/assets/screenshot', component: ScreenshotTool },

    { path: '/installer', component: InstallerView },

    { path: '/publish', component: PublishOverview },
    {
        path: "/publish/detail/Launchfox",
        component: PublishLaunchfoxView,
        props: {
            host: LAUNCHFOX_HOST
        }
    },
    { path: "/publish/detail/GitHub", component: PublishGithubView },
    { path: "/publish/detail/AWS_S3", component: PublishS3View },

    { path: '/website', component: WebsiteBuilderView, props: { host: LAUNCHFOX_HOST } },

    { path: '/more', component: MoreToolsView },

]

Vue.use(VueRouter)

const router = new VueRouter({
    routes // short for `routes: routes`
})

import store from "./store.js";
import website from './mocks/website.js'
import storage from "./storage.js";


const app = new Vue({
    components: {
        "fx-toast": Toast
    },
    router,
    data: {
        product: store.product
    },
    methods: {
        defaultWebsite: function() {
            return website;
        },
        showToast: function(message) {
            this.$refs.toast.show(message)
        }
    },
    mounted: function() {

        var logo = {};
        var screens = [];

        store.id = Toolkit.getProjectID();

        var data = storage.getProperty("website");

        if (!data) {
            store.website = this.defaultWebsite();
        } else {
            store.website = data;
            store.websiteInit = true;
        }
        store.websiteTemp = store.website;

        Toolkit.readPackageJson()
            .then(data => {
                this.product.name = data.name;
                this.product.version = data.version;
                this.product.author = data.author;
                this.product.repository = data.repository;
                this.product.build = data.build;
            })

        Toolkit.loadAssets()
            .then(assets => {
                assets.forEach(sc => {
                    store.screenshots.push(
                        sc
                    );
                });
                store.screens_initialized = true;
            })
            .catch(err => {
                console.log("error loading assets: ", err)
            })

        Toolkit.loadLogos()
            .then(logos => {
                store.logos = logos;
            });

    }
}).$mount('#app')

window.vueApp = app;