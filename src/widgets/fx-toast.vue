<template>
    <div class="toast" ref="toast" :class="{show: isVisible, error: isError}" v-html="text" @click="onClick"></div>
</template>

<script>
export default {

    data: function(){
        return {
            text: "",
            callback: () => {},
            isError: false,
            isVisible: false
        }
    },
    methods: {
        reset(){
            this.text = "";
            this.isVisible = false;
            this.isError = false;
            this.callback = null;
        },
        show(message){
            //console.log("show ", message)

            this.text = message.content;
            this.isError = message.isError === true;
            this.callback = message.callback;

            this.isVisible = true;

            var timeoutId = setTimeout(()=>{
                this.reset();
            }, 3500);
            
        },
        onClick(e){
            if(typeof this.callback !== 'function'){return;}
            //console.log("click received", this.callback)
            e.preventDefault();
            this.callback(e)
        }
    }
}
</script>

<style scoped>
/* The toast - position it at the bottom and in the middle of the screen */
.toast {
    visibility: hidden; /* Hidden by default. Visible on click */
    min-width: 250px; /* Set a default minimum width */
    max-width: 75%;
    word-wrap: break-word;
    margin-left: auto; /* Center the toast */
    margin-right: auto; /* Center the toast */
    background-color: #333; /* Black background color */
    color: #fff; /* White text color */
    text-align: center; /* Centered text */
    border-radius: 2px; /* Rounded borders */
    padding: 16px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 11; /* Add a z-index if needed */
    left: 0; /* Center the toast */
    right: 0; /* Center the toast */
    bottom: 30px; /* 30px from the bottom */
}

.toast.error{
    /*color: #721c24;*/
    background-color: #e04545;
    /*border-color: #f5c6cb;*/
}

.toast.show {
    visibility: visible; 
    -webkit-animation: fadein 0.5s, fadeout 0.5s 3.5s;
    animation: fadein 0.5s, fadeout 0.5s 3.5s;
}

/* Animations to fade the toast in and out */
@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;} 
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;} 
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
</style>