<template>
    <div style="position: relative; min-height: 100vh">
        <b-navbar style="border-bottom: 1px solid #DDD;">
            <template slot="brand">
                <b-navbar-item>
                    <n-link to="/">TheCollector</n-link>
                </b-navbar-item>
            </template>
            <template slot="end">
                <b-navbar-item tag="div">
                    <div class="buttons">
                        <div v-if="!$auth.loggedIn" class="button is-primary" @click="isOpen = !isOpen">
                            <strong>Log in</strong>
                        </div>
                    </div>
                </b-navbar-item>
            </template>
        </b-navbar>
        <div>
            <div class="sidebar-bg"></div>
            <div class="container medium">
                <nuxt/>
                <div></div>
            </div>
        </div>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is
                    licensed
                    <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
                    is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
                </p>
            </div>
        </footer>
        <b-modal :active.sync="isOpen" :can-cancel="false" has-modal-card>
            <div class="modal-card" style="width: 500px">
                <section class="modal-card-body">
                    <b-field label="Username">
                        <b-input v-model="form.email" maxlength="30"/>
                    </b-field>
                    <b-field label="Password">
                        <b-input v-model="form.password" type="password" maxlength="30"/>
                    </b-field>
                    <b-field>
                        <b-button @click="login">Đăng nhập</b-button>
                        <b-button @click="register">Đăng ký</b-button>
                    </b-field>
                </section>
            </div>
        </b-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                response: {
                    results: [],
                    total: 0
                },
                isOpen: false,
                form: {
                    email: '',
                    password: ''
                }
            }
        },
        methods: {
            login() {
                this.$auth
                    .loginWith('local', {
                        data: this.form
                    })
                    .then(res => {
                        console.log(res)
                        this.isOpen = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            async register() {
                await this.$axios.$post('/users/', this.form)
                this.login()
            },
            async fetch() {
                this.response = await this.$axios.$get('/campaigns/')
            },
            async addCampaign() {
                let campaign = await this.$axios.$post('/campaigns/', {
                    title: 'New ' + (this.response.total + 1)
                })
                this.response.results.push(campaign)
            }
        },
        async created() {
            if (!this.$auth.loggedIn) {
                this.isOpen = true
            } else {
                await this.fetch()
            }
        }
    }
</script>
