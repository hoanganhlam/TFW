<template>
    <b-taginput
        v-model="tags"
        :data="filteredTags"
        autocomplete
        :field="field"
        icon="tag"
        icon-pack="fa"
        :placeholder="placeholder"
        @typing="getFilteredTags">
        <template slot-scope="props">
            {{props.option[field]}}
        </template>
        <template slot="empty">
            There are no items
        </template>
    </b-taginput>
</template>

<script>
    import debounce from 'lodash/debounce'

    export default {
        props: {
            placeholder: {},
            value: {
                default: () => {
                    return []
                },
                type: Array
            },
            endpoint: String,
            field: {
                default: 'title',
                type: String
            }
        },
        data() {
            return {
                filteredTags: this.value ? this.value : [],
                isSelectOnly: false,
                tags: this.value
            }
        },
        methods: {
            getFilteredTags: debounce(function (name) {
                if (!name.length) {
                    this.filteredTags = []
                    return
                }
                this.isFetching = true
                this.$axios.$get(this.endpoint, {
                    params: {
                        search: name
                    }
                }).then(res => {
                    this.filteredTags = res.results
                }).finally(() => {
                    this.isFetching = false
                })
            }, 500),
        },
        watch: {
            tags() {
                this.$emit('input', this.tags)
            }
        }
    }
</script>
