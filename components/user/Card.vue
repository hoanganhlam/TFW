<template>
    <div v-if="data">
        <n-link :to="'/member/' + data.username">
            <div class="image">
                <img v-if="avatar" :src="avatar" alt="">
                <img v-else src="/avatar.png" alt="">
            </div>
        </n-link>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            data: {}
        },
        computed: {
            avatar() {
                if (this.data.avatar && this.data.avatar._id) {
                    return this.data.avatar.size['100_100']
                }
                return null
            }
        }
    }
</script>

<style scoped>

</style>
