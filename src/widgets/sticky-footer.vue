<template>
<footer class="footer">
    <div class="footer-container">
        <slot></slot>
    </div>
</footer>
</template>

<script>
export default {

}
</script>

<style>
.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    max-height: 60px;
    line-height: 60px;
    background-color: #f5f5f5;
    border-top: 1px solid rgba(169, 169, 169, 0.6);
    box-sizing: content-box;
    z-index: 10;
}

.footer-container{
    margin-left: 3%;
    margin-right: 3%;
    display: flex;
}
</style>
