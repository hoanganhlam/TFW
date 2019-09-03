<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <aside class="menu">
                <div>
                    <b-button class="fullwidth" @click="addCampaign">
                        <b-icon pack="fa" icon="plus"></b-icon>
                    </b-button>
                </div>
                <b-menu-list label="Campaign">
                    <b-menu-item
                        tag="router-link"
                        v-for="app in response.results"
                        :key="app._id" :to="'/campaign/' + app._id"
                        :active="'/campaign/' + app._id === $route.path"
                        :label="app.title"></b-menu-item>
                </b-menu-list>
            </aside>
        </div>
        <div class="tile is-parent is-main">
            <div v-if="campaign" style="width: 100%">
                <div class="bt_32">
                    <b-input class="bt_16" v-model="campaign.title" @blur="update('title')"></b-input>
                    <o-build class="bt_16" v-model="campaign.fields" @input="campaign.fields = $event"/>
                    <div class="button" @click="update('fields')">Save</div>
                </div>
                <div class="bt_32">
                    <c-form :campaign="campaign" @update="campaign = $event"></c-form>
                </div>
                <div class="level" style="margin-bottom: 0">
                    <div class="level-left">
                        <h2 class="title is-3">DATA</h2>
                    </div>
                    <div class="level-right">
                        <b-button style="margin-right: 10px" @click="fetch">
                            <b-icon pack="fa" icon="sort"></b-icon>
                        </b-button>
                        <b-button @click="addNew">
                            <b-icon pack="fa" icon="plus"></b-icon>
                        </b-button>
                    </div>
                </div>
                <b-table
                    :loading="isLoading"
                    :data="campaign.data"
                    ref="table"
                    paginated
                    backend-sorting
                    backend-pagination
                    :total="count"
                    :per-page="pageSize"
                    @page-change="onPageChange"
                    detailed
                    detail-key="_id"
                    icon-pack="fa"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page">
                    <template slot-scope="props">
                        <b-table-column field="title">
                            <d-field :setting="{field: 'title', label: 'Title', dataType: 'text'}"
                                     v-model="props.row['title']"/>
                        </b-table-column>
                    </template>
                    <template slot="detail" slot-scope="props">
                        <d-item :fields="campaign.fields" v-model="props.row.value" @delete="fetch()"
                                @save="handleSave(props.row)"/>
                    </template>
                </b-table>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client'

    export default {
        name: "index.vue",
        components: {},
        async asyncData({app, params}) {
            let response = await app.$axios.$get('/campaigns/')
            let campaign = params.id ? await app.$axios.$get(`/campaigns/${params.id}/`) : null
            return {
                campaign,
                response
            }
        },
        data: () => {
            return {
                count: 0,
                results: [],
                page: 1,
                pageSize: 25,
                isLoading: false,
                socket: io(`${process.env.WS_URL}`),
            }
        },
        head() {
            return {
                title: "CampaignDetail"
            }
        },
        methods: {
            async fetch() {
                this.response = await this.$axios.$get('/campaigns/')
            },
            async addCampaign() {
                let campaign = await this.$axios.$post('/campaigns/', {
                    title: 'New ' + (this.response.total + 1)
                })
                this.response.results.push(campaign)
            },
            onPageChange(page) {
                this.page = page
                this.fetch()
            },
            async addNew() {
                let _this = this
                this.$buefy.dialog.prompt({
                    message: `What's the title of this?`,
                    inputAttrs: {
                        placeholder: 'e.g. Ha Noi'
                    },
                    onConfirm: async (value) => {
                        _this.campaign = await this.$axios.$post(`/campaigns/${this.campaign._id}/data/`, {
                            data: {
                                title: value,
                                value: {
                                    created: new Date()
                                }
                            }
                        })
                    }
                })
            },
            async update(field) {
                await this.$axios.$put(`/campaigns/${this.campaign._id}/`, {
                    [field]: this.campaign[field],
                })
            },
            handleSave(data) {
                this.$axios.$put(`/campaigns/${this.campaign._id}/data/${data._id}`, data)
            }
        },
        mounted() {
            this.socket.on('data', (data) => {
                console.log(data);
            })
            this.socket.on('error', (data) => {
                console.log(data);
            })
        },
    }
</script>

<style scoped>

</style>
