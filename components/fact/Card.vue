<template>
    <div class="card fact-card"
         v-bind:class="{'no-image': hasImage}">
        <div class="card-image">
            <figure class="image" v-if="fact.photo">
                <img v-if="fact.photo && fact.photo.size" :alt="fact.photo.title"
                     :src="'/' + (cover ? fact.photo.size['200_200'] : fact.photo.path)">
            </figure>
        </div>
        <div class="card-content">
            <div class="bt_16" v-if="fact.taxonomies.length && !cover">
                <div class="buttons">
                    <b-button tag="router-link" size="is-small"
                              v-for="topic in fact.taxonomies" :key="topic._id" :to="`/topic/${topic.slug}/`"
                              v-if="topic">{{topic.title}}</b-button>
                </div>
            </div>
            <p :class="cover ? '' : 'title is-4'">
                <n-link :to="'/' + fact._id" class="bt_32" v-bind:class="{'title': hasImage}">“{{fact.contentShort}}”</n-link>
            </p>
            <template v-if="fact.user">
                <small>
                    <n-link :to="'/member/' + fact.user.username">{{convertName(fact.user)}}</n-link>
                </small>
            </template>
        </div>
        <footer class="card-footer">
            <div class="card-footer-item" @click="toggleVote(1)">
                <b-icon :pack="checkVoted(1) ? 'fas' : 'far'" icon="grin-stars"></b-icon>
            </div>
            <div class="card-footer-item" @click="toggleVote(2)">
                <b-icon :pack="checkVoted(2) ? 'fas' : 'far'" icon="surprise"></b-icon>
            </div>
            <div class="card-footer-item" @click="toggleVote(3)">
                <b-icon :pack="checkVoted(3) ? 'fas' : 'far'" icon="surprise"></b-icon>
            </div>
            <div class="card-footer-item" @click="toggleVote(4)">
                <b-icon :pack="checkVoted(4) ? 'fas' : 'far'" icon="laugh-beam"></b-icon>
            </div>
        </footer>
    </div>
</template>

<script>

    export default {
        name: "FactCard",
        props: {
            fact: {},
            cover: {
                default: true,
                type: Boolean
            }
        },
        data() {
            return {
                isVoted: this.fact.isVoted,
                showSource: false,
                factCopy: this.fact
            }
        },
        methods: {
            async toggleVote(value) {
                if (this.$auth.loggedIn) {
                    let data = {
                        value: value,
                    }
                    if (this.checkVoted(value)) {
                        data.value = 0
                    }
                    this.isVoted = await this.$axios.$post(`/facts/${this.fact._id}/vote/`, data)
                } else {
                    this.$buefy.snackbar.open({
                        message: 'Sorry, You must login to vote this!',
                        type: 'is-warning',
                        position: 'is-bottom',
                        actionText: 'OK'
                    })
                }
            },
            checkVoted(value) {
                return this.isVoted && value === this.isVoted.value
            },
            async handleUpdate(id, dataIndex, value) {
                let data = {}
                data[dataIndex] = value
                this.factCopy = await this.$api.fact.update(id, data)
            },
            async handleDelete() {
                await this.$api.fact.delete(this.fact._id)
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
            },
            hasImage() {
                return typeof this.fact.photo === 'undefined' || (this.fact.photo === null)
            }
        },
        watch: {
            fact() {
                this.factCopy = this.fact
            }
        }
    }
</script>

<style lang="scss">
</style>
