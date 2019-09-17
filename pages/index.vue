<template>
    <div class="columns">
        <div class="column is-main">
            <div style="width: 100%">
                <h1 style="margin-top: 1rem; text-transform: uppercase;" class="title is-2 bt_32">Interesting facts by theFactWall.com</h1>
                <div class="example bt_32">
                    <div class="button-left">On This day</div>
                    <div class="button-right">
                        <n-link to="/onthisday">more</n-link>
                    </div>
                    <div class="example-component">
                        <ul>
                            <li v-for="fact in otd.results" :key="fact._id">
                                <b-tag v-if="fact.time">{{fact.time.year}}</b-tag>
                                <n-link :to="'/' + fact._id">{{fact.contentShort}}</n-link>
                                <hr class="is-mini"/>
                            </li>
                        </ul>
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
        <div class="column is-4">
            <aside class="sidebar">
                <l-topic class="bt_32" label="#topic" :data="hotTopic"></l-topic>
                <l-topic label="#hashtag" :data="hashtag"></l-topic>
            </aside>
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
            let {n, p, t, d, r, h} = await app.$axios.$get('/home/', {params: query})
            return {
                hotTopic: t,
                newFact: n,
                hotFact: p,
                otd: d,
                random: r,
                hashtag: h
            }
        }
    }
</script>

<style scoped>

</style>
