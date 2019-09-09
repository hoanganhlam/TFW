<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <b-datepicker icon-pack="fa" icon="calendar" v-model="date"></b-datepicker>
        </div>
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <div style="margin-top: 2rem" class="example bt_32">
                    <h1 class="button-left">{{title}} Facts</h1>
                    <div class="button-right">
                        <n-link :to="previous">previous day</n-link>
                        <span style="margin: 0 0.5rem"></span>
                        <n-link :to="next">next day</n-link>
                    </div>
                    <div class="example-component">

                    </div>
                </div>
                <l-fact :data="res" :query="query" :page-size="10"></l-fact>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";

    export default {
        head() {
            return {
                title: this.capitalizeFirst(this.title)
            }
        },
        name: 'OnThisDay',
        watchQuery: true,
        async asyncData({app, params, query}) {
            let qStr = '', title = ''
            let today = new moment()
            if (typeof params.month === 'undefined' && typeof params.day === 'undefined') {
                query.day = today.date()
                query.month = today.month() + 1
                title = 'On This Day'
            } else if (params.month && params.day) {
                query.month = params.month
                query.day = params.day
                today = today.month(params.month - 1)
                today = today.date(params.day)
                title = today.format('MMMM Do')
            } else if (params.month) {
                today = today.month(params.month - 1)
                query.month = params.month
                title = today.format('MMMM')
            }
            query.pageSize = 10
            let res = await app.$api.fact.list(query)
            return {
                res: res,
                title,
                query: query,
                today
            }
        },
        data() {
            return {
                date: null
            }
        },
        methods: {},
        computed: {
            next() {
                let next = moment(this.today).add(1, 'd')
                return `/onthisday/${next.month() + 1}/${next.date()}`
            },
            previous() {
                let previous = moment(this.today).subtract(1, 'd')
                return `/onthisday/${previous.month() + 1}/${previous.date()}`
            },
        }
    }
</script>

<style>
</style>
