<template>
    <div>
        <div class="columns is-multiline">
            <div class="column">
                <b-datepicker
                    v-model="date"
                    icon-pack="fa"
                    icon="calendar"
                    :size="size"
                    :placeholder="placeholder"
                    :unselectable-days-of-week="[0, 6]">
                </b-datepicker>
            </div>
            <div class="column">
                <b-clockpicker
                    v-model="date"
                    placeholder="Chọn giờ"
                    :size="size"
                    hour-format="24"></b-clockpicker>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Datetime",
        props: {
            value: {},
            size: {
                default: 'is-default'
            },
            placeholder: {}
        },
        data() {
            return {
                date: this.value? new Date(this.value): new Date()
            }
        },
        watch: {
            date() {
                this.$emit('input', this.date)
            }
        }
    }
</script>

<style scoped>

</style>
