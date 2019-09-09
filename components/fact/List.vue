<template>
    <div>
        <div class="columns is-multiline is-mobile">
            <div class="column is-6" v-for="fact in facts" :key="fact._id">
                <c-fact class="bt_16" :fact="fact" :cover="true"></c-fact>
            </div>
        </div>
        <f-pagination icon-pack="fa" :total="data.total" :per-page="pageSize" :current="current"></f-pagination>
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
                facts: this.data.results
            }
        },
        computed: {
            current() {
                return this.$route.query.page ? Number.parseInt(this.$route.query.page) : 1
            }
        },
        watch: {
            data() {
                this.facts = []
                this.facts = this.data.results
            }
        },
    }
</script>

<style scoped>

</style>
