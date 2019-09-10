<template>
    <section>
        <figure class="image" v-if="value">
            <img :alt="value.title" :src="'/' + value.path">
        </figure>
        <b-field>
            <b-upload v-model="dropFiles" :multiple="multiple" drag-drop>
                <section class="section">
                    <div class="content has-text-centered">
                        <p>
                            <b-icon icon="upload" pack="fa" size="is-large"></b-icon>
                        </p>
                        <p>Drop your files here or click to upload</p>
                    </div>
                </section>
            </b-upload>
        </b-field>
        <div class="tags" v-if="multiple">
            <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
                {{file.name}}
                <button class="delete is-small" type="button" @click="deleteDropFile(index)"></button>
            </span>
        </div>
        <div class="tags" v-else>
            <span v-if="dropFiles" class="tag is-primary">
                {{dropFiles.name}}
                <button class="delete is-small" type="button" @click="dropFiles = null"></button>
            </span>
        </div>
        <div>
            <b-button class="is-fullwidth" @click="handleUpload">Upload</b-button>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'Upload',
        props: {
            value: {},
            multiple: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                dropFiles: this.multiple ? [] : null
            }
        },
        methods: {
            deleteDropFile(index) {
                this.dropFiles.splice(index, 1)
            },

            async handleUpload() {
                let results = this.multiple ? [] : null
                if (this.multiple) {
                    for (let i = 0; i < this.dropFiles.length; i++) {
                        results.push(await this.upload(this.dropFiles[i]))
                    }
                } else if (this.dropFiles) {
                    results = await this.upload(this.dropFiles)
                }
                this.dropFiles = this.multiple ? [] : null
                this.$emit('input', results)
            },
            async upload(file) {
                let formData = new FormData()
                formData.append('file', file)
                return await this.$axios.$post('/files/', formData)

            },
        }
    }
</script>
<style lang="scss">
    .upload {
        width: 100%;

        .upload-draggable {
            width: 100%;
            border-radius: 0;
        }
    }
</style>
