<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <div style="margin-top: 2rem" class="example bt_32">
                    <h1 class="button-left">{{title}}</h1>
                    <div class="example-component">

                    </div>
                </div>
                <l-fact :data="res"></l-fact>
            </div>
        </div>
        <div class="tile is-vertical is-4">
            <div class="sidebar">
                <l-topic type="tag" label="Other tag" :data="topics"></l-topic>
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
            let action = '1'
            let title = ''
            switch (params.action) {
                case 'wtf':
                    action = '1'
                    title = 'WTF Facts'
                    break
                case 'wow':
                    action = '1'
                    title = 'Wow Facts'
                    break
                case 'interesting':
                    action = '2'
                    title = 'Interesting Facts'
                    break
                case 'unbelievable':
                    action = '1,2'
                    title = 'Unbelievable Facts'
                    break
                case 'fun':
                    action = '3'
                    title = 'Fun Facts'
                    break
                case 'bored':
                    action = '4'
                    title = 'Bored Facts'
                    break
            }
            query.action = action
            query.pageSize = 10
            let res = await app.$api.fact.list(query)
            let topics = await app.$api.taxonomy.list({kind: 'tag'})
            return {
                res: res,
                title: title,
                query: query,
                topics: topics
            }
        },
        data() {
            return {}
        }
    }
</script>

<style>
</style>
