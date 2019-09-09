<template>
    <aside class="sidebar">
        <div class="sidebar-menu">
            <h4 class="sidebar-label">{{label}}</h4>
            <div class="columns is-mobile is-multiline">
                <div v-for="topic in res.results" :key="topic._id"
                     v-if="topic && ((type==='object' && topic.isObject) || (type==='tag' && !topic.isObject))"
                     class="column is-half-mobile is-one-desktop">
                    <div class="box">
                        <div class="media">
                            <div class="media-left">
                                <figure v-if="type === 'object'" class="image is-48x48">
                                    <img v-if="topic.tempPhotos && topic.tempPhotos.length" :alt="topic.title"
                                         :src="'/' + topic.tempPhotos[0].size['100_100']">
                                    <img alt="Empty Avatar" v-else
                                         src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                </figure>
                                <b-icon v-else pack="fa" icon="tags"></b-icon>
                            </div>
                            <div class="media-content">
                                <n-link :to="'/topic/' + topic.slug">{{topic.title}}</n-link>
                            </div>
                        </div>
                    </div>
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
            label: {
                type: String,
                default: 'Topics'
            },
            type: {
                type: String,
                default: 'object'
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
