<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <l-topic :data="{results: fact.taxonomies}"></l-topic>
        </div>
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <c-fact class="bt_32" :fact="fact"></c-fact>
                <div class="comments">
                    <div class="content" v-if="$auth.loggedIn">
                        <textarea v-model="comment" style="margin-bottom: 0.5rem" class="textarea" rows="2" placeholder="Your idea...">
                        </textarea>
                        <div class="level">
                            <div class="level-left">
                                <b-button icon-pack="fa" icon-left="user">
                                    <strong>{{convertName($auth.user)}}</strong>
                                </b-button>
                            </div>
                            <div class="level-right">
                                <b-button @click="handleSubmit">Post</b-button>
                            </div>
                        </div>
                    </div>
                    <div class="box" v-for="comment in fact.comments" :key="comment._id">
                        <div class="content">
                            <p>{{comment.content}}</p>
                            <div class="level">
                                <div class="level-left">
                                    <b-button icon-pack="fa" icon-left="user">
                                        <strong>{{convertName(comment.user)}}</strong>
                                    </b-button>
                                </div>
                                <div class="level-right">
                                    <b-button size="is-small">
                                        <b-icon pack="fa" icon="arrow-up"></b-icon>
                                    </b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageFactDetail",
        head() {
            return {
                title: this.title
            }
        },
        async asyncData({app, params}) {
            let res = await app.$api.fact.get(params.id, null)
            let title = params.id === 'random' ? 'Random facts' : res.title || res.contentShort
            return {
                fact: res,
                isVoted: res.isVoted,
                title
            }
        },
        data() {
            return {
                showSource: false,
                isUpdate: false,
                comment: null,
                submitting: false
            }
        },
        methods: {
            async reset() {
                this.fact = await this.$api.fact.get('random', null)
            },

            async toggleVote(value) {
                let data = {
                    value: value,
                }
                if (this.checkVoted(value)) {
                    data.value = 0
                }
                this.isVoted = await this.$axios.$post(`/facts/${this.fact._id}/vote/`, data)
            },
            checkVoted(value) {
                return this.isVoted && value === this.isVoted.value
            },
            async handleSubmit() {
                this.submitting = true
                let res = await this.$api.fact.comment(this.fact._id, {
                    content: this.comment
                })
                this.fact.comments.push(res)
                this.submitting = false
            }
        },
        computed: {
            user() {
                if (this.fact.user) {
                    if (this.fact.user._id) {
                        return this.fact.user
                    } else if (this.fact.user.length) {
                        return this.fact.user[0]
                    }
                }
                return null
            }
        }
    }
</script>

<style scoped>

</style>
