<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile">
            <c-fact class="fact-card" :fact="fact"></c-fact>
        </div>
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <div class="comments">
                    <div class="content">
                        <textarea v-model="comment" style="margin-bottom: 0.5rem"
                                  class="textarea" rows="2"
                                  placeholder="Your idea..."></textarea>
                        <div class="level is-mobile">
                            <div class="level-left">
                                <b-button icon-pack="fa" icon-left="user">
                                    <strong>{{$auth.loggedIn ? convertName($auth.user) : 'Guess'}}</strong>
                                </b-button>
                            </div>
                            <div class="level-right">
                                <b-button @click="handleSubmit">{{$auth.loggedIn ? 'Post' : 'Please login...'}}</b-button>
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

            checkVoted(value) {
                return this.isVoted && value === this.isVoted.value
            },
            async handleSubmit() {
                if (this.$auth.loggedIn) {
                    this.submitting = true
                    if (this.comment === null || this.comment.length < 20) {
                        this.$buefy.snackbar.open({
                            message: 'Your comment is too short!',
                            type: 'is-warning',
                            position: 'is-bottom',
                            actionText: 'OK',
                        })
                    } else {
                        let res = await this.$api.fact.comment(this.fact._id, {
                            content: this.comment
                        })
                        this.commment = null
                        this.fact.comments.push(res)
                        this.submitting = false
                    }
                } else {
                    this.$buefy.snackbar.open({
                        message: 'Sorry, You must login to add comment!',
                        type: 'is-warning',
                        position: 'is-bottom',
                        actionText: 'OK'
                    })
                }
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
