<template>
    <b-input :placeholder="placeholder" v-model="data"></b-input>
</template>

<script>
    export default {
        name: "Array",
        props: ['value', 'placeholder'],
        data() {
            return {
                data: this.value ? this.value.toString() : ''
            }
        },
        watch: {
            data() {
                this.$emit('input', this.data.split(","))
            }
        }
    }
</script>

<style scoped>

</style>
