<template>
    <b-autocomplete
            :value="text"
            :data="data"
            :field="field"
            :loading="isFetching"
            :placeholder="placeholder"
            @typing="getAsyncData"
            @select="handleSelect">
        <template slot-scope="props">
            {{ props.option[field] }}
        </template>
    </b-autocomplete>
</template>

<script>
    import debounce from 'lodash/debounce'

    export default {
        props: {
            placeholder: {},
            value: {},
            endpoint: String,
            field: {
                default: 'title',
                type: String
            }
        },
        data() {
            return {
                data: [],
                selected: this.value,
                text: this.value ? this.value[this.field] : null,
                isFetching: false
            }
        },
        methods: {
            getAsyncData: debounce(function (name) {
                if (!name.length) {
                    this.data = []
                    return
                }
                this.isFetching = true
                this.$axios.$get(this.endpoint, {
                    params: {
                        search: name
                    }
                }).then(res => {
                    this.data = res.results
                }).finally(() => {
                    this.isFetching = false
                })
            }, 500),
            handleSelect(option) {
                this.$emit('input', option)
                this.selected = option
                this.text = option ? option[this.field] : null
            }
        },
        watch: {
            value() {
                this.selected = this.value
            }
        }
    }
</script>
