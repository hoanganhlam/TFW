<template>
    <div class="card">
        <div class="card-content">
            <div class="columns is-multiline">
                <div v-for="item in pFields" :key="item.field"
                     :class="`column ${item['column'] ? item['column'] : 'is-12'}`">
                    <b-field :label="item['label']">
                        <d-field :setting="item" v-model="data[item.field]"></d-field>
                    </b-field>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GenericObject",
        props: {
            pFields: {},
            value: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                fields: this.pFields ? this.pFields : [],
                data: this.value,
                newField: {
                    title: null,
                    label: ""
                },
                isOpen: false,
            }
        },
        watch: {
            fields() {
                this.$emit('input', this.data)
            }
        },
        computed: {}
    }
</script>

<style scoped>

</style>
