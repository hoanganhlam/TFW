<template>
    <div>
        <div class="bt_16" v-for="column in fields" :key="column.field">
            <b-field :label="column.label">
                <d-field :setting="column" v-model="data[column.field]"></d-field>
            </b-field>
        </div>
        <div class="level">
            <div class="level-left"></div>
            <div class="level-right">
                <div class="buttons">
                    <b-button @click="handleSave">Save</b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DisplayItem",
        props: {
            value: {},
            fields: {
                default: () => {
                    return []
                },
                type: Array
            }
        },
        data() {
            return {
                data: this.value,
                sure: false
            }
        },
        computed: {},
        methods: {
            async handleSave() {
                this.$emit('save', this.data)
            }
        }
    }
</script>

<style scoped>

</style>
