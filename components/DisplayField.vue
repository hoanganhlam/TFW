<template>
    <div>
        <b-switch v-if="setting.type ==='boolean'" type="is-success" size="is-small" v-model="data">Approve</b-switch>
        <g-date :placeholder="setting.label" v-else-if="setting.type ==='date'" v-model="data"/>
        <g-array :placeholder="setting.label" v-else-if="setting.type ==='array'" v-model="data"/>
        <b-select :placeholder="setting.label" v-else-if="setting.type ==='option'" v-model="data">
            <option v-for="option in setting.options" :value="option.value" :key="option.value">
                {{ option.title }}
            </option>
        </b-select>
        <g-select
            :placeholder="setting.label"
            v-else-if="setting.type ==='generic'"
            :endpoint="setting.source" v-model="data"
            :field="setting.showField"
        ></g-select>
        <g-tag
            :placeholder="setting.label"
            v-else-if="setting.type ==='tag'"
            :endpoint="setting.source" v-model="data"
            :field="setting.showField"></g-tag>
        <b-input :placeholder="setting.label" v-else-if="setting.type ==='text'" v-model="data"></b-input>
        <b-input :placeholder="setting.label" v-else-if="setting.type ==='number'" type="number" v-model="data"></b-input>
        <gm-browser :placeholder="setting.label" v-else-if="setting.type ==='gallery'" v-model="data"></gm-browser>
        <gm-upload :multiple="false" :placeholder="setting.label" v-else-if="setting.type ==='photo'" v-model="data"></gm-upload>
        <g-object :placeholder="setting.label" v-else-if="setting.type ==='object'" v-model="data"></g-object>
        <b-taginput
            v-else-if="setting.type ==='hashtag'"
            v-model="data"
            ellipsis
            icon-pack="fa"
            icon="tag"
            placeholder="Add a tag">
        </b-taginput>
        <div v-else>
            {{data}}
        </div>
        <div v-if="descriptions.length">
            <hr class="is-small">
            <div style="margin-top: 1rem" class="example bt_32">
                <div class="button-left">Gợi ý</div>
                <div class="example-component">
                    <p v-for="(d, i) in descriptions" @click="data=d" style="margin-bottom: 0.5rem" :key="i">{{d}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DisplayField",
        props: {
            value: {},
            setting: {},
            title: {
                default: null,
                type: String
            }
        },
        data() {
            return {
                data: this.value,
                descriptions: []
            }
        },
        watch: {
            data() {
                this.$emit('input', this.data)
            },
            value() {
                this.data = this.value
            }
        },
        async created() {
            if (this.setting.field === 'description') {
                let res = await this.getDescription(this.title)
                this.descriptions = res.results[2]
            }
        }
    }
</script>

<style scoped>

</style>
