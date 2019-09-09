<template>
    <div></div>
</template>

<script>
    import debounce from 'lodash/debounce';

    export default {
        name: "ObjectSelect",
        data() {
            this.fetchTopic = debounce(this.fetchTopic, 500);
            return {
                topics: [],
                fetching: false,
                visible: false,
                topicName: null,
                selected: []
            }
        },
        methods: {
            fetchTopic(value) {
                this.data = []
                this.fetching = true
                this.$api.taxonomy.list({search: value}).then(res => {
                    this.topics = res.results
                    this.fetching = false
                })
            },
            handleChange(selected) {
                this.selected = selected
                this.$emit('selected', selected)
            },
            async createTopic() {
                let res = await this.$api.taxonomy.post({title: this.topicName})
                this.topics.push(res)
                this.selected.push(res._id)
                this.visible = false
                this.topicName = null
            }
        },
    }
</script>

<style scoped>

</style>
