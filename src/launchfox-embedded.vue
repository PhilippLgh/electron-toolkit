<template>
    <div class="webview-wrapper" :class="{'align-center': failed}">

        <div v-if="loading" class="website-loader"> 
            <i class="fa fa-circle-o-notch fa-spin"></i>   
        </div>
        <!--  DO NOT ADD nodeintegration or disablewebsecurity or allowpopups attributes here -->
        <webview v-if="!failed" ref="webview" :src=" is.dev ? url : ('https://' + url) " :preload="preloadScript" ></webview>
        <server-error v-if="failed"> </server-error>

    </div>
</template>

<script>

import store from './store.js';
import storage from "./storage.js";
import serverError from './widgets/server-error.vue';

export default {

    data: function(){
        return {
            packageJSON: {},
            preloadScript: undefined,
            failed:false,
            loading:false,
            is: window.is
        }
    },

    props:{
        url: {
            required: true
        },
        name:{
            required: true
        }
    },

    components: {
        'server-error': serverError
    },

    methods: {
        //called when webview dom ready
        initWebview: function(){
            var webview = this.$refs.webview;

            //clear webview cache
            webview.getWebContents().session.clearCache(function(){});

            /*
            webview.addEventListener('ipc-message', (event) => {
                console.log("received message", event.channel)
            })
            */

            this.packageJSON.name = store.product.name;

            if(store.screenshots.length > 0){
                this.packageJSON.website_screenshot1 = store.screenshots[0].data;
            }
            if(store.screenshots.length > 1){
                this.packageJSON.website_screenshot2 = store.screenshots[1].data;
            }
            if(store.screenshots.length > 2){
                this.packageJSON.website_screenshot3 = store.screenshots[2].data;
            }

            this.setPageData();

            //webview.openDevTools();
        },

        savePageData: function(){
            if(!this.$refs.webview){
                return;
            }
            this.$refs.webview.getWebContents().executeJavaScript("window.electronHookGet()")
            .then(data =>{
                if(data){
                    this.saveWebsiteDataToLocalStorage(data);
                }
            })
        },
        getPageData: function(){

            if(!this.$refs.webview){
                return Promise.reject(new Error("webview not connected"));
            }

            return this.$refs.webview.getWebContents().executeJavaScript("window.electronHookGet()")
            .then(data =>{
                if(!data){
                    throw new Error("website data is null");
                }
                this.saveWebsiteDataToLocalStorage(data);
                return data;
            })

       },

        saveWebsiteDataToLocalStorage(data){
            store.website = data;
            store.websiteTemp = data;
            store.websiteInit = true;
            storage.setProperty("website", data);
        },

        setImage:function(image, newImage){
            image.url = newImage.data || image.url;
            image.path = newImage.path || image.path
            image.title = newImage.filename || image.url;
        },

        setPageData: function(){

            //preset website values here
            if(!store.websiteInit){
                
                //check if values were not changed by user already --> if not set to project.json values
                store.websiteTemp.name = (store.websiteTemp.name == store.website.name && store.product.name && store.product.name.length > 0 ) ? store.product.name : store.websiteTemp.name;
                store.website.meta.author = (store.websiteTemp.meta.author == store.website.meta.author && store.product.author && store.product.author.length > 0 ) ? store.product.author: store.websiteTemp.meta.author;

                //replace all feature screenshots that still have placeholder values
                if(store.screenshots.length>0){
                    if(store.websiteTemp.screenshot.url.includes(store.screenPlaceholder)){ 
                        this.setImage(store.websiteTemp.screenshot,this.randomScreenshot());  
                    }
                    store.websiteTemp.features.forEach(feature => {
                        if(feature.asset.url.includes(store.screenPlaceholder)){
                            this.setImage(feature.asset,this.randomScreenshot());  
                        }
                    });
                }
                if(store.logos && store.logos.length>0){
                    if(store.websiteTemp.logo.url.includes(store.iconPlaceholder)){ 
                        var logo = store.logos.find(element =>{
                            return element.filename.endsWith("256x256.png");
                        }); // 130
                        if(logo){
                            this.setImage(store.websiteTemp.logo,logo);  
                        }
                    }
                }  
            }

            var data = {
                "website": store.websiteTemp,
                "screens": store.screenshots.filter(s => s.type == "image"),
                "logos":store.logos
            }

            this.$refs.webview.executeJavaScript("window.electronHookSet("+ JSON.stringify(data) +")")
        },

        randomScreenshot : function(){
            //for now just images
            var temp = store.screenshots.filter(s => s.type == "image");
            var screen = null;
            if(temp.length > 0){
                screen = temp[Math.floor(Math.random()*temp.length)];
            }
            return  screen;
        }
    },
    mounted: function(){
        
        this.loading = true;
        this.failed = false;

        this.$refs.webview.addEventListener('did-fail-load',(ev) => {
            this.failed = true;
            this.loading = false;   
        })

       this.$refs.webview.addEventListener('dom-ready', (ev) => {
            this.loading = false;
            if(!this.failed){
                this.initWebview();
            }    
        })

        this.$refs.webview.addEventListener('crashed', (ev) => {
            this.loading = false; 
            this.failed = true;
      
        })

        this.$refs.webview.addEventListener('close', (ev) => {
            this.loading = false; 
            this.failed = true;
      
        })
    }
}
</script>

<style scoped>

.webview-wrapper{
    display: flex;
    height: calc(100vh - 100px);
    width:100vw;
}

.align-center{
    align-items: center;
}

.website-loader{
    color: #a6a6a6;
    background: white;
    font-size: 5rem;
    position: absolute;
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
}

webview{
    flex:1;
  /*
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-flex !important;*/
}


</style>
