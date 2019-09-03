<template>
    <div class="card">
        <div class="card-content">
            <div class="columns">
                <div class="column">
                    <b-input v-model="form.label" placeholder="Label"
                             @blur="form.field = slugify(form.label)"></b-input>
                </div>
                <div class="column">
                    <b-input v-model="form.field" placeholder="Field"></b-input>
                </div>
                <div class="column">
                    <b-select class="fullwidth" placeholder="Type" v-model="form.dataType">
                        <option v-for="option in listType" :value="option.value" :key="option.value">{{ option.title }}
                        </option>
                    </b-select>
                </div>
                <div class="column is-1">
                    <b-button @click="handleAdd" :disable="form.key && form.label">
                        <b-icon pack="fa" icon="plus"></b-icon>
                    </b-button>
                </div>
            </div>
            <o-build class="bt_16" v-if="form.dataType === 'object'" v-model="form.fields"
                     @input="form.fields = $event"/>
            <b-taglist class="clickable" @click.native="form = field">
                <b-tag v-for="field in data" :key="field.field"
                       size="is-medium" closable aria-close-label="Close tag"
                       @close="deleteColumn(field.field)">
                    {{field.label}}
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
                    label: null,
                    dataType: 'text',
                    fields: []
                },
                listType: [
                    {
                        value: 'text',
                        title: 'Text'
                    },
                    {
                        value: 'number',
                        title: 'Number'
                    },
                    {
                        value: 'object',
                        title: 'Data object'
                    },
                    {
                        value: 'tag',
                        title: 'Array text'
                    },
                    {
                        value: 'boolean',
                        title: 'True/False'
                    },
                    {
                        value: 'date',
                        title: 'Date'
                    },
                    {
                        value: 'option',
                        title: 'Select'
                    }
                ]
            }
        },
        methods: {
            handleAdd() {
                if (this.form.field && this.form.label) {
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
                        label: null,
                        field: null,
                        dataType: 'text',
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
                            label: null,
                            field: null,
                            dataType: 'text',
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
