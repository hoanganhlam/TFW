import Vue from 'vue'

const baseFields = ['createdAt', 'updatedAt']


const SCHEMA = {
    'facts': baseFields.concat(['contentShort', 'textTaxonomies', 'date', 'contentLong', 'search', 'photo']),
    'taxonomies': baseFields.concat(['title', 'description', 'slug', 'isObject', 'kind', 'search'])
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
        field: 'search',
        label: 'Tìm kiếm',
        type: 'text',
        show: false,
        update: false,
        filter: true
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
        field: 'textTaxonomies',
        label: 'Thẻ',
        type: 'hashtag',
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
    {
        field: 'kind',
        label: 'Kiểu',
        type: 'hashtag',
        show: false,
        update: true
    },
    {
        field: 'isObject',
        label: 'Đối tượng',
        type: 'boolean',
        show: false,
        update: true
    },
    {
        field: 'photo',
        label: 'Hình ảnh',
        type: 'photo',
        show: false,
        update: true
    }
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
