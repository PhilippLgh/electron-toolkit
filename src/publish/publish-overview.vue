<template>
<div>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item active">Publish</li>
    </ol>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <router-link to="/publish/detail/Launchfox">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-rocket" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Launchfox</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/publish/detail/GitHub">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"> <i class="fa fa-github" aria-hidden="true"></i> </div>
                            <h2 class="ssb-title">GitHub</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/publish/detail/AWS_S3">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-amazon" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Amazon S3</h2>
                        </a>
                    </div>
                </router-link>
            </div>
<!--
            <div class="col-md-4">
                <router-link to="/graphics">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-server" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Digital Ocean</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/publish/detail/Bintray">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-server" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Bintray</h2>
                        </a>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4">
                <router-link to="/publish/detail/Nuts">
                    <div class="square-service-block">
                        <a href="#">
                            <div class="ssb-icon"><i class="fa fa-server" aria-hidden="true"></i></div>
                            <h2 class="ssb-title">Nuts</h2>
                        </a>
                    </div>
                </router-link>
            </div>
            -->
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
    color: #2a6496;
    text-decoration: none;
}

.square-service-block {
    position: relative;
    overflow: hidden;
    margin: 15px auto;
}

.square-service-block a {
    background-color: rgb(206, 115, 115);
    border-radius: 5px;
    display: block;
    padding: 60px 20px;
    text-align: center;
    width: 100%;
}

.square-service-block a:hover {
    background-color:rgba(206, 115, 115, 0.8);
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
