<template>
    <div class="card">
        <div class="card-content">
            <div class="columns is-multiline">
                <div class="column is-6">
                    <b-input v-model="form.field" placeholder="Field"></b-input>
                </div>
                <div class="column is-6">
                    <b-input v-model="form.path" placeholder="Path"></b-input>
                </div>
                <div class="column is-6">
                    <b-input v-model="form.kind" placeholder="css or xpath"></b-input>
                </div>
                <div class="column is-6">
                    <b-input v-model="form.position" placeholder="Position"></b-input>
                </div>
                <div class="column is-6">
                    <b-switch v-model="form.trim">Trim</b-switch>
                </div>
                <div class="column is-6">
                    <b-button class="fullwidth" @click="handleAdd" :disable="form.field && form.path">
                        <b-icon pack="fa" icon="plus"></b-icon>
                    </b-button>
                </div>
            </div>
            <b-taglist>
                <b-tag v-for="field in data" :key="field.field"
                       size="is-medium" closable aria-close-label="Close tag"
                       @click.native="form = field"
                       @close="deleteColumn(field.field)">
                    {{field.field}}
                </b-tag>
            </b-taglist>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ObjectBuilder",
        props: {
            value: {
                default: () => {
                    return []
                },
                type: Array
            }
        },
        data() {
            return {
                data: this.value || [],
                form: {
                    field: null,
                    position: null,
                    kind: '',
                    path: null,
                    trim: false
                }
            }
        },
        methods: {
            handleAdd() {
                if (this.form.field) {
                    if (this.data.filter(x => x.field === this.form.field).length) {
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i].field === this.form.field) {
                                this.data[i] = this.form
                            }
                        }
                    } else {
                        this.data.push(this.form)
                    }
                    this.form = {
                        field: null,
                        position: null,
                        path: null
                    }
                }
                this.$emit('input', this.data)
            },
            deleteColumn(field) {
                this.$buefy.dialog.alert({
                    title: 'Alert',
                    message: `I want to delete <b>${field}</b>!`,
                    confirmText: 'OK!',
                    canCancel: true,
                    onConfirm: () => {
                        this.data = this.data.filter(x => x.field !== field)
                        this.form = {
                            field: null,
                            position: null,
                            path: null
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
