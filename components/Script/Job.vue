<template>
    <div>
        <b-collapse :open="false" v-for="job in listJob" :key="job.key" class="card bt_16" :aria-id="job.key">
            <div slot="trigger" slot-scope="props" class="card-header" role="button" :aria-controls="job.key">
                <p class="card-header-title">
                    <b-icon pack="fa" icon="align-justify"></b-icon>
                    <span>{{job.title}}</span>
                </p>
                <div class="card-header-icon" @click="handleRemove(job.key)">
                    <b-icon pack="fa" icon="times"></b-icon>
                </div>
            </div>
            <div class="card-content">
                <div class="card">
                    <div class="card-content">
                        <s-form :schema="schema" :value="job" @input="job = $event"></s-form>
                    </div>
                </div>
                <s-job :schema="schema" v-model="job.children"></s-job>
            </div>
        </b-collapse>
        <b-button @click="handleAdd" v-if="modify">
            <b-icon pack="fa" icon="plus"></b-icon>
            <span>Add sub-task</span>
        </b-button>
    </div>
</template>

<script>
    export default {
        name: "CrawlerJob",
        props: {
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            schema: {},
            modify: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                listJob: this.value,

            }
        },
        watch: {
            value() {
                this.listJob = this.value
            },
            listJob() {
                this.$emit('input', this.listJob)
            }
        },
        methods: {
            handleAdd() {
                this.listJob.push({
                    "key": this.uniqueID(),
                    "title": null,
                    "action": null,
                    "loop": null,
                    "fields": [],
                    "urls": [],
                    "url": null,
                    "options": {
                        "max": 0,
                        "target": null,
                        "key": null,
                        "params": {},
                    },
                    "children": []
                })
            },
            handleRemove(key) {
                for (let i = 0; i < this.listJob.length; i++) {
                    if (this.listJob[i]['key'] === key) {
                        this.listJob.splice(i, 1)
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
