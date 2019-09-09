<template>
    <div></div>
</template>

<script>
    import LoginForm from '../user/Login'
    import Uploader from '../media/Uploader'
    import debounce from 'lodash/debounce';
    import moment from "moment";

    export default {
        name: "Post",
        props: ['fact'],
        data() {
            this.fetchTopic = debounce(this.fetchTopic, 500);
            this.fetchUrl = debounce(this.fetchUrl, 500);
            return {
                topics: [],
                fetching: false,
                visible: false,
                topicName: null,
                photoSelected: null,
                form: {
                    contentShort: null,
                    contentLong: null,
                    photo: null,
                    taxonomies: [],
                    source: {
                        url: null,
                        title: null,
                        description: null
                    },
                    date: null
                }
            }
        },
        methods: {
            fetchTopic(value) {
                this.data = []
                this.fetching = true
                this.$api.taxonomy.list({search: value}).then(res => {
                    this.topics = res.results
                    this.fetching = false
                })
            },
            handleSelectPhoto(e) {
                this.photoSelected = e
                if (e) {
                    this.form.photo = e._id
                }
            },
            handleSubmit() {
                this.$message.config({top: '80%'})
                if (this.fact && this.fact._id) {
                    this.$api.fact.update(this.fact._id, this.form).then(res => {
                        this.$message.success('Updated successfully!');
                        this.$emit('done', res)
                        this.$router.replace({path: '/' + this.fact._id})
                    })
                } else {
                    this.$api.fact.post(this.form).then(res => {
                        this.$message.success('created successfully!');
                        this.$router.replace({path: '/' + res._id})
                    })
                }
            },
            handleChange(selectedTopic) {
                this.form.taxonomies = selectedTopic
            },
            async fetchUrl() {
                let regexUrl = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
                if (this.form.source.url && this.form.source.url.match(regexUrl)) {
                    await this.$axios.get('/utilities/scrape?url=' + this.form.source.url).then(res => {
                        this.form.source.title = res.data.title
                        this.form.source.description = res.data.metaDescription
                    })
                }
            },
            async createTopic() {
                let res = await this.$api.taxonomy.post({title: this.topicName})
                this.topics.push(res)
                this.form.taxonomies.push(res._id)
                this.visible = false
                this.topicName = null
            }
        },
        components: {
            LoginForm,
            Uploader,
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes
            }
        },
        created() {
            if (this.fact) {
                this.topics = this.fact.taxonomies
                for (let field in this.fact) {
                    if (this.fact[field] && field !== '_id') {
                        if (field === 'taxonomies') {
                            this.form[field] = this.fact[field].map(x => x._id)
                        } else if (field === 'media') {
                            this.form[field] = this.fact[field]._id
                        } else if (field === 'date') {
                            this.form[field] = moment(this.fact[field], 'YYYY-MM-DD')
                        } else {
                            this.form[field] = this.fact[field]
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
