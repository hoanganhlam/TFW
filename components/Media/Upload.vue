<template>
    <section>
        <b-field>
            <b-upload v-model="dropFiles" multiple drag-drop>
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
        <div class="tags">
            <span v-for="(file, index) in dropFiles"
                  :key="index"
                  class="tag is-primary">
                {{file.name}}
                <button class="delete is-small"
                        type="button"
                        @click="deleteDropFile(index)">
                </button>
            </span>
        </div>
        <div>
            <b-button @click="handleUpload">Upload</b-button>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'Upload',
        data() {
            return {
                dropFiles: []
            }
        },
        methods: {
            deleteDropFile(index) {
                this.dropFiles.splice(index, 1)
            },

            async handleUpload() {
                for (let i = 0; i < this.dropFiles.length; i++) {
                    await this.upload(this.dropFiles[i])
                }
                this.$emit('done')
            },
            async upload(file) {
                this.loading = true
                let formData = new FormData()
                formData.append('title', file.name)
                formData.append('path', file)
                await this.$axios.post('/media/media/', formData)
                this.loading = false
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
