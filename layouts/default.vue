<template>
    <div style="position: relative; min-height: 100vh">
        <header style="border-bottom: 1px solid #DDD; background: #FFF; position: relative; z-index: 2">
            <div class="container">
                <b-navbar>
                    <template slot="brand">
                        <b-navbar-item tag="router-link" class="logo" to="/">
                            <img src="/logo.png" alt="TheFactWall.com">
                        </b-navbar-item>
                    </template>
                    <template slot="start">
                        <b-navbar-item tag="div">
                            <n-link to="/reaction/wtf/" icon-pack="fas" icon-left="surprise">WTF</n-link>
                        </b-navbar-item>
                        <b-navbar-item tag="div">
                            <n-link to="/reaction/interesting/" icon-pack="fas" icon-left="grin-stars">
                                Interesting
                            </n-link>
                        </b-navbar-item>
                        <b-navbar-item tag="div">
                            <n-link to="/reaction/unbelievable/" icon-pack="fas" icon-left="surprise">
                                Unbelievable
                            </n-link>
                        </b-navbar-item>
                        <b-navbar-item tag="div">
                            <n-link to="/reaction/fun/" icon-pack="fas" icon-left="laugh-beam">Fun
                            </n-link>
                        </b-navbar-item>
                        <b-navbar-item tag="div">
                            <n-link to="/random/" icon-pack="fas" icon-left="random">Random</n-link>
                        </b-navbar-item>
                    </template>
                    <template slot="end">
                        <b-navbar-item tag="div">
                            <b-button type="is-warning" tag="router-link" to="/onthisday/" icon-pack="fas" icon-left="calendar">On This Day
                            </b-button>
                        </b-navbar-item>
                        <b-navbar-item tag="div">
                            <div class="buttons">
                                <div v-if="!$auth.loggedIn" class="button is-primary" @click="isOpen = !isOpen">
                                    <strong>Log in</strong>
                                </div>
                                <n-link v-if="$auth.loggedIn" class="button is-primary" to="/member/me">
                                    <b-icon pack="fa" icon="user"/>
                                    <span>{{convertName($auth.user)}}</span>
                                </n-link>
                            </div>
                        </b-navbar-item>
                    </template>
                </b-navbar>
            </div>
        </header>
        <div>
            <div class="sidebar-bg"></div>
            <div class="container medium">
                <nuxt/>
            </div>
        </div>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    <a href="https://www.thefactwall.com">TFW - TheFactWall.com</a> - The website content
                    is licensed <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY NC 4.0</a>.
                </p>
            </div>
        </footer>
        <b-modal :active.sync="isOpen" has-modal-card>
            <div class="modal-card" style="width: 500px">
                <section class="modal-card-body">
                    <b-field>
                        <b-checkbox-button v-model="logging" :native-value="true" type="is-success">
                            <span>Login</span>
                        </b-checkbox-button>

                        <b-checkbox-button v-model="logging" :native-value="false" type="is-success">
                            <span>Register</span>
                        </b-checkbox-button>
                    </b-field>
                    <b-field label="Username" v-if="!logging">
                        <b-input placeholder="Username" v-model="form.username" maxlength="30"/>
                    </b-field>
                    <b-field label="Email">
                        <b-input placeholder="Email" v-model="form.email" maxlength="30"/>
                    </b-field>
                    <b-field label="Password">
                        <b-input placeholder="Password" v-model="form.password" type="password" maxlength="30"/>
                    </b-field>
                    <b-field>
                        <b-button @click="handle_click">Submit</b-button>
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
                logging: true,
                isOpen: false,
                form: {
                    email: null,
                    password: null,
                    username: null
                }
            }
        },
        methods: {
            handle_click() {
                this.logging ? this.login() : this.register()
            },
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
        },
    }
</script>
