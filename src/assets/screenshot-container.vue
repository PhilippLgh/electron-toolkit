<template>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 filter hdpe sc-container ">
        <div class=" thumbnail" :class="{'video-wrapper': screenshot.type == 'video'}" @click="openGallery(screenshot.id)">
                <div class="video-overlay" v-if="screenshot.type == 'video'">
                        <i class="fa fa-play" aria-hidden="true"></i>
                </div>
        
           
                  
                    <img v-if="screenshot.type == 'image'" ref="img"   class="img-fluid lightbox" >
                    <video v-if="screenshot.type == 'video'" ref="vid"  alt="Video" type="video/webm" autoplay class="lightbox"></video>
         


                
                    <!--div class="caption">
                        {{screenshot.filename}}                
                    </div-->
                    <!--div>
                        <button @click="onSaveScreenshot" v-if="screenshot.filename == ''">save</button>
                    </div-->

        
        </div>
        
    </div>

</template>

<script>

export default {
    props: ['screenshot'],
    data: function(){
        return {

        }
    },
    mounted:function(){
         if(this.$refs.vid){
            setTimeout(() => this.$refs.vid.src = this.screenshot.data, 1);
         }

         if(this.$refs.img){
             setTimeout(() => this.$refs.img.src = this.screenshot.data, 1);
         }
    },
    methods: {
        onSaveScreenshot: function(){
        },
        openGallery: function(id) {
            this.$emit('opengallery', this.screenshot);
        }

       
    }
}
</script>

<style>

.video-wrapper{
    position:relative;
}

.video-overlay{
    position: absolute;
    margin-top: -75%;
    z-index: 2;
    background: #333;
    opacity: 0.5;
    border-radius: 2px;
    color: white;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

}

.video-overlay i{
    margin-left: auto;
    margin-right: auto;
    font-size:150%;
    cursor:pointer;
    transition: all .2s linear;
}

.thumbnail:hover{
    cursor: pointer;
}

.thumbnail:hover .video-overlay i{
     font-size:250% !important;
     
}



.thumbnail{
    /*
    width:100%;
    height:100%;  
    padding: 0.2rem;
    min-height:10vw;
    box-shadow: 0px 1px 2px 0px hsla(0,0%,80%,1);

    position: relative;
    background:white;*/
    width: 100%;
    padding-top: 75%;

    box-shadow: 0px 1px 2px 0px hsla(0,0%,80%,1);
    position: relative;
    background: white;
}

.caption{
     bottom: 1.2rem;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
    position: absolute;
    margin-left: -0.5rem;
    width:100%;
     padding: 0 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height:1.5rem;
}

.sc-container{

  
    padding:0;

      padding: 0.7rem;
    margin-top: 0.1rem;
}

.sc-container img{
   /*
    max-width:100%;
    border-radius: 3px;*/
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 2px;
    margin-right: auto;
    margin-left: auto;
    padding:1%

    
}

.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 90px;
    height: 90px;
    margin: auto;
    animation: spin 2s linear infinite;
}

.sc-container video{
    max-width: 100%;   
    border-radius:2px;

    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin-right: auto;
    margin-left: auto;
    padding:1%;
        
   
}

/*
.col-lg-3 video, .col-md-3 video, .col-sm-3 video{
  max-height:15vw;

}


.col-xs-6 img, .col-xs-12 img, .col-xs-6 video, .col-xs-12 video {
  max-height:50vw;
}*/

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>
