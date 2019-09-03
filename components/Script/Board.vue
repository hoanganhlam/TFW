<template>
    <div>
        <b-collapse v-for="crawler in res.results" :key="crawler._id" class="card bt_16" :aria-id="crawler._id">
            <div slot="trigger" slot-scope="props" class="card-header" role="button" :aria-controls="crawler._id">
                <p class="card-header-title">
                    <b-icon pack="fa" icon="spider"></b-icon>
                    <span>{{crawler.title}}</span>
                </p>
                <div class="card-header-icon">
                    <n-link :to="`/${campaign._id}/${crawler._id}/`">
                        <b-icon pack="fa" icon="arrow-right"></b-icon>
                    </n-link>
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item">Test</a>
                <a class="card-footer-item">Run</a>
                <a class="card-footer-item">Delete</a>
            </footer>
        </b-collapse>
        <div class="is-center">
            <b-button class="fullwidth" @click="addCrawler()">
                <b-icon icon="plus" pack="fa"></b-icon>
            </b-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Board",
        data() {
            return {
                res: {
                    total: 0,
                    results: []
                }
            }
        },
        methods: {
            async fetchCrawler() {
                if (this.campaign === null) {
                    return
                }
                this.res = await this.$axios.$get(`/crawlers/`)
            },
            addCrawler() {
                this.$buefy.dialog.prompt({
                    message: `What's crawler name?`,
                    inputAttrs: {
                        placeholder: 'e.g. Spiderman',
                        maxlength: 10
                    },
                    onConfirm: async (value) => {
                        let res = await this.$axios.$post(`/crawlers/`, {
                            title: value
                        })
                        this.$router.replace({path: `/${this.campaign._id}/${res._id}/`})
                    }
                })
            }
        },
        async created() {
            await this.fetchCrawler()
        }
    }
</script>

<style scoped>

</style>
