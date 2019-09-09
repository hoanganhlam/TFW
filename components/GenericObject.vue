<template>
    <div>
        <div class="bt_16" v-for="field in fields" :key="field.label">
            <div class="field">
                <div class="control">
                    <b-input v-model="field.value" :placeholder="field.title">
                        <label slot="prefix">{{field.title}}</label>
                    </b-input>
                </div>
            </div>
        </div>
        <div class="button bt_16" @click="isOpen = !isOpen">Add field</div>
        <b-modal :active.sync="isOpen" has-modal-card>
            <div class="modal-card" style="width: 300px">
                <section class="modal-card-body">
                    <b-field label="Tên trường">
                        <b-input v-model="newField.title" placeholder="Something" required/>
                    </b-field>
                    <b-field label="Label">
                        <b-input v-model="newField.label" placeholder="something"/>
                    </b-field>
                    <b-field label="Icon">
                        <b-input v-model="newField.icon" placeholder="money-check-alt"/>
                    </b-field>
                    <b-field>
                        <b-switch size="is-small" v-model="newField.required">Required</b-switch>
                    </b-field>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-primary is-fullwidth is-small" @click="addField">Thêm</button>
                </footer>
            </div>
        </b-modal>
    </div>
</template>

<script>
    const FIELD_INTERFACE = {
        title: null,
        value: null,
        label: "",
        icon: null,
        required: true,
    }

    export default {
        name: "GenericObject",
        props: {
            value: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                fields: this.value ? this.value : [],
                newField: {
                    title: null,
                    value: null,
                    label: "",
                    icon: null,
                    required: true,
                },
                isOpen: false,
            }
        },
        methods: {
            addField() {
                this.fields.push(this.newField)
                this.newField = FIELD_INTERFACE
            },
        },
        watch: {
            fields() {
                this.$emit('input', this.fields)
            }
        }
    }
</script>

<style scoped>

</style>
