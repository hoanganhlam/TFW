<template>
    <div class="tile is-ancestor" style="margin-top: 0; margin-bottom: 0">
        <div class="tile is-vertical is-3" style="margin-top: 1rem">
            <aside class="menu">
                <b-menu-list label="Menu">
                    <b-menu-item tag="router-link" :to="'/campaign/'" label="Campaign"></b-menu-item>
                    <b-menu-item tag="router-link" :to="'/script/'" label="Script"></b-menu-item>
                </b-menu-list>
            </aside>
        </div>
        <div class="tile is-parent is-main">

        </div>
    </div>
</template>

<script>

    export default {
        name: 'HomePage',
        components: {}
    }
</script>
