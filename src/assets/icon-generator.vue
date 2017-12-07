<template>
<div @dragover.prevent @drop.prevent>
    
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item active"><router-link to="/assets">Assets</router-link></li></li>
        <li class="breadcrumb-item active">Icon Generator</li>
    </ol>

    <div class="auto-scroll">
        <div class="center">
        <!--small class="center"> Creates application icons for every OS and saves them to your distribution dir. ICO for Win, ICNS for Mac and a PNG bundle for Linux.</small--> 

            <div class="form-group">
                
                <div class="icon-generator">
                    <h2>Icon Generator</h2>
                    <small class="form-text text-muted">Please select a SVG or PNG file. </small> 
                    <div class="wrapper">
                        <div  class="icon-dropzone":class="{'dragging':dragging}" > 
                            <div class="results">
                                <div class="result-wrapper row" v-if="pngUrl"> <h6>   <span @click="openInExplorer(pngUrl)" > .png </span> <i class="fa fa-check" aria-hidden="true"></i> </h6> </div>
                                <div  class="result-wrapper row" v-if="icoUrl">  <h6> <span  @click="openInExplorer(icoUrl)" > .ico </span> <i class="fa fa-check" aria-hidden="true"></i> </h6>  </div>
                                <div  class="result-wrapper row"  v-if="icnsUrl"> <h6>  <span  @click="openInExplorer(icnsUrl)" >.icns </span> <i class="fa fa-check" aria-hidden="true"></i> </h6> </div>
                            </div>

                            <label :class="{'loading-overlay':generating}" class="file-label"  @dragover="onDrag" @drop="onDrop" @dragenter="onDragEnter" @dragleave="onDragLeave">  
                                <i :class="{'invisible': !generating}" class="fa fa-circle-o-notch fa-spin"></i>   
                                <input  accept="image/*"  type="file" @change="onFileChange"  style="display:none">
                            </label>
                            <h4 v-if="!image && !warning"> Drop image here or click to browse </h4>
                            <h6 v-if="!image && warning" class="warning"> {{ warning }} </h6>
                            <img v-if="image" id="app-image-thumb" :src="image" :class="{'svg-img' : isSVG}" class="img-thumbnail">
                        </div>
                    </div>
                </div>

                <div class="icon-generator-controls">
                  
                    <button  :disabled="!imagePath || generating" class="accent-button b-blue b-big btn-lg" @click="generateIcons">Generate</button>
                    <h6 v-if="!image" class="color-white" >placeholder</h6>
                    <h6 v-if="image" > {{ imagePath }}</h6>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import LoadingButton from '../widgets/loading-button.vue';
import store from '../store.js';

const Toolkit = window.Toolkit;
const IconGenerator = Toolkit.IconGenerator;

export default {
    components:{
        'loading-button': LoadingButton
    },
    data:function(){
         return {
            image:null,
            imagePath:"",
            dragging:false,
            warning:null,
            icoUrl:"",
            icnsUrl:"",
            pngUrl:"",
            generating:false
        }
    },
    computed:{
        isSVG:function(){
            if(!this.imagePath){ return false; }
            if(this.imagePath.toLowerCase().endsWith("svg")){
                return true;
            }
            return false;
        }
    },
    methods: {
        resetValues(){
            this.warning = null;
            this.image = null;
            this.icoUrl = "";
            this.icnsUrl = "";
            this.pngUrl = "";
        },
        onFileChange(e){
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length){
                return;
            }
        
            this.resetValues();
            if (!this.isValidType(files[0].path)){
                 this.warning = "Icon should be PNG or SVG";
            }else{
                this.selectFile(files[0]);
            }
        },
        isValidType:function(p){
            console.log("is valid? ", p)
            var ext = IconGenerator.getExtension(p);
            return [".svg", ".png"].includes(ext);
        },
        selectFile(file){
            this.imagePath = file.path;
            var url = Toolkit.base64_abs(file.path);
            this.image=url;
        },
        canBeDropped : function(file){
 
            //FIXME more robust way to determine file type
           var types = ['png', 'PNG', 'svg', 'SVG', 'svg+xml'];

            var type = file.type;
            if(!type.startsWith("image")){
                return false;
            }
 
            for (var i = 0; i < types.length; i++) {
                if (type.endsWith(types[i])) {   
                    return true;
                }
            }

            return false;
        },

        onDrag:function(e){
            this.dragging = true;
            e.dataTransfer.dropEffect = "copy";
        },

        onDragEnter:function(){
            this.dragging = true;
        },

        onDragLeave:function(){
            this.dragging = false;
        },

        onDrop:function(e){
        
            this.resetValues();
            this.dragging = false;

            e.stopPropagation();
            e.preventDefault();
           
            if(e.dataTransfer.files.length != 1){
                this.warning = "Please drop exactly one PNG or SVG file";
                return;
            }

            var file = e.dataTransfer.files[0];
            if(this.canBeDropped(file)){
                this.selectFile(file);
            }else{
                console.log("blub", file)
                this.warning = "Image should be PNG or SVG";
            }
           
           /* if (this._canBeDropped(file)) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
                console.log("");
            }*/
        },

        generateIcons:function(){

            var self = this;
             if(!this.image){
                return;
            }

            this.icoUrl = "";
            this.icnsUrl = "";
            this.pngUrl = "";

            this.generating = true;

            var base = this.imagePath;

           IconGenerator.generatePng(this.imagePath)
                .then(IconGenerator.generatePngBundle.bind(IconGenerator))
                .then(result => {
                    self.pngUrl = result.out;
                    return IconGenerator.generateIcns(result.in)
                })
                .then(result => {
                    self.icnsUrl = result.out;
                    return IconGenerator.generateIco(result.in)
                })
                .then(function(result){
                    self.icoUrl = result.out
                    self.generating = false;
                    return Toolkit.loadLogos()
                })
                .then(logos => {
                    store.logos = logos;
                })
                .catch(e =>{
                     self.generating = false;
                })

        },

        openInExplorer:function(p){
            if(!p){
                return;
            }
            Toolkit.openInExplorer(p);
        }

    }    
}
</script>

