<template>
    <section>
        <b-field>
            <b-autocomplete
                :data="data"
                placeholder="e.g. Spiderman"
                field="title"
                :loading="isFetching"
                @typing="getAsyncData"
                @select="handle_select">
            </b-autocomplete>
            <b-button @click="handle_save">
                <b-icon pack="fa" icon="plus"></b-icon>
            </b-button>
        </b-field>
        <b-collapse :open="false" v-for="c in campaign.crawlers" :key="c._id" class="card bt_16" :aria-id="c._id">
            <div slot="trigger" slot-scope="props" class="card-header" role="button" :aria-controls="c._id">
                <p class="card-header-title">
                    <b-icon pack="fa" icon="spider"></b-icon>
                    <span>{{c._id}}</span>
                </p>
            </div>
            <div class="card-content">
                <b-field grouped group-multiline>
                    <div class="control" v-for="key in Object.keys(c.script.options)" :key="key">
                        <b-taglist attached>
                            <b-tag size="is-medium">{{key}}</b-tag>
                            <b-tag type="is-success" size="is-medium">{{c.script.options[key]}}</b-tag>
                        </b-taglist>
                    </div>
                </b-field>
                <s-job
                    :modify="false" v-if="c.script"
                    v-model="c.script.jobs"
                    @input="$set(c.script, 'jobs' , $event)"/>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item" @click="handle_test(c,false)">
                    <b-icon pack="fa" icon="play"></b-icon>
                </a>
                <a class="card-footer-item" @click="handle_update(c)">Update</a>
                <a class="card-footer-item" @click="handle_test(c._id, true)">Test</a>
                <a class="card-footer-item" @click="handle_delete(c._id)">Delete</a>
            </footer>
        </b-collapse>
    </section>
</template>

<script>

    import debounce from 'lodash/debounce'

    export default {
        props: {
            campaign: {
                type: Object,
            }
        },
        data() {
            return {
                crawler: {
                    script: null,
                    options: {}
                },
                data: [],
                isFetching: false
            }
        },
        methods: {
            getAsyncData: debounce(function (name) {
                if (!name.length) {
                    this.data = []
                    return
                }
                this.isFetching = true
                this.$axios.$get(`/scripts/?search=${name}`)
                    .then(({results}) => {
                        this.data = []
                        results.forEach((item) => this.data.push(item))
                    })
                    .catch((error) => {
                        this.data = []
                        throw error
                    })
                    .finally(() => {
                        this.isFetching = false
                    })
            }, 500),
            handle_select(script) {
                this.crawler.script = script
            },
            async handle_save() {
                let res = await this.$axios.$post(`/campaigns/${this.campaign._id}/crawlers`, this.crawler)
                this.$emit('update', res)
            },
            async handle_delete(id) {
                let res = await this.$axios.$delete(`/campaigns/${this.campaign._id}/crawlers/${id}/`)
                this.$emit('update', res)
            },
            async handle_update(crawler) {
                let res = await this.$axios.$put(`/campaigns/${this.campaign._id}/crawlers/${crawler._id}/`, crawler)
                this.$emit('update', res)
            },
            async handle_test(id, flag) {
                await this.crawl(flag, id, this.campaign._id)
            }
        }
    }
</script>
