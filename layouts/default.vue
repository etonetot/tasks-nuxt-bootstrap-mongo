<template>
  <div>

      <b-toast id="my-toast" variant="Error" solid>
      <div slot="toast-title" class="d-flex flex-grow-1 align-items-baseline">
        <b-img blank blank-color="#ff5555" class="mr-2" width="12" height="12"></b-img>
        <strong class="mr-auto">Error!</strong>
        <small class="text-muted mr-2"></small>
      </div>
      {{errorMessage}}
    </b-toast>

    <nuxt />
  </div>
</template>


<script>
export default {
  data: function (){
    return {
      errorMessage: ""
    } 
  },
  computed: {
    error() {
      return this.$store.state.error
    },
  },
  watch: {
    error(value) {
      console.log("watch error");
      console.dir (value);
      this.errorMessage = value;
      this.$bvToast.show('my-toast');
      
    }
  }
}
</script>


<style>
</style>
