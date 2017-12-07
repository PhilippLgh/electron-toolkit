<template>
<div class="flex-container">
    <div>
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
            <li class="breadcrumb-item active">Website Builder</li>
            <li class="nav-note"> Powered By <a href="">Launchfox</a></li>
        </ol>
    </div>

    <launchfox-embedded ref="webview" :name="name" :url="host + '/app.html#/try-website'"></launchfox-embedded>

    <sticky-footer>
        <div class="button-wrapper">
            <loading-button class="btn btn-secondary" fa="fa-floppy-o" @click="onSave" loading-caption="Saving..">Save</loading-button>
            <loading-button class="btn btn-secondary" fa="fa-download" @click="onExport" loading-caption="Exporting..">Export</loading-button>
        </div>
    </sticky-footer>
</div>

</template>

<script>
import store from './store.js';
import app from './app.js';
import websiteMockData from './mocks/website.js'

import LoadingButton from './widgets/loading-button.vue'
import Footer from './widgets/sticky-footer.vue'
import LaunchfoxView from './launchfox-embedded.vue'

export default {
    props:{
        host: {}
    },
    components: {
        'loading-button': LoadingButton,
        'sticky-footer': Footer,
        'launchfox-embedded': LaunchfoxView
    },
    data: function(){
        return {
            name:"Website",
            autoSaver:{},
            packageJSON: store.packageJSON,
            footerSettings: {}
        }
    },
    mounted: function(){
       this.autoSaver = setInterval(() => this.autoSave(), 20000);
    },
    destroyed: function(){
       // console.log("destroying website builder");
        if(this.autoSaver){
            clearInterval(this.autoSaver);
        }
    },
    methods:{
        getPageData: function(){
            //return Promise.resolve(websiteMockData)
            //return Promise.resolve(store.websiteTemp)
            return this.$refs.webview.getPageData();
        },
        autoSave: function(){
            this.$refs.webview.savePageData();
        },
        generatePage: function(pageData){

            var request = new Request('https://api.launchfox.co/v1/website/', {
                method: 'POST', 
                mode: 'cors', 
                redirect: 'follow',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(pageData)
            });
                
            return fetch(request)
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(response => response.text()) //get base 64 from ReadableStream
        },
        onSave: function(){
            this.$refs.webview.savePageData();
            app.showUserInfo('Saved <i class="fa fa-check" aria-hidden="true"></i>')
        },
        onExport: function(stateHandler){
 
            stateHandler.start()

            var projectName = store.product && store.product.name ? store.product.name : "project";

            let localPaths = [];
            this.getPageData()
                .then(temp => {
                    let data = JSON.parse(JSON.stringify(temp));
                    localPaths = this.removeDataUrls(data);
                    data.localPaths = localPaths;
                    //console.log(localPaths);
                    return data;
                })
                .then(this.generatePage) 
                .then(bs64String => {
                    var fileName = projectName + "_website.zip"
                    return Toolkit.saveZipAs(bs64String, fileName)
                })   
                .then(filepath => {
                    stateHandler.done()
                    console.log("file successfully saved as ", filepath)
                    app.showUserInfo(`Website saved at <a href="#">${filepath}</a>`, ()=>{
                        app.openExplorer(filepath)                        
                    })
                })        
                .catch(err => {
                    stateHandler.error()
                    app.showUserError("Could not export: internal error")
                    console.error("could not export page", err)
                })
        },

        removeDataUrls(data) {
            var p =  this.replaceDataUrlWithPath(data.screenshot);
            /*  this.replaceDataUrlWithPath(data.logo);*/
            var paths = [];
            paths.push(p);
            _.forEach(data.features, (feature) => {
                var path = this.replaceDataUrlWithPath(feature.asset);
                paths.push(path);

           })
            paths.filter(path => path != "");
            //remove duplicates
            var result = Array.from(new Set(paths));
            return result;
        },

        replaceDataUrlWithPath(asset) {
            if (asset.url.startsWith("data:")) {
                asset.url = "./images/"+asset.title;
                var path = asset.path;
                asset.path = "./images/"+asset.title;
                return path;
            }
            return "";
        }

    }
}
</script>

<style scoped>

.breadcrumb{
        border-bottom: 1px solid #d6d9dc;
}

.pull-right{
    display: -webkit-box;
}


.flex-container{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
}

.breadcrumb{
    margin-bottom: 0px !important;
}
.breadcrumb .nav-note{
    position: absolute;
    right: 30px;
}

webview{
   /* flex: 1;*/
    margin-top: auto;
    margin-bottom: 60px;
    border-top: 1px solid #d6d9dc;
}

.status-message{
    margin-right:10px;
    color: #73cec2;
}

.footer .button-wrapper{
    flex:1;
    text-align:right;
}

</style>
