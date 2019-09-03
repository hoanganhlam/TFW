<template>
    <div class="columns is-multiline">
        <div v-for="key in keys" :key="key"
             :class="`column ${schema[key]['column'] ? schema[key]['column'] : 'is-6'}`"
             v-if="showField(key)"
        >
            <b-collapse :open="false" v-if="schema[key].dataType === 'OB'" class="card" :aria-id="key">
                <div slot="trigger" slot-scope="props" class="card-header" role="button" :aria-controls="key">
                    <p class="card-header-title">
                        <b-icon pack="fa" icon="cogs"></b-icon>
                        <span>Options</span>
                    </p>
                </div>
                <div class="card-content">
                    <ot-build
                        :parent="form"
                        :placeholder="schema[key].label" :p-fields="schema[key].fields"
                        v-model="form[key]"/>
                </div>
            </b-collapse>
            <b-field v-else :label="schema[key]['label']">
                <d-field :setting="schema[key]" v-model="form[key]"></d-field>
            </b-field>
        </div>
    </div>
</template>

<script>
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
        name: "CrawlerForm",
        props: ['value'],
        data() {
            return {
                form: this.value,
                schema
            }
        },
        methods: {
            showField(key) {
                if (key === 'children') {
                    return false
                }
                if (key === 'urls') {
                    return this.form['loop'] === 'ARRAY' && this.form['action'] === null
                } else if (key === 'url') {
                    return (this.form['loop'] === 'PAGING' || this.form['loop'] === null) && this.form['action'] === 'GOTO'

                } else if (key === 'fields') {
                    return this.form['action'] === 'EXTRACT'
                } else {
                    return true
                }
            }
        },
        computed: {
            keys() {
                return Object.keys(this.schema)
            }
        }
    }
</script>

<style scoped>

</style>
