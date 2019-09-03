<template>
    <div v-if="setting">
        <b-switch v-if="setting.dataType ==='boolean'" type="is-success" size="is-small" v-model="data">
            {{setting.label}}
        </b-switch>
        <g-date :placeholder="setting.label" v-else-if="setting.dataType ==='date'" v-model="data"/>
        <g-array :placeholder="setting.label" v-else-if="setting.dataType ==='array'" v-model="data"/>
        <b-select class="fullwidth" :placeholder="setting.label" v-else-if="setting.dataType ==='option'"
                  v-model="data">
            <option v-for="option in setting.options" :value="option.value" :key="option.value">
                {{ option.title }}
            </option>
        </b-select>
        <b-taginput
            :placeholder="setting.label" v-else-if="setting.dataType ==='tag'"
            v-model="data"
            ellipsis
            icon-pack="fa"
            icon="tag"
            placeholder="Add a tag">
        </b-taginput>
        <b-input :placeholder="setting.label" v-else-if="setting.dataType ==='text'" v-model="data"></b-input>
        <b-input :placeholder="setting.label" v-else-if="setting.dataType ==='number'" type="number"
                 v-model="data"></b-input>
        <g-object :placeholder="setting.label" :p-fields="setting.fields" v-else-if="setting.dataType ==='object'"
                  v-model="data"></g-object>
        <o-build v-else-if="setting.dataType ==='arrayO'" v-model="data" @input="data = $event"/>
        <f-build v-else-if="setting.dataType ==='field'" v-model="data" @input="data = $event"/>
        <q-build v-else-if="setting.dataType ==='query'" v-model="data" @input="data = $event"/>
        <div v-else>{{data}}</div>
    </div>
</template>

<script>
    export default {
        name: "DisplayField",
        props: {
            value: {},
            setting: {}
        },
        data() {
            return {
                data: this.value
            }
        },
        watch: {
            data() {
                this.$emit('input', this.data)
            },
            value() {
                this.data = this.value
            }
        }
    }
</script>

<style scoped>

</style>
