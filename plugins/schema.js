import Vue from 'vue'

const baseFields = ['createdAt', 'updatedAt']


const SCHEMA = {
    'facts': baseFields.concat(['contentShort', 'taxonomies', 'date', 'contentLong']),
    'taxonomies': baseFields.concat(['title', 'description', 'slug'])
}

const fields = [
    {
        field: 'contentShort',
        label: 'Nội dung',
        type: 'text',
        show: true,
        update: true
    },
    {
        field: 'contentLong',
        label: 'Nội dung',
        type: 'text',
        show: false,
        update: true
    },
    {
        field: 'title',
        label: 'Tiêu đề',
        type: 'text',
        show: true,
        update: true
    },
    {
        field: 'slug',
        label: 'Slug',
        type: 'text',
        show: false,
        update: true
    },
    {
        field: 'description',
        label: 'Mô tả',
        type: 'text',
        show: false,
        update: true
    },
    {
        field: 'taxonomies',
        label: 'Thẻ',
        type: 'tag',
        show: false,
        update: true,
        source: '/taxonomies/',
        filter: true
    },
    {
        field: 'updatedAt',
        label: 'Ngày đăng',
        type: 'date',
        show: false,
        update: true
    },
    {
        field: 'date',
        label: 'Thời gian',
        type: 'date',
        show: false,
        update: true
    },
]

Vue.mixin({
    methods: {
        getSchema(str, flag) {
            let out = fields.filter(item => item.show === flag && SCHEMA[str].indexOf(item.field) !== -1)
            out = out.filter(item => typeof item.model === 'undefined' || item.model.indexOf(str) !== -1)
            return out
        },
        allSchema(str) {
            let out = fields.filter(item => SCHEMA[str].indexOf(item.field) !== -1)
            out = out.filter(item => typeof item.model === 'undefined' || item.model.indexOf(str) !== -1)
            return out
        }
    }
})
