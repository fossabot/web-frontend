<template>
    <nav class="navbar">
        <div class="navbar-brand">
            <a class="navbar-item">LEXIC</a>
            <a class="navbar-burger" @click="mobileMenu" v-bind:class="{'is-active': menuExpanded}">
                <span></span>
                <span></span>
                <span></span>
            </a>
        </div>
        <div class="navbar-menu" v-bind:class="{'is-active': menuExpanded}">
            <user-badge></user-badge>
        </div>
    </nav>

</template>

<script>
    import userBadge from './UserBadge'

    export default {
        name: 'site-header',
        data () {
            return {
                menuExpanded: false
            }
        },


        components: {
            userBadge
        },
        methods: {
            mobileMenu() {
                this.menuExpanded = !this.menuExpanded
            },
        }

    }
</script>

<style>
    .site-header {
        grid-area: header;
        background: #FBB731;
        padding: 10px;
    }

</style>
