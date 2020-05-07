<template>
  <div id="app">
    <span v-for="park in parks" :key="park.slug">{{ park.title }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    parks() {
      return this.$store.state.parks;
    }
  },
  created() {
    this.$store.dispatch("getParks");
  }
};
</script>
