<template>
    <div class="card">
        <div class="card-content">
            <div class="columns">
                <div class="column">
                    <b-input v-model="form.key" placeholder="Key"></b-input>
                </div>
                <div class="column">
                    <b-input v-model="form.value" placeholder="Value"></b-input>
                </div>
                <div class="column is-1">
                    <b-button @click="handleAdd" :disable="form.key && form.value">
                        <b-icon pack="fa" icon="plus"></b-icon>
                    </b-button>
                </div>
            </div>
            <b-field grouped group-multiline>
                <div class="control" v-for="key in Object.keys(data)" :key="key">
                    <b-taglist attached>
                        <b-tag size="is-medium">{{key}}</b-tag>
                        <b-tag type="is-success" size="is-medium" closable aria-close-label="Close tag"
                               @click.native="form = {key: key, value: data[key]}"
                               @close="deleteColumn(key)">
                            {{data[key]}}
                        </b-tag>
                    </b-taglist>
                </div>
            </b-field>
        </div>
    </div>
</template>

<script>
    export default {
        name: "QueryBuilder",
        props: {
            value: {
                default: () => {
                    return {}
                },
                type: Object
            }
        },
        data() {
            return {

                data: this.value || {},
                form: {
                    key: null,
                    value: null,
                },
            }
        },
        methods: {
            handleAdd() {
                if (this.form.key && this.form.value) {
                    this.$set(this.data, this.form.key, this.form.value)
                    this.$emit('input', this.data)
                }
            },
            deleteColumn(field) {
                this.$buefy.dialog.alert({
                    title: 'Alert',
                    message: `I want to delete <b>${field}</b>!`,
                    confirmText: 'OK!',
                    canCancel: true,
                    onConfirm: () => {
                        delete this.data[field]
                        this.form = {
                            key: null,
                            value: null,
                        }
                    }
                })
            },
        },
        watch: {
            value() {
                this.data = this.value
            }
        }
    }
</script>

<style scoped>

</style>
