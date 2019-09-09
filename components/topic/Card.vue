<template>
    <div></div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            topic: {},
            label: {
                type: String,
                default: null
            },
            icon: {
                type: String,
                default: 'rise'
            }

        }
    }
</script>

<style scoped>

</style>
