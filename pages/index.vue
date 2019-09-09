<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <l-topic :data="hotTopic"></l-topic>
        </div>
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <h1>TheFactWall.com, Welcome!</h1>
                <hr class="is-small">
                <div class="example bt_32">
                    <div class="button-left">On This day</div>
                    <div class="button-right">
                        <n-link to="/onthisday">more</n-link>
                    </div>
                    <div class="example-component">
                        <div v-for="fact in otd.results" :key="fact._id" style="margin-bottom: 0.5rem">
                            <b-tag v-if="fact.date">{{moment(fact.date).year()}}</b-tag>
                            <n-link :to="'/' + fact._id">{{fact.contentShort}}</n-link>
                            <hr class="is-mini">
                        </div>
                    </div>
                </div>
                <hr class="is-small">
                <p-fact class="bt_32" :data="hotFact"></p-fact>
                <hr class="is-small">
                <div class="example bt_32">
                    <div class="button-left">Random</div>
                    <div class="button-right">
                        <n-link to="/random">more</n-link>
                    </div>
                    <div class="example-component">
                        <p class="title">{{random.contentShort}}</p>
                    </div>
                </div>
                <hr class="is-small">
                <div class="bt_32">
                    <div class="is-bold bt_16">
                        <b-icon icon="rss" pack="fa"></b-icon>
                        <span>New</span>
                    </div>
                    <l-fact :data="newFact"></l-fact>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const moment = require('moment')
    export default {
        name: "index",
        head() {
            return {
                title: 'TheFactWall.com - Place of truth'
            }
        },
        watchQuery: true,
        async asyncData({app, query}) {
            let today = new moment()
            query['day'] = today.date()
            query['month'] = today.month() + 1
            let {n, p, t, d, r} = await app.$axios.$get('/home/', {params: query})
            return {
                hotTopic: t,
                newFact: n,
                hotFact: p,
                otd: d,
                random: r
            }
        }
    }
</script>

<style scoped>

</style>
