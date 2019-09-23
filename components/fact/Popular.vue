<template>
    <div>
        <div class="level">
            <div class="level-left">
                <div class="is-bold bt_16">
                    <b-icon icon="mug-hot" pack="fa"></b-icon>
                    <span>Hot</span>
                </div>
            </div>
            <div class="level-right">
                <div class="buttons">
                    <div class="button left" @click="handle_click(true)">
                        <b-icon pack="fa" icon="angle-left"></b-icon>
                    </div>
                    <div class="button right" @click="handle_click(false)">
                        <b-icon pack="fa" icon="angle-right"></b-icon>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left" v-if="facts[0].photo && facts[0].photo.size">
                            <figure class="image is-96x96">
                                <img :alt="facts[0].photo.title" :src="'/' + facts[0].photo.size['200_200']">
                            </figure>
                        </div>
                        <div class="media-content">
                            <div class="title">
                                <n-link :to="'/' + facts[0]._id">{{facts[0].contentShort}}</n-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <b-loading :is-full-page="false" :active.sync="loading" :can-cancel="true"></b-loading>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Popular",
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
        },
        data() {
            return {
                total: this.data.total,
                facts: this.data.results,
                current: 1,
                loading: false,
                styles: [
                    {
                        backgroundImage: 'linear-gradient(to left, #9bda81, #26b07a)'
                    },
                    {
                        backgroundImage: 'linear-gradient(to left, #fed44b, #ffaa43)'
                    },
                    {
                        backgroundImage: 'linear-gradient(to left, #bf8ee4, #574f84)'
                    }
                ]
            }
        },
        methods: {
            async handle_click(flag) {
                if (flag) {
                    if (this.current === 1) {
                        this.current = this.total
                    } else if (this.current > 1) {
                        this.current = this.current - 1
                    }
                } else {
                    if (this.current === this.total) {
                        this.current = 1
                    } else if (this.current < this.total) {
                        this.current = this.current + 1
                    }
                }
                await this.fetch()
            },
            async fetch() {
                let query = {
                    pageSize: 1,
                    ordering: 'popular',
                    page: this.current
                }
                this.loading = true
                let res = await this.$api.fact.list(query)
                this.loading = false
                this.total = res.total
                this.facts = res.results
            },
        }
    }
</script>
<style lang="scss">
</style>
