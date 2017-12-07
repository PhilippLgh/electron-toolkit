<template>
<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item"><router-link to="/publish">Publish</router-link></li></li>
        <li class="breadcrumb-item active">AWS S3</li>
    </ol>
    <div class="autoscroll">
        <div class="lf-container publishing-container">
            <form>
                <p>
                    <label for="">To use Amazon S3 please add electron-publisher-s3 dependency to devDependencies (yarn add electron-publisher-s3 --dev).</label>
                    <label>Define AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables. Or in the ~/.aws/credentials.</label>
                </p>
                              
                <div class="form-group">
                    <label>Bucket name</label>
                    <input type="text" class="form-control" placeholder="bucket name" v-model="publish.bucket">
                </div>

                <div class="form-group">
                    <label>Region</label>
                    <input type="text" class="form-control" placeholder="region" v-model="publish.region">
                </div>

                <div class="form-group">
                    <label>Access Control List (ACL)</label>
                    <select class="form-control" v-model="publish.acl">
                        <option value="public-read">public</option>
                        <option value="private">private</option>
                        <option value="null">none</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Storage class</label>
                    <select class="form-control" v-model="publish.storageClass">
                        <option value="STANDARD" >Standard</option>
                        <option value="REDUCED_REDUNDANCY">Reduced redundancy</option>
                        <option value="STANDARD_IA">Standard IA</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Channel</label>
                    <input type="text" class="form-control" placeholder="latest" v-model="publish.channel">
                </div>
            
                <div class="form-group">
                    <label>Endpoint</label>
                    <input type="text" class="form-control" placeholder="https://{service}.{region}.amazonaws.com" v-model="publish.endpoint" readonly>
                </div>
                              
                <div class="form-group">
                    <label>Path</label>
                    <input type="text" class="form-control" placeholder="/" v-model="publish.path">
                </div>
                         
                <div class="form-group">
                    <button class="accent-button b-blue-filled btn-lg publishing-button" @click.prevent="onSave">Save S3 settings</button>
                </div>
            </form>
        </div>
    </div>
</div>

</template>

<script>
import store from "../store.js";

const Toolkit = window.Toolkit;

const PROVIDER_NAME = "s3"

export default {
    data: function(){
        return {
            publish: {
                provider: PROVIDER_NAME,
                bucket: "",
                region: "",
                acl: "public-read",
                channel: "latest",
                storageClass: "STANDARD",
                endpoint: "https://{service}.{region}.amazonaws.com",
                path: "/"
            }
        }
    },
    mounted: function(){

        var packageJson = store.product || {};
        var build = packageJson.build || {};
        var publish = build.publish || {};


        //publish can be of type: String | Object | Array<Object | String>
        var options = {};

        if(!Array.isArray(publish)){
            //if provider is set, is object and contains the property 'provider' the previous config does
            //only configure one publishing target and it is for PROVIDE_NAME
            if(publish.provider === PROVIDER_NAME){
                options = publish;
            }
            //else if(publish.provider === PROVIDER_NAME){ } => ignore - will be overwritten as objects
        }else{
            //test if options array already contains github options: use this instance for modifications
            var existing = publish.find(opt => opt.provider === PROVIDER_NAME || opt === PROVIDER_NAME)
            options = existing || options
            
            if(options === PROVIDER_NAME){ options = {} }
        }
        
        Object.assign(this.publish, options)

    },
    methods: {
        onSave: function(){
            console.log("save s3 settings...", this.publish)

            //patch projectJson             
            Toolkit.readPackageJson()
            .then(data => {

                data.build = data.build || {};

                var options = {};
                Object.assign(options, this.publish)

                options.acl = options.acl == "null" ? null : options.acl;

                if(!data.repository){
                    data.repository = this.publish.repository;
                }

                if(Array.isArray(data.build.publish)){
                    //remove old element
                    data.build.publish = data.build.publish.filter(opt => opt.provider !== PROVIDER_NAME && opt !== PROVIDER_NAME)
                    //add new option element = replace
                    data.build.publish.push(options)
                }else{
                    //overwrite exisitng settings
                    data.build.publish = options;
                }
   
                return JSON.stringify(data, null, 4);
            })
            .then(Toolkit.writePackageJson)

        }
    }

}
</script>

<style scoped>

.autoscroll{
    overflow: auto;
    height: calc(100vh - 8rem);
}
input:focus, textarea:focus, select:focus {
    outline:none;
    border-color: rgb(128, 189, 255);
    box-shadow: rgba(0, 123, 255, 0.25) 0px 0px 0px 0.1rem;
}

.optional-field{
    font-size:0.8rem
}

.form-group{
  margin-bottom: 1.5rem;
}

.publishing-button{
    float: right;
    margin-bottom:5%
}
  
</style>