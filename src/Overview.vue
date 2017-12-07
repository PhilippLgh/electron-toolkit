<template>
<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item">Tools</li>
    </ol>
    <div class="container">

        <div class="row">

            <div class="col-md-4">
                <router-link to="/assets">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-paint-brush" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Assets</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/installer">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"> <i class="fa fa-cube" aria-hidden="true"></i> </div>
                            <h2 class="ssb-title">Installer</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/publish">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-cloud-upload" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Publish</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/website">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-globe" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Website</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/">
                    <div class="square-service-block" @click="showMessage('Work in progress. Feature is coming soon.')">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-cloud-download" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Updates*</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/more">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">More</h2>
                        </a>
                    </div>
                </router-link>
            </div>
        </div>
        <p>*coming soon</p>
    </div>
</div>
</template>

<script>

import app from './app.js'; 
export default {
    name: 'overview-page',
    data: function(){
        return {
        }
    },
    methods:{
        showMessage:function(message){
             app.showUserInfo(message)
        }
    }
}
</script>

<style>
a:hover,
a:focus {
    color: #2a6496;
    text-decoration: none;
}

.square-service-block {
    position: relative;
    overflow: hidden;
    margin: 15px auto;
}

.square-service-block a {
    background-color: #739cce;
    border-radius: 5px;
    display: block;
    padding: 60px 20px;
    text-align: center;
    width: 100%;
}

.square-service-block a:hover {
    background-color: rgba(115, 156, 206, 0.8);
    border-radius: 5px;
}

.ssb-icon {
    color: #fff;
    display: inline-block;
    font-size: 28px;
    margin: 0 0 20px;
}

h2.ssb-title {
    color: #fff;
    font-size: 20px;
    font-weight: 200;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
}
</style>
