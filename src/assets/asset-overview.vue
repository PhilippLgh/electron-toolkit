<template>
<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item active">Assets</li>
    </ol>
    <div class="container">
        <div class="row">

            <div class="col-md-4">
                <router-link to="/assets/appicon">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"> <i class="fa fa-crop" aria-hidden="true"></i> </div>
                            <h2 class="ssb-title">App Icon</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/assets/screenshot">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-camera" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Screenshots</h2>
                        </a>
                    </div>
                </router-link>
            </div>

        </div>
    </div>
</div>
</template>

<script>

export default {
    components: {
    }
}
</script>

<style scoped>
a:hover,
a:focus {
    color: #16c585;
    text-decoration: none;
}

.square-service-block {
    position: relative;
    overflow: hidden;
    margin: 15px auto;
}

.square-service-block a {
    background-color:#16c585;
    border-radius: 5px;
    display: block;
    padding: 60px 20px;
    text-align: center;
    width: 100%;
}

.square-service-block a:hover {
    background-color: #73ce96;
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
