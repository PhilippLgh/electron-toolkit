<template>
<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item"><router-link to="/publish">Publish</router-link></li></li>
        <li class="breadcrumb-item active">Launchfox</li>
    </ol>
    <launchfox-embedded :name="name" :url="host + '/app.html#/try-releases'"></launchfox-embedded>
</div>
</template>

<script>

import LaunchfoxView from '../launchfox-embedded.vue'

export default {
    props:{
        host: {}
    },
    components:{
        'launchfox-embedded': LaunchfoxView
    },
    data: function() {
        return {
            name:"Publishing"
        }
    }
}
</script>

<style scoped>

.breadcrumb {
    margin-bottom: 0px !important;
}

webview{
    flex: 1;
    margin-top: auto;
    /*height: calc(100vh - 3.0rem);*/
}

.center{
    margin: auto;
}

.nav{
    margin-top: 4%;
    padding-bottom: 1%;
    margin-bottom: 3%;
    border-bottom: 1px solid #ebeef0;
    display:flex;
}

 .nav-pills .nav-link {
    padding:1% 0;
     font-size:1.2rem;
    cursor:pointer;
    padding-right:2rem;
      color:#333;
     background:white;
 }

.nav-pills .nav-link.active, .nav-pills .show>.nav-link  {
    color:#52a5ff;
}

.static-li{
    flex: 1;
    text-align: right;
    cursor:default;
}

</style>