
<template>
    <div class="error-message">
        <i class="fa fa-meh-o" aria-hidden="true"></i>
        <h2>Ooooops 404! Internet connection required...</h2>
    </div>
</template>

<script>
export default {
    props: {
            
    },
    data: function(){
        return{
        }
    },
    computed: { 
    }
}
</script>

<style scoped>
.error-message{
    text-align: center;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding: 5%;
}
.error-message i{
    font-size: 4rem;
    margin-bottom:1%;
}
.error-message h2{
    font-weight:100;
}
</style>








