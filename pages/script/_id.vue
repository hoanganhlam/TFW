<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <aside class="menu">
                <div>
                    <b-button class="fullwidth" @click="addCrawler()">
                        <b-icon pack="fa" icon="plus"></b-icon>
                    </b-button>
                </div>
                <b-menu-list label="Script">
                    <b-menu-item
                        tag="router-link"
                        v-for="app in response.results"
                        :key="app._id" :to="'/script/' + app._id"
                        :active="'/script/' + app._id === $route.path"
                        :label="app.title"></b-menu-item>
                </b-menu-list>
            </aside>
        </div>
        <div class="tile is-parent is-main">
            <div v-if="script" style="width: 100%">
                <div class="bt_16">
                    <b-input v-model="script.title"></b-input>
                </div>
                <q-build class="bt_16" v-model="script.options" @input="script.options = $event"/>
                <s-job class="bt_16" :schema="schema" :value="script.jobs" @input="script.jobs = $event"/>
                <div class="buttons">
                    <b-button @click="saveScript()">
                        <b-icon pack="fa" icon="save"></b-icon>
                        <span>Update</span>
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client'

    const schema = {
        "key": {
            dataType: 'text',
            label: 'Key'
        },
        "title": {
            dataType: 'text',
            label: 'Title'
        },
        "loop": {
            dataType: 'option',
            label: 'Loop',
            options: [
                {
                    title: 'Mảng',
                    value: 'ARRAY'
                },
                {
                    title: 'Phân trang',
                    value: 'PAGING'
                },
                {
                    title: 'Lazy loading',
                    value: 'LAZY'
                },
                {
                    title: 'Cơ bản',
                    value: 'BASIC'
                }
            ]
        },
        "action": {
            dataType: 'option',
            label: 'Action',
            options: [
                {
                    title: 'Đi đến',
                    value: 'GOTO'
                },
                {
                    title: 'Nhấp chuôt',
                    value: 'CLICK'
                },
                {
                    title: 'Lùi trang',
                    value: 'BACK'
                },
                {
                    title: 'Nhập text',
                    value: 'INPUT'
                },
                {
                    title: 'Bóc dữ liệu',
                    value: 'EXTRACT'
                }
            ]
        },
        "fields": {
            dataType: 'field',
            label: 'Fields',
            column: 'is-12',
            condition: {
                field: 'action',
                value: 'EXTRACT',
            }
        },
        "urls": {
            dataType: 'tag',
            label: 'Urls',
            column: 'is-12',
            condition: {
                field: 'loop',
                value: 'ARRAY',
            }
        },
        "url": {
            dataType: 'text',
            label: 'Url',
            column: 'is-12',
            condition: {
                field: 'action',
                value: 'GOTO',
            }
        },
        "options": {
            dataType: 'OB',
            label: 'Option',
            column: 'is-12',
            fields: [
                {
                    field: 'key',
                    label: 'Data key',
                    dataType: 'text',
                    column: 'is-6',
                },
                {
                    field: 'field',
                    label: 'Data field',
                    dataType: 'text',
                    column: 'is-6',
                },
                {
                    field: 'max',
                    label: 'Max page',
                    dataType: 'number',
                    column: 'is-6',
                },
                {
                    field: 'kind',
                    label: 'css or xpath',
                    dataType: 'text',
                    column: 'is-6',
                },
                {
                    field: 'target',
                    label: 'Target',
                    dataType: 'text',
                    column: 'is-6',
                },
                {
                    field: 'value',
                    label: 'Value',
                    dataType: 'text',
                    column: 'is-6',
                },
                {
                    field: 'params',
                    label: 'Query params',
                    dataType: 'query',
                    column: 'is-12',
                },
            ]
        }
    }
    export default {
        name: "ScriptDetail",
        async asyncData({app, params}) {
            let script = params.id ? await app.$axios.$get(`/scripts/${params.id}/`) : null
            return {
                script: script
            }
        },
        data() {
            return {
                schema: schema,
                socket: io(`${process.env.WS_URL}`),
                response: {
                    total: 0,
                    results: []
                }
            }
        },
        methods: {
            async fetch() {
                this.response = await this.$axios.$get(`/scripts/`)
            },
            addCrawler() {
                this.$buefy.dialog.prompt({
                    message: `What's script name?`,
                    inputAttrs: {
                        placeholder: 'e.g. Spiderman',
                        maxlength: 10
                    },
                    onConfirm: async (value) => {
                        let res = await this.$axios.$post(`/scripts/`, {
                            title: value
                        })
                        this.$router.replace({path: `/script/${res._id}/`})
                    }
                })
            },
            saveScript() {
                this.$axios.$put(`/scripts/${this.script._id}/`, {
                    title: this.script.title,
                    jobs: this.script.jobs,
                    options: this.script.options
                })
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
        created() {
            this.fetch()
        }
    }
</script>

<style scoped>

</style>
