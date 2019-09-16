<template>
    <div>
        <b-switch   v-if="setting.type ==='boolean'" type="is-success" size="is-small" v-model="data">Approve</b-switch>
        <f-datetime v-else-if="setting.type ==='date'" :placeholder="setting.label"  v-model="data"/>
        <f-array    v-else-if="setting.type ==='array'" :placeholder="setting.label" v-model="data"/>
        <b-select   v-else-if="setting.type ==='option'" :placeholder="setting.label" v-model="data">
            <option v-for="option in setting.options" :value="option.value" :key="option.value">
                {{ option.title }}
            </option>
        </b-select>
        <f-json     v-else-if="setting.type ==='object'"  v-model="data" :placeholder="setting.label" :p-fields="setting.fields"/>
        <f-select   v-else-if="setting.type ==='generic'" :placeholder="setting.label" :endpoint="setting.source" v-model="data" :field="setting.showField"/>
        <f-tag      v-else-if="setting.type ==='tag'" :placeholder="setting.label" :endpoint="setting.source" v-model="data" :field="setting.showField"></f-tag>
        <b-input    v-else-if="setting.type ==='text'" :placeholder="setting.label" v-model="data"></b-input>
        <b-input    v-else-if="setting.type ==='number'" :placeholder="setting.label" type="number"
                 v-model="data"></b-input>
        <gm-browser v-else-if="setting.type ==='gallery'" :placeholder="setting.label" v-model="data"/>
        <gm-upload  v-else-if="setting.type ==='photo'" :multiple="false" :placeholder="setting.label" v-model="data"/>
        <f-object   v-else-if="setting.type ==='object'" :placeholder="setting.label" v-model="data"/>
        <b-taginput v-else-if="setting.type ==='hashtag'" v-model="data" ellipsis icon-pack="fa" icon="tag" placeholder="Add a tag"></b-taginput>
        <div        v-else>{{data}}</div>
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
    import BArray from './builder/Array'
    import BDatetime from './builder/Array'
    import BObject from './builder/Object'
    import BSelect from './builder/Select'
    import BTag from './builder/Tag'
    import BJson from './builder/Json'


    export default {
        name: "DisplayField",
        components: {
            'f-array': BArray,
            'f-datetime': BDatetime,
            'f-object': BObject,
            'f-select': BSelect,
            'f-tag': BTag,
            'f-json': BJson,

        },
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
