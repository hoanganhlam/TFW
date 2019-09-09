<template>
    <div></div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            user: {

            }
        },
        computed: {
            avatar() {
                if (this.user.avatar) {
                    if (this.user.avatar._id) {
                        return this.user.avatar
                    } else if (this.user.avatar.length) {
                        return this.user.avatar[0]
                    }
                }
                return null
            }
        }
    }
</script>

<style scoped>

</style>
