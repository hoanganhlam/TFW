<template>
    <div class="card">
        <div class="card-content">
            <div class="columns is-multiline">
                <div v-for="item in fields" :key="item.field"
                     :class="`column ${item['column'] ? item['column'] : 'is-12'}`">
                    <b-field label-position="inside" :label="item['label']?item['label']:item['field']">
                        <d-field :setting="item" v-model="data[item.field]" @input="$set(data, item.field, $event )"></d-field>
                    </b-field>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "BuilderJson",
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
                fields: this.pFields ? this.pFields : this.calFields,
                data: this.value || {},
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
            },
            data() {
                this.$emit('input', this.data)
            }
        },
        computed: {
            calFields() {
                let fields = []
                Object.keys(this.value).forEach(key => {
                    fields.push(
                        {
                            field: key
                        }
                    )
                })
                return fields
            }
        },
        mounted() {
            this.fields = this.pFields ? this.pFields : this.calFields
        }
    }
</script>

<style scoped>

</style>
