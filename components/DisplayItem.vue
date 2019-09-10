<template>
    <div>
        <div class="bt_16" v-for="column in fields" :key="column.field">
            <b-field :label="column.label">
                <d-field :title="title" :setting="column" v-model="data[column.field]"></d-field>
            </b-field>
        </div>
        <div class="columns">
            <div class="column">
                <b-button class="is-fullwidth" @click="handleDelete">{{sure?'Sure':'Delete'}}</b-button>
            </div>
            <div class="column">
                <b-button class="is-fullwidth" @click="handleSave">Save</b-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DisplayItem",
        props: {
            value: {},
            title: {
                default: null,
                type: String
            }
        },
        data() {
            return {
                data: this.value,
                sure: false,
                endpoint: this.$route.path.replace('/manager', '')
            }
        },
        computed: {
            fields() {
                return this.getSchema(this.$route.params.model, false)
            }
        },
        methods: {
            async handleSave() {
                let body = {}
                let fields = Object.keys(this.data)
                fields.forEach(field => {
                    if (Array.isArray(this.data[field])) {
                        body[field] = []
                        this.data[field].forEach(data => {
                            if (typeof data === 'object' && data && data['_id']) {
                                body[field].push(data['_id'])
                            } else {
                                body[field].push(data)
                            }
                        })
                    } else if (typeof this.data[field] === 'object' && this.data[field] && this.data[field]['_id']) {
                        body[field] = this.data[field]['_id']
                    } else {
                        body[field] = this.data[field]
                    }
                })
                if (body._id) {
                    await this.$axios.$put(`${this.endpoint + '/' + body._id}/`, body)
                } else {
                    await this.$axios.$post(`${this.endpoint}/`, body)
                    this.$emit('create')
                }
            },
            async handleDelete() {
                if (this.sure) {
                    if (this.data._id) {
                        await this.$axios.$delete(`${this.endpoint + '/' + this.data._id}/`)
                    }
                    this.$emit('delete')
                } else {
                    this.sure = true
                }

            }
        }
    }
</script>

<style scoped>

</style>
