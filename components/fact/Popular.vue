<template>
    <div>
        <div class="is-bold bt_16">
            <b-icon icon="mug-hot" pack="fa"></b-icon>
            <span>Hot</span>
        </div>
        <div class="columns is-slider is-mobile">
            <div class="column is-6" v-for="fact in facts" :key="fact._id">
                <c-fact :cover="true" :fact="fact"></c-fact>
            </div>
            <div class="button left" @click="handle_click(true)">
                <b-icon pack="fa" icon="arrow-left"></b-icon>
            </div>
            <div class="button right" @click="handle_click(false)">
                <b-icon pack="fa" icon="arrow-right"></b-icon>
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
                    pageSize: 3,
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
    .is-slider {
        overflow: hidden;
        position: relative;

        .column:first-child {
            margin-left: -25%;
        }

        .button {
            position: absolute;
            z-index: 2;
            top: 40%;
            border-radius: 50%;

            &.left {
                left: 10px;
            }

            &.right {
                right: 10px;
            }
        }
    }
</style>
