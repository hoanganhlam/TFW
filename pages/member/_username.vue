<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">

        </div>
        <div class="tile is-parent is-main">
            <div style="width: 100%">
                <div style="margin-top: 2rem" class="example bt_32">
                    <h1 class="button-left">{{convertName(user)}}</h1>
                    <div class="example-component">
                        <div class="content">{{user.bio}}</div>
                    </div>
                </div>
                <l-fact :data="res"></l-fact>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "PageMember",
        watchQuery: true,
        async asyncData({app, params, query}) {
            let user = await app.$axios.$get(`/users/${params.username}`)
            if (params.username === 'me') {
                params.username = app.$auth.user.username
            }
            let res = await app.$axios.$get(`/facts/?user=${user._id}&page_size=10`, {
                params: query
            })
            query.user = params.username
            return {
                user: user,
                res: res,
                query: query,
            }
        },
        data() {
            return {
                updating: false,
                form: {
                    firstName: null,
                    lastName: null,
                    avatar: null,
                    bio: null
                },
                meta: []
            }
        },
        head() {
            return {
                title: `Facts by ${this.convertName(this.user)}`,
                meta: this.meta

            }
        },
        methods: {
            async handleUpdate() {
                if (!this.updating) {
                    this.updating = true
                } else {
                    let data = this.form
                    if (data.avatar === null) {
                        delete data.avatar
                    }
                    this.user = await this.$api.user.update(this.user.username, data)
                    this.updating = false
                }
            }
        },
        mounted() {
            this.form.firstName = this.user.firstName
            this.form.lastName = this.user.lastName
            if (this.user.avatar) {
                this.form.avatar = this.user.avatar._id
            }
        },
        created() {
            if (this.res.results.length === 0) {
                this.meta.push({hid: 'robots', name: 'robots', content: 'noindex'})
            }
        }
    }
</script>

<style lang="scss">
</style>
