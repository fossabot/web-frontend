<template>
  <div>
    <div>
      <div v-if="this.$store.state.route.path != '/images/new'">
        <button 
          @click="refresh" 
          class="button"><i class="fa fa-retweet"/></button>
      </div>
      <div class="content">
        <router-view/>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
        methods: {
            refresh() {
                this.$store.dispatch("setImages");
            }
        }
    }
</script>

<style>

</style>
