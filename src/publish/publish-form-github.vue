<template>

<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item"><router-link to="/publish">Publish</router-link></li></li>
        <li class="breadcrumb-item active">GitHub</li>
    </ol>
    <div class="autoscroll">
        <div class="lf-container publishing-container">
            <form>

                <div class="form-group">
                    <label>Access token to support auto-update <span class="optional-field text-muted"> (optional) </span> </label>
                    <input type="text" class="form-control" placeholder="token" v-model="publish.token">
                </div>

                <div class="form-group">
                    <label>Repository</label>
                    <input type="text" class="form-control" placeholder="repository name" v-model="publish.repo">
                </div>
                        
                <div class="form-group">
                    <label>Owner</label>
                    <input type="text" class="form-control" placeholder="owner" v-model="publish.owner">
                </div>

                <div class="form-group">
                    <label>Release type</label>
                    <select class="form-control" v-model="publish.releaseType">
                        <option value="draft">Draft</option>
                        <option value="prerelease">Prerelease</option>
                        <option value="release">Release</option>
                    </select>
                </div>

                <div class="form-group">
                    <div class="form-check form-check-inline">
                        <label class="title-label form-check-label" >
                            <input id="asar-checkbox" class="form-check-input" type="checkbox" v-model="publish.vPrefixedTagName"> Use v-prefixed tag name
                        </label>
                    </div>
                </div>
            
                <div class="form-group">
                    <div class="form-check form-check-inline disabled">
                        <label class="title-label form-check-label" > 
                            <input id="asar-checkbox" class="form-check-input" type="checkbox" v-model="publish.privateRepo" > Is private repo
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <button class="accent-button b-blue-filled btn-lg publishing-button" @click.prevent="onSave">Save GitHub settings</button>
                </div>
            </form>
        </div>
    </div>
</div>

</template>

<script>
import store from "../store.js";

const PROVIDER_NAME = 'github'

export default {
    data: function(){
        return {
            publish: {
                provider: PROVIDER_NAME, //readonly
                repo: "",
                owner: "",
                token: "",
                vPrefixedTagName: true,
                releaseType: "draft",
                privateRepo: false
            }
        }
    },
    mounted: function(){

        var packageJson = store.product || {};
        console.log("package: ", packageJson, packageJson.build)
        var build = packageJson.build || {};
        var publish = build.publish || {};

        if(packageJson.repository){
            console.log("init repo with: ", packageJson.repository)
            this.publish.repo = packageJson.repository;
        }

        //publish can be of type: String | Object | Array<Object | String>
        var options = {};

        if(!Array.isArray(publish)){
            //if provider is set, is object and contains the property 'provider' the previous config does
            //only configure one publishing target and it is for github
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
            
            //patch projectJson             
            Toolkit.readPackageJson()
            .then(data => {

                data.build = data.build || {};

                var options = {};
                Object.assign(options, this.publish)

                //resolve reserved keyword conflict
                options.private = options.privateRepo;
                delete options.privateRepo;

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