<style scoped>



.auto-scroll{
    height: calc(100vh - 4rem);
    overflow:auto;
}

.container{
    overflow:auto;
}

.center{
    margin-right:auto;
    margin-left:auto;
    text-align:center
}

.icon-generator, .icon-generator-controls{
    color:#333;
    text-align:center;
    padding: 0 5%;
}


.icon-generator h2{
    margin-top:3%;
}

.icon-generator small{
    margin-top:2%;
    position:relative
}

.icon-generator .icon-dropzone{
    position:relative;
    width: 50vw;
    height: 50vw;
    max-width:512px;
    max-height: 512px;
    border: 3px dotted #ddd;
    border-radius: 3px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
    transition: all .1s linear;
}

.icon-generator .icon-dropzone.dragging{
    border-color:#5cbfde;
}

.icon-generator .icon-dropzone .warning{
    color: #c65488;
    display: table-cell;
    vertical-align: middle;
    font-weight: 300;
}

.icon-generator .icon-dropzone .file-label{
    position: absolute;
    height: 100%;
    width: 100%;
    color: white;
    cursor:pointer;
}

.icon-dropzone:hover{
    background:#fbfafa;
}



.icon-generator img{
   
    padding: 7%;
    border:none;
    max-height: 100%;
 
}

.icon-generator .icon-dropzone h4{
    color:  #ddd;
    display: table-cell;
    vertical-align: middle;
    font-weight: 300;
}

.icon-generator-controls{
    color:#333;
    position:relative;
    margin-top:2%;
    margin-right:auto;
    margin-left:auto;
    text-align: center;
}

.icon-generator-controls h6{
    margin-top:2%;
}

.icon-generator-controls button{
    /*margin-top:2%;*/
}

.pos-absolute{
    position:absolute;
}

.color-white{
    color:transparent;
}

.wrapper{
    position: relative;
}

.results{
    position:absolute;
    width: 100%;
    height: 100%;
}

.result-wrapper{
    display: inline-block;
    width: 100%;
    margin-left:5rem;
    color:#333;
}

.results h6{
    max-width: 5rem;
    float: right;
    cursor:pointer;
}

.results h6 span{
    transition: all .2s linear;
}

.results h6 i{
    color: #3ebb82
}

.results h6 span:hover{
    color: #3098b6;
}

.loading-overlay{
    background:rgba(238, 238, 238, 0.5);
    color:#333;
    cursor:not-allowed;
    pointer-events: none;
}

.invisible{
    visibility: hidden;
}

.file-label{
    display:table
}

.file-label i{
    display: table-cell;
    vertical-align: middle;
    font-size: 450%;
    color:white;
}

.svg-img{
   width:100% 
}

@media (max-width:320px){
    .icon-generator .icon-dropzone h4{
        visibility: hidden;
    }
}
@media  (max-width:576px){
    .accent-button{
        padding: 0.3rem 1rem;
    }

}
@media  (max-width:768px){
    .icon-generator .icon-dropzone h4{
        font-size:1rem !important;
    }

}


</style>
