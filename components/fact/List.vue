<template>
    <div>
        <div class="columns is-multiline">
            <div class="column is-12" v-for="fact in res.results" :key="fact._id">
                <c-fact class="bt_32" :fact="fact" :cover="false"></c-fact>
            </div>
        </div>
        <f-pagination icon-pack="fa" :total="res.total" :per-page="pageSize" :current="current" @change="fetch"/>
    </div>
</template>

<script>
    import FactCard from './Card'

    export default {
        name: "ListFact",
        props: {
            data: {
                type: Object,
                default: () => {
                    return {
                        total: 0,
                        results: []
                    }
                }
            },
            pageSize: {
                type: Number,
                default: 10
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        components: {
            FactCard
        },
        data() {
            return {
                res: this.data
            }
        },
        methods: {
            async fetch(page) {
                this.res = await this.$api.fact.list({pageSize: this.pageSize, page: page})
            }
        },
        computed: {
            current() {
                return this.$route.query.page ? Number.parseInt(this.$route.query.page) : 1
            }
        },
        watch: {
            data() {
                this.res = this.data
            }
        },
    }
</script>

<style scoped>

</style>
