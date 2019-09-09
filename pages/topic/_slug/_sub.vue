<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <l-topic :data="{results: fact.taxonomies}"></l-topic>
        </div>
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <div style="margin-top: 2rem" class="example bt_32">
                    <h1 class="button-left">{{title}}</h1>
                    <div class="example-component">
                        <div class="content">{{topic.description}}</div>
                    </div>
                </div>
                <l-fact :data="fact"></l-fact>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: this.capitalizeFirst(this.title)
            }
        },
        watchQuery: true,
        async asyncData({app, params, query}) {
            let res = await app.$api.taxonomy.get(params.slug, query)
            if (typeof params.sub === 'undefined') {
                params.sub = 'facts'
            } else {
                params.sub = params.sub + ' facts'
            }
            return {
                topic: res.instance,
                title: params.sub + ' about ' + res.instance.title,
                query: query,
                fact: res.fact,
                contributors: res.contributors,
            }
        },
        data() {
            return {}
        },
        methods: {
            async handleUpdate(id, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                this.topic = await this.$api.taxonomy.update(id, data)
            },
        },
    }
</script>

<style>
</style>
