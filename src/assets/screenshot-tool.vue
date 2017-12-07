<template>
<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item active"><router-link to="/assets">Assets</router-link></li>
        <li class="breadcrumb-item active">Screenshot Tool</li>
    </ol>
    <div class="auto-scroll">
        <div class="container screencapture-container"  >
            
            <h2 class="title">Screen Capture Tool</h2>
            <small class="form-text text-muted">Record videos and take screenshots of your app. </small> 

            <div id="live-screen" class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 live-preview-col">
                    <div class="live-preview" :class="{'screen':livepreview}">
                        <div v-if="captureProcessing || captureDone" class="screen-overlay"> 
                            <i :class="[{'fa fa-circle-o-notch  faa-spin animated' : captureProcessing}, {'fa fa-check ' : captureDone}]" aria-hidden="true"></i>
                        </div>
                        <div v-if="recording" class="timer-wrapper"> 
                            <i class="fa fa-circle faa-flash animated" ></i> 
                            <div class="recording-time">
                                <span> {{  recordingTimeFormatted }}</span>
                            </div>
                        </div>
                        <div  v-if="!livepreview" class="video-placeholder">
                            <loading-button class="accent-button b-blue b-big btn-lg" @click="activateApp">Start App Preview</loading-button>
                        </div>
                        <video v-if="livepreview && streamSrc" id="livestream" :src="streamSrc"></video>
                    </div>
                </div>
            </div>

             <!--button @click="launchApp">Launch</button-->
             <div class="screencapture-controls row">
                <div class="col-12 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-right">
                     <loading-button :disabled="!livepreview ||  captureProcessing"  class="accent-button b-blue btn-lg" @click="onSaveScreenshot"> <i class="fa fa-camera" aria-hidden="true"></i>Take Screenshot </loading-button>
                </div>
                <div class="col-12 col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-left">
                    <loading-button v-if="!recording"  :disabled="!livepreview ||  captureProcessing" class="accent-button b-blue btn-lg" @click="onStartRecording"> <i class="fa fa-video-camera" aria-hidden="true"></i> Start Recording</loading-button>
                    <loading-button v-if="recording"  :disabled="!livepreview || captureProcessing" class="accent-button b-blue-filled btn-lg" @click="onStopRecording"> <i class="fa fa-video-camera" aria-hidden="true"></i> Stop Recording</loading-button>
                </div>
            </div>

            <div class="gallery screenshot-gallery">
              <h3>Gallery</h3> 
                <div id="screens" class=" screens row">
                    <div class="empty-screens" v-if="!screenshots || screenshots.length == 0" >nothing captured yet</div>
                    <screenshot-container  v-on:opengallery="openGallery" v-if="screenshots.length>0" v-for="screenshot in screenshots" :key="screenshot.id" v-bind:screenshot="screenshot" >
                    </screenshot-container> 
                </div>
            </div>

            <div v-if="activeGalleryImage != null" class="lightbox-target asset-gallery">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12"> 
                        <h5 class="lightbox-item-title" @click="openInFolder(activeGalleryImage.path)">{{ activeGalleryImage.filename}}  </h5>
                    </div>
                </div>
                <div class="row" style="max-height:80vh">
                    <div class="col-xs-1 col-sm-1 col-lg-1 col-xl-1 lightbox-control-wrapper"> 
                            <a class="lightbox-prev" @click="prevAsset"> <i class="fa fa-angle-left" aria-hidden="true"></i></a>
                        </div>
                        <div class="col-xs-10 col-sm-10 col-lg-10 col-xl-10"> 
                        <img  v-if="activeGalleryImage.type=='image'" :src="activeGalleryImage.data" />
                        <video  v-if="activeGalleryImage.type=='video'" :src="activeGalleryImage.data" autoplay loop></video>
                    </div>
                    <div class="col-xs-1 col-sm-1 col-lg-1 col-xl-1 lightbox-control-wrapper">
                        <a class="lightbox-next" @click="nextAsset"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
                    </div>
                </div>
                <a  class="lightbox-delete" @click="deleteAsset()"><i class="fa fa-trash" aria-hidden="true"></i></a>
                <a  class="lightbox-close" @click="closeGallery"><i class="fa fa-times" aria-hidden="true"></i> </a>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import store from '../store.js';
import ScreenshotContainer from './screenshot-container.vue';
import LoadingButton from '../widgets/loading-button.vue';

const Toolkit = window.Toolkit;
const AppCapturer = Toolkit.AppCapturer;

