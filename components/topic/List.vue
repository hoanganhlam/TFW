<template>
    <aside class="sidebar">
        <div class="sidebar-menu">
            <h4 class="sidebar-label">Topics</h4>
            <div class="card bt_16" v-for="topic in res.results" :key="topic._id" v-if="topic">
                <div class="card-image">
                    <figure class="image">
                        <img v-if="topic.tempPhotos && topic.tempPhotos.length" :alt="topic.title"
                             :src="'/' + topic.tempPhotos[0].size['200_200']">
                        <img alt="Empty Avatar" v-else
                             src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                    </figure>
                </div>
                <div class="card-content">
                    <n-link :to="'/topic/' + topic.slug">{{topic.title}}</n-link>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
    export default {
        name: "ListTopic",
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
            query: {
                type: Object,
                default: () => {
                    return {
                        page: 1
                    }
                }
            },
            pageSize: {
                type: Number,
                default: 6
            },
            md: {
                type: Number,
                default: 4
            },
            sm: {
                type: Number,
                default: 8
            },
            xs: {
                type: Number,
                default: 12
            },
            label: {
                type: String,
                default: null
            },
            icon: {
                type: String,
                default: 'rise'
            }
        },
        watchQuery: true,
        data() {
            return {
                res: this.data,
                current: this.query.page
            }
        },
        methods: {
            async next() {
                if (this.current === this.lastPage) {
                    this.current = 1
                } else {
                    this.current = this.current + 1
                }
                await this.fetch()
            },
            async previous() {
                if (this.current === 1) {
                    this.current = this.lastPage
                } else {
                    this.current = this.current - 1
                }
                await this.fetch()
            },
            async fetch() {
                this.res = await this.$api.taxonomy.list({pageSize: this.pageSize, page: this.current})
            }
        },
        computed: {
            lastPage() {
                return Math.floor(this.res.total / this.pageSize)
            }
        }
    }
</script>

<style lang="scss">
</style>
