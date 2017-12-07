<template>
<div style="height: 100%">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Tools</router-link></li>
        <li class="breadcrumb-item active">More Tools</li>
    </ol>
    <!--  DO NOT ADD nodeintegration or disablewebsecurity or allowpopups attributes here -->
    <webview class="survey" src="https://docs.google.com/forms/d/e/1FAIpQLSdcA9tzZpmhiIji2v1fi8Jq4VAGsEwrDc7VJn24SxkNzRSqnQ/viewform?embedded=true" width="100%" ></webview>
</div>
</template>

<script>

</script>

<style scoped>
.survey{
    height: calc(100% - 65px);
}
</style>
