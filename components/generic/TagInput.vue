<template>
    <div></div>
</template>
<script>
    export default {
        name: 'TagInput',
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
                tags: this.value,
                inputVisible: false,
                inputValue: '',
            }
        },
        methods: {
            handleClose(removedTag) {
                const tags = this.tags.filter(tag => tag !== removedTag)
                this.tags = tags
                this.$emit('input', this.tags)
            },

            showInput() {
                this.inputVisible = true
                this.$nextTick(function () {
                    this.$refs.input.focus()
                })
            },

            handleInputChange(e) {
                this.inputValue = e.target.value
                this.$emit('input', this.tags)
            },

            handleInputConfirm() {
                const inputValue = this.inputValue
                let tags = this.tags
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue]
                }
                console.log(tags)
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                })
                this.$emit('input', this.tags)
            },
        },
        watch: {
            value() {
                this.tags = this.value
            }
        }
    }
</script>
