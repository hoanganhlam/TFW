<template>
    <div style="width: 100%; min-height: calc(100vh - 170px); padding: 2rem 0;">
        <div class="columns">
            <div class="column" v-for="column in filters" :key="column.field">
                <d-field :setting="column" v-model="filter[column.field]"/>
            </div>
            <div class="column" style="text-align: right">
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
            :data="results"
            :columns="columns"
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
                <b-table-column
                    v-for="column in columns" :key="column.field"
                    :field="column.field" :label="column.label">
                    <d-field :setting="column" v-model="props.row[column.field]"/>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <d-item v-model="props.row" @delete="fetch()" @create="fetch()" :title="props.row['title']"/>
            </template>
        </b-table>
    </div>
</template>

<script>
    import DField from '../../../components/DisplayField'
    import DItem from '../../../components/DisplayItem'

    export default {
        name: "ManagerModel",
        components: {
            'd-field': DField,
            'd-item': DItem
        },
        data: () => {
            return {
                count: 0,
                results: [],
                page: 1,
                pageSize: 25,
                isLoading: false,
                filter: {}
            }
        },
        head() {
            return {
                title: "Model"
            }
        },
        layout: 'blank',
        methods: {
            async fetch() {
                this.isLoading = true
                this.pageSize = this.$route.query.page_size || 25
                let query = {}
                for (let i in this.filter) {
                    if (Array.isArray(this.filter[i])) {
                        let temp = []
                        this.filter[i].forEach(x => {
                            temp.push(x.id)
                        })
                        query[i] = temp.toString()
                    } else if (typeof this.filter[i] === "object" && this.filter[i] && this.filter[i]['_id']) {
                        query[i] = this.filter[i].id
                    } else if (this.filter[i]) {
                        query[i] = this.filter[i]
                    }
                }
                query.page = this.page
                query.page_size = this.pageSize
                let res = await this.$axios.$get(this.$route.path.replace('/manager', ''), {
                    params: query
                }).catch(err => {
                    console.log(err);
                })
                this.results = []
                this.count = res.total
                this.results = res.results
                this.results.forEach(item => {
                    if (item.taxonomies && item.taxonomies.length) {
                        let textTaxonomies = []
                        item.taxonomies.forEach(tag => {
                            if (tag) {
                                textTaxonomies.push(tag.title)
                            }
                        })
                        item.textTaxonomies = textTaxonomies
                    }
                })
                this.isLoading = false
            },
            onPageChange(page) {
                this.page = page
                this.fetch()
            },
            addNew() {
                this.results.unshift({})
            }
        },
        created() {
            if (this.$auth.loggedIn && this.$auth.user.email === 'lam@trip.vn') {
                this.fetch()
            } else {
                this.$router.replace({path: '/'})
            }

        },
        computed: {
            columns() {
                return this.getSchema(this.$route.params.model, true)
            },
            filters() {
                return this.allSchema(this.$route.params.model).filter(x => x.filter === true)
            }
        }
    }
</script>

<style scoped>

</style>