export default {
    components: {
        'screenshot-container': ScreenshotContainer,
        'loading-button': LoadingButton
    },
    data: function() {
        return {
            screenshots: [],
            streamSrc: "",
            livepreview: false,
            recordingTime: 0,
            recordingTimer: null,
            recording: false,
            captureProcessing: false,
            captureDone: false,
            recorderSate: null,
            userApp: null,
            stream: null,
            activeGalleryImage:null,
            wId:null,
            userApp: null, 
            mounted:false
        }
    },
    computed: {
        recordingTimeFormatted: function() {
            return this.toTime(this.recordingTime);
        },
    },
    methods: {
        openInFolder:function(path){
            Toolkit.openInExplorer(path);
        },
        deleteAsset:function(){
          //  store.screenshots = store.screenshots.filter(s => s !== path);
            console.log(this.activeGalleryImage.path);
            Toolkit.deleteAsset(this.activeGalleryImage.path);
            var id = this.activeGalleryImage.id;
            this.nextAsset();
            this.deleteFromScreenShots(id);
        },
        deleteFromScreenShots:function(id){
            this.screenshots = this.screenshots.filter(s => s.id != id);
            if(this.activeGalleryImage.id == id){
                this.activeGalleryImage = null;
            }
        },
        nextAsset:function(){
            if(this.activeGalleryImage == null || !this.screenshots || this.screenshots.length == 0){
                this.activeGalleryImage = null;
                return;
            }
            var maxindex = this.screenshots.length-1;
            for(var i = 0; i<this.screenshots.length;i++){
                var s = this.screenshots[i];
                if(s.id == this.activeGalleryImage.id && i<maxindex){
                    this.activeGalleryImage = this.screenshots[i+1];
                    return;
                }else if(s.id == this.activeGalleryImage.id && i==maxindex){
                    this.activeGalleryImage = this.screenshots[0];
                   return;
                }
            }
            this.activeGalleryImage = null;
        },
        prevAsset: function(id){
            if(this.activeGalleryImage == null || !this.screenshots || this.screenshots.length == 0){
                this.activeGalleryImage = null;
                return;
            }
            var maxindex = this.screenshots.length-1;
            for(var i = 0; i<this.screenshots.length;i++){
                var s = this.screenshots[i];
                if(s.id == this.activeGalleryImage.id && i>0){
                    this.activeGalleryImage = this.screenshots[i-1];
                    return;
                }else if(s.id == this.activeGalleryImage.id && i == 0){
                    this.activeGalleryImage = this.screenshots[maxindex];
                    return;
                }
            }
            this.activeGalleryImage = null;
        },
        openGallery:function(asset){
            this.activeGalleryImage = asset;
        },
        closeGallery:function(){
            this.activeGalleryImage = null;
        },
        onLivePreviewClicked: function(){
           
        },
        onSaveScreenshot: function() {
            this.captureProcessing = true;
            var videoElement = $("#livestream")[0];
            this.$nextTick(()=> {
                AppCapturer.takeScreenshotFromVideo(videoElement)
                    .then(asset => {
                        //store.screenshots.push(asset.path);
                        this.captureProcessing = false;
                        // var sc = this.newAsset("image");
                        if(asset){
                            this.screenshots.unshift(asset)
                            this.captureDone = true;
                            // this.captureProcessing = true;
                            setTimeout(() => { this.captureDone = false }, 1000);
                        }
                    })
            })
        },

        onStartRecording: function() {

            this.recordingTime = 0;
            this.recording = true;

            var seconds = new Date().getTime();
            var last = seconds;

            this.recordingTimer = setInterval(() => {
                var now = new Date().getTime();
                last = now;
                this.recordingTime = now - seconds;
            }, 333);

            var state = AppCapturer.startRecording();
           
            this.initRecorderState(state);

        },


        initRecorderState: function(state) {
            this.recorderSate = state;
            this.recorderSate.on('new-video', (asset) => {
              
                this.captureProcessing = false;
                if (asset) {
                    this.screenshots.unshift(asset);
                    this.captureDone = true;
                    // this.captureProcessing = true;
                    setTimeout(() => { this.captureDone = false }, 1000);
                }
            })
        },

        onStopRecording: function() {
            this.recording = false;
            if (!this.recordingTimer) {
                return;
            }
            clearInterval(this.recordingTimer);
            AppCapturer.stopRecording();
        },

        activateApp: function() {
             if(this.userApp && this.userApp.isMinimized){
                this.userApp.maximize();
            }else{
                 AppCapturer.launchApp().then( this.setupAppListeners );
            }
        },

        setupAppListeners: function(userApp){

            this.userApp = userApp;

            userApp.on('ready', windowId => {
                if(this.wId != windowId){
                    this.wId = windowId;   
                  //  console.log("user app is ready")
                    this.initScreenCapture(windowId);
                }
            })

            //window cannot be detected => we cannot record
            //alternative: let user pick a window from preview
            userApp.on('window-detection-failed', err => {
               // console.log("detection failed")
            })

            //https://github.com/electron/electron/blob/master/docs/api/browser-window.md#instance-events
            //eventTypes : ["closed", "blur", "focus", "show", "hide", "maximize", "unmaximize", "minimize", "resize"]

             userApp.on('closed', () => {
                this.streamClosed();
                this.userApp = null;
             });

            userApp.on('exit', () => {
                this.streamClosed();
                this.userApp = null;
             });

            userApp.on('minimize', () => {
                console.log("user app minimize")
                userApp.isMinimized = true;
                this.streamClosed();
            });

            userApp.on('restore', () => {
                userApp.isMinimized = false;
                if(this.wId && !this.streamSrc){
                    this.initScreenCapture(this.wId);
                }
                console.log("user app restore")
            })

            userApp.on('show', () => {
                if(this.wId && !this.streamSrc){
                    this.initScreenCapture(this.wId);
                }
                console.log("user app show")
            })

            userApp.on('maximize', () => {
                if(this.wId && !this.streamSrc){
                    this.initScreenCapture(this.wId);
                }
                console.log("user app maximize")
            })

            //if hidden
            //not launched 
            //secondary display

        },

        streamClosed: function() {
            this.onStopRecording();
            AppCapturer.closeStream();
            this.livepreview = false;
            this.streamSrc = "";
            this.stream = null;
        },

        initScreenCapture: function(windowId) {
            AppCapturer.initScreenCapture(windowId)
                .then((src) => {
                    this.streamSrc = src;
                    this.livepreview = true;
                })
        },

        toTime: function(duration) {
            var milliseconds = parseInt((duration % 1000) / 100),
                seconds = parseInt((duration / 1000) % 60),
                minutes = parseInt((duration / (1000 * 60)) % 60),
                hours = parseInt((duration / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return hours + ":" + minutes + ":" + seconds;
        }

    },

    mounted: function() {

   //    console.log("mounted mounted");

   
     
        var self = this;
        $( "body").keyup(function(e) {
            switch(e.keyCode){
                case 27:
                    self.activeGalleryImage = null;
                    break;
                case 39:
                    self.nextAsset();
                    break;
                case 37:
                    self.prevAsset();
                    break;
            }
        });

          setTimeout(() => {  this.screenshots = store.screenshots; }, 1);
    },

    destroyed: function(){
        this.onStopRecording();
        AppCapturer.closeStream();
    }
}

</script>

<style scoped>



.screenshot-gallery h3{
    text-align: left;
    margin-bottom: 2%;
}

.screenshot-gallery{
    margin-top: 8%;
    margin-bottom:5%;
    max-width: 100%;
}

.screens{
    background: #fafafa;
    padding:1%;
    min-height: 15vw;
}

.empty-screens{
    width: 100%;
    color: #868e96;
    font-weight: 100;
    line-height: 15vw;
}

.screencapture-controls{
    margin-top:3%;
    position: relative;
}

.screencapture-container{
    text-align:center;
}

.screencapture-container .timer-wrapper{
    width: 100%;
    bottom: 0;
    right: 0;
    left: 0;
    font-size: 80%;
    position: absolute;
    display: inline;
    padding: 0;
    min-width: 10rem;
    position: absolute;
    padding-bottom: 0.3rem;
}

.screencapture-container .recording-time{
    min-width: 9rem;
    display:inline
}

.fa-circle{
    color: #00ffa5;
    font-size: x-small;
    padding: 0.1rem;
}

.screencapture-container h2{
    margin-top:3%       
}

.screencapture-container small{
    margin-top:2%;
}

.screencapture-container .video-placeholder{
    display: grid;
    width:100%;
    height:100%;
    border-radius:3px;
}

.screencapture-container .video-placeholder button:hover{
    cursor:pointer;
}

.screencapture-container button{
    display:table-cell;
    vertical-align: middle;
    font-size:1rem;
}

.screencapture-container .title{
    text-align: center
}

.live-preview{
    margin-top: 2%;
    height: 35vw;
    max-width: 80%;
    margin-right: auto;
    margin-left: auto;
   /* border: 2px solid #ddd;
   */
    position:relative;
    border-radius: 3px;
    text-align: center;
}

.screen{
    padding: 1.8rem;
    border: 2px solid #fafafa;
    background: #fafafa;
    display: flex;
    align-items: center;
}

.screen-overlay{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    opacity: 0.5;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
    display: table;
    transition: all .3s linear;
}

.screen-overlay i{
    font-size: 350%;
    display: table-cell;
    vertical-align: middle;
    transition: all .3s linear;
}

.screen-overlay i.fa-check{
     color:green
}

.screen-overlay i.fa-circle-o-notch{
    color: #52a5ff;
}

.auto-scroll{
    height: calc(100vh - 4rem);
    overflow:auto;
}

video{
    max-height: 100%;
    max-width: 100%;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-right:auto;
    margin-left:auto;
}

.screencapture-controls button:disabled{
    cursor: not-allowed;
}

.col-left{
    text-align: left;
    padding-left: 0.5rem;

}

.col-right{
    text-align: right;
    padding-right: 0.5rem;
}


@media  (max-width:576px){
    .col-left, .col-right{
        padding:0;
        text-align: center;
    }

    .col-left{
        padding-top: 2%;
    }

    .accent-button{
        padding: 0.3rem 1rem;
    }  
}


@media  (max-width:768px){

    .live-preview{
        max-width: 90%;
        height:50vw;
    }

    .live-preview-col{
        padding:0;
    }
}

    


</style>
