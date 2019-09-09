<template>
    <div></div>
</template>

<script>
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this);
        },
        data: () => {
            return {
                form: {
                    username: null,
                    email: null,
                    name: null,
                    password: null
                },
                login: true,
                validForm: {}
            }
        },
        methods: {
            async handleSubmit() {
                if (this.login) {
                    let res = await this.$auth.loginWith('local', {
                        data: this.form
                    })
                    console.log(res);
                } else {
                    await this.$api.user.post(this.form)
                }
            }
        },
    };
</script>
<style>

</style>
