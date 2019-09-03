import Vue from 'vue'

const baseFields = ['updated', 'created']
const makerFields = ['coordinates', 'address', 'g_place_id']
const taxonomyFields = ['title', 'description']

const SCHEMA = {
    'destinations': makerFields.concat(['nation', 'poster', 'photos', 'tags', 'staff', 'is_approve',]),
    'points': makerFields.concat(['tags', 'destination', 'poster', 'photos', 'kind', 'staff', 'is_approve', 'extra']),
    'services': taxonomyFields.concat(['poster', 'photos', 'tags', 'is_special', 'is_approve', 'kind']),
    'point-services': ['service', 'point', 'price', 'max_quantity', 'photos', 'is_approve', 'poster', 'extra'],
}

const fields = [
    {
        field: 'title',
        label: 'Tiêu đề',
        type: 'text',
        show: true,
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
        field: 'coordinates',
        label: 'Tọa độ',
        type: 'array',
        show: false,
        update: true
    },
    {
        field: 'address',
        label: 'Địa chỉ',
        type: 'text',
        show: false,
        update: true
    },
    {
        field: 'contact',
        label: 'Liên hệ',
        type: 'object',
        show: false,
        update: true
    },
    {
        field: 'extra',
        label: 'Bổ xung',
        type: 'object',
        show: false,
        update: true
    },
    {
        field: 'continent',
        label: 'Lục địa',
        type: 'option',
        show: false,
        update: true,
        options: [
            {
                title: 'Châu mỹ',
                value: 'americas',
                coordinates: [-105.25511870000003, 54.5259614]
            },
            {
                title: 'Châu Á',
                value: 'asia',
                coordinates: [100.61965529999998, 34.047863]
            },
            {
                title: 'Châu Phi',
                value: 'africa',
                coordinates: [34.50852299999997, -8.783195]
            },
            {
                title: 'Châu Úc',
                value: 'australia',
                coordinates: [140.01876530000004, -22.7359095]
            },
            {
                title: 'Châu Âu',
                value: 'europe',
                coordinates: [15.255118700000025, 54.5259614]
            }
        ]
    },
    {
        field: 'areas',
        label: 'Khu vực',
        type: 'generic',
        show: false,
        update: true,
        source: '/destination/areas/'
    },
    {
        field: 'nation',
        label: 'Quốc gia',
        type: 'generic',
        show: false,
        update: true,
        source: '/destination/nations/',
        filter: true
    },
    {
        field: 'destination',
        label: 'Điểm đến',
        type: 'generic',
        show: false,
        update: true,
        source: '/destination/destinations/',
        filter: true
    },
    {
        field: 'created',
        label: 'Ngày tạo',
        type: 'date',
        show: true,
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
