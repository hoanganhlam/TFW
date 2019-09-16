<template>
    <div style="position: relative; min-height: 100vh">
        <div>
            <div class="container medium">
                <nuxt/>
                <div></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                response: {
                    results: [],
                    total: 0
                },
                isOpen: false,
                form: {
                    email: null,
                    password: null,
                    username: null
                }
            }
        }
    }
</script>
