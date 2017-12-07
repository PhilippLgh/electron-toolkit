<template>
    <button type="button" :class="btnClass" :disabled="!isEnabled" @click="$emit('click', getStateHandler())">
        <i :class="[icon, {'fa-spin': isAnimated}]"  class="fa title-icon" v-if="hasIcon"></i>  
        <span v-if="_isLoading && loadingCaption">{{loadingCaption}}</span>          
        <slot v-else></slot>
    </button>
</template>

<script>
export default {
    props: {
        'loading':{}, 
        'disabled':{},
        'enabled':{
            default: true
        },
        'loading-caption':{}, 
        'btnClass':{}, 
        'buttonTitle':{},
        "fa": {
            default: ''
        }
    },
    data: function(){
        return {
            validate: false,
            isLoading: false,
        }
    },
    computed: {
        isEnabled: function(){
            return !this.disabled && !this._isLoading && this.enabled;
        },
        _isLoading: function(){ return this.isLoading || this.loading},
        hasIcon: function(){
            return this._isLoading || this.fa;
        },
        isAnimated: function(){
            return this._isLoading;
        },
        icon: function(){
            return this._isLoading ? 'fa-circle-o-notch' : this.fa;
        }
    },
    methods: {
        getStateHandler(){
            return {
                start: ()=>{ this.isLoading = true; },
                done: (arg) => {this.isLoading = false; return arg; },
                stop: (arg) => {this.isLoading = false; return arg; },
                error: () => {this.isLoading = false; }
            }
        }
    }
}
</script>

<style>

button:focus, button:active{
    outline: none !important;
    box-shadow: none !important;
}

.title-icon{
    margin-right:0.2rem
}

</style>
