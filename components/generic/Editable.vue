<template>
    <div></div>
</template>
<script>
    export default {
        name: 'EditAble',
        props: {
            text: String,
            type: {
                type: String,
                default: 'textarea'
            },
            to: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                value: this.text,
                editable: false,
            };
        },
        methods: {
            handleChange(e) {
                const value = e.target.value;
                this.value = value;
            },
            check() {
                this.editable = false;
                this.$emit('change', this.value);
            },
            edit() {
                this.editable = true;
            },
        },
        watch: {
            text() {
                this.value = this.text
            }
        }
    };
</script>
