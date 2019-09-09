<template>
    <a-calendar @panelChange="onPanelChange"/>
</template>

<script>
    export default {
        name: "calendar",
        head() {
            return {
                title: 'Calendar'
            }
        },
        methods: {
            onPanelChange(value, mode) {
                console.log(value, mode);
            }
        }
    }
</script>

<style scoped>

</style>
