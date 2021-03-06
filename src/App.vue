<template>
    <div id="app">
        <div v-if="isInitiated || !isAuthenticated" class="container">
            <vue-progress-bar></vue-progress-bar>
            <site-header class="site-header"></site-header>
            <site-nav class="sidebar"></site-nav>
            <router-view class="content"></router-view>
            <site-footer class="site-footer"></site-footer>
        </div>
        <div v-else>
            <site-loading/>
        </div>
    </div>
</template>

<script>
    // Imports
    import authApi from "./api/auth/auth";
    import siteHeader from "./components/header/SiteHeader";
    import siteFooter from "./components/footer/SiteFooter";
    import siteNav from "./components/sidebar/Sidebar";
    import siteLoading from "./pages/Loading";
    import {mapGetters} from 'vuex'


    export default {
        name: "app",
        components: {
            siteHeader,
            siteFooter,
            siteNav,
            siteLoading
        },

        computed: {
            ...mapGetters({
                isInitiated: "getInitiated",
                isAuthenticated: "isAuthenticated"
            })
        },

        created() {

            const token = localStorage.getItem("access_token");
            const expiration = localStorage.getItem("expiration");
            if (token && expiration > Date.now()) {
                this.init();
            } else if (token && expiration < Date.now()) {
                authApi
                    .refresh()
                    .then(res => {
                        localStorage.setItem("access_token", res.data.access_token);
                        localStorage.setItem(
                            "expiration",
                            res.data.expires_in * 1000 + Date.now()
                        );
                        this.init();
                    })
                    .catch(() => {
                        console.warn("could not refresh token");
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("expiration");
                        location.reload();
                    });
            } else {
                this.$router.push("/login");
            }
        },


        methods: {
            async init() {
                //Loadingscreen
                try {
                    await this.$store.dispatch("initShared");
                    //disable Loadingscreen

                    //Let all other components know, that init is finished
                } catch (err) {
                    console.log(err)
                }
            }
        }
    };
</script>

<style lang="scss">
    @import "~bulma/sass/utilities/_all";
    @import "~bulma/sass/elements/button";
    @import "~bulma/sass/elements/table";
    @import "~bulma/sass/elements/form";
    @import "~bulma/sass/components/navbar";
    // @import "~bulma/sass/components/modal";
    @import "~bulma/sass/components/menu";
    @import "~bulma/sass/components/pagination";
    @import "~bulma/sass/components/panel";
    @import "~bulma/sass/components/card";
    @import "~bulma/sass/components/message";

    .container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-template-areas: "sidebar header header header" "sidebar content content content" "sidebar footer footer footer";

    }

    .content {
        grid-area: content;
        padding: 10px 10px 10px 10px;
    }

    body {
        margin: 0;
    }
</style>