<template>
    <div style="position: relative; min-height: 100vh">
        <b-navbar style="border-bottom: 1px solid #DDD;">
            <template slot="brand">
                <b-navbar-item tag="router-link" class="logo" to="/">
                    <span class="second">The</span>
                    <span class="second">FactWall</span>
                    <span class="first">.com</span>
                </b-navbar-item>
            </template>
            <template slot="start">
                <b-navbar-item tag="div">
                    <b-button tag="router-link" to="/reaction/wtf/" icon-pack="fas" icon-left="surprise">WTF</b-button>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <b-button tag="router-link" to="/reaction/interesting/" icon-pack="fas" icon-left="grin-stars">Interesting</b-button>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <b-button tag="router-link" to="/reaction/unbelievable/" icon-pack="fas" icon-left="surprise">Unbelievable</b-button>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <b-button tag="router-link" to="/reaction/fun/" icon-pack="fas" icon-left="laugh-beam">Fun</b-button>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <b-button tag="router-link" to="/random/" icon-pack="fas" icon-left="random">Random</b-button>
                </b-navbar-item>
                <b-navbar-item tag="div">
                    <b-button tag="router-link" to="/onthisday/" icon-pack="fas" icon-left="calendar">On This Day</b-button>
                </b-navbar-item>
            </template>
            <template slot="end">
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
                    <a href="https://www.thefactwall.com">TFW - TheFactWall</a>. The website content
                    is licensed <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY NC 4.0</a>.
                </p>
            </div>
        </footer>
        <b-modal :active.sync="isOpen" :can-cancel="false" has-modal-card>
            <div class="modal-card" style="width: 500px">
                <section class="modal-card-body">
                    <b-field label="Username">
                        <b-input v-model="form.username" maxlength="30"/>
                    </b-field>
                    <b-field label="Email">
                        <b-input v-model="form.email" maxlength="30"/>
                    </b-field>
                    <b-field label="Password">
                        <b-input v-model="form.password" type="password" maxlength="30"/>
                    </b-field>
                    <b-field>
                        <div class="buttons">
                            <b-button @click="login">Đăng nhập</b-button>
                            <b-button @click="register">Đăng ký</b-button>
                        </div>
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
                    email: null,
                    password: null,
                    username: null
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
        },
        async created() {
            if (!this.$auth.loggedIn) {
                this.isOpen = true
            }
        }
    }
</script>
