<template>
    <div class="columns is-multiline">
        <div v-for="item in pFields" :key="item.field"
             v-if="show(item.field)"
             :class="`column ${item['column'] ? item['column'] : 'is-12'}`">
            <b-field :label="title(item)">
                <d-field :setting="item" v-model="data[item.field]"></d-field>
            </b-field>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GenericObject",
        props: {
            pFields: {},
            parent: {
                type: Object,
                default: null
            },
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
                both: ['target', 'value']
            }
        },
        methods: {
            title(item) {
                return item['label']
            },
            show(field) {
                if (this.both.indexOf(field) >= 0) {
                    return true
                }

                if (this.parent.loop || this.parent.action) {
                    if (this.parent.loop) {
                        if (['max'].indexOf(field) >= 0) {
                            return true
                        }
                    }
                    if (this.parent.action) {
                        if (this.parent.action === 'EXTRACT' && ['field', 'kind', 'key'].indexOf(field) >= 0) {
                            return true
                        }

                        if (this.parent.action === 'INPUT' && ['value'].indexOf(field) >= 0) {
                            return true
                        }

                        if (this.parent.action === 'GOTO' && ['params'].indexOf(field) >= 0) {
                            return true
                        }
                    }
                }
                return false
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
