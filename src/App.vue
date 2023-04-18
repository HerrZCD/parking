<template>
  <div id="app">
    <div id="my-info-bar">
      <el-link type="primary" @click="GotoMyOrder()" v-if="(role==='User' || role === 'Owner') && $route.path !== '/orders'">My Orders</el-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    role() {
      return this.$store.state.currentRole;
    },
    user() {
      return this.$store.state.currentUser;
    },
  },
  methods: {
    GotoMyOrder() {
      this.$router.push('/orders');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#my-info-bar {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 10px;
}
</style>
