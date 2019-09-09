<template>
    <div>
        <div class="columns is-multiline">
            <div v-for="image in selected" :key="image.id" class="column is-2">
                <div class="image 1by1 selectable" @click="select(image)">
                    <img :src="image.thumbnails['thumb_200_200']" alt="">
                </div>
            </div>
        </div>
        <div class="columns">
            <div v-for="image in response.results" :key="image.id" :class="`column ${column}`">
                <div
                    @click="select(image)"
                    class="image 1by1 selectable"
                    v-bind:class="{'selected': isSelected(image) !== -1}">
                    <img :src="image.thumbnails['thumb_200_200']" alt="">
                    <i v-if="isSelected(image) !== -1" class="fas fa-check"></i>
                </div>
            </div>
        </div>
        <div class="level">
            <div class="level-left">
                <b-button @click="isOpen = !isOpen">Upload</b-button>
            </div>
            <div class="level-right">
                <b-pagination
                    icon-pack="fa"
                    :total="response.count"
                    :current.sync="current"
                    @change="current = $event"
                    :simple="true"
                    :per-page="size"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page">
                </b-pagination>
            </div>
        </div>
        <b-modal :active.sync="isOpen" has-modal-card>
            <div class="modal-card" style="width: 500px">
                <section class="modal-card-body">
                    <gm-upload @done="() => {fetch(); isOpen=false}"></gm-upload>
                </section>
            </div>
        </b-modal>
    </div>
</template>

<script>
    export default {
        name: "Browser",
        props: {
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            size: {
                type: Number,
                default: 6
            }
        },
        data() {
            return {
                selected: this.value,
                current: 1,
                response: {
                    results: [],
                    count: 0
                },
                isOpen: false
            }
        },
        methods: {
            async fetch() {
                let query = {
                    page_size: this.size,
                    page: this.current,
                    ordering: '-id'
                }
                this.response = await this.$axios.$get('/media/media/', {
                    params: query
                })
            },
            isSelected(image) {
                let temp = this.selected.map(x => x.id)
                return temp.indexOf(image.id)
            },
            select(image) {
                let index = this.isSelected(image)
                if (index === -1) {
                    this.selected.push(image)
                } else {
                    this.selected.splice(index, 1)
                }
            }
        },
        watch: {
            current() {
                this.fetch()
            },
            selected() {
                this.$emit('input', this.selected)
            }
        },
        computed: {
            column() {
                return `is-${12 / this.size}`
            }
        },
        created() {
            this.fetch()
        }
    }
</script>

<style scoped>

</style>
