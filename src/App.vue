<template>
  <div id="app">
    <div id="my-info-bar">
      <el-link type="primary" @click="GotoMyOrder()" v-if="(role==='User' || role === 'Owner') && $route.path !== '/orders'">My Orders</el-link>
      <span v-if="(role==='User' || role === 'Owner')" class="balance">{{balance}}</span><el-link v-if="(role==='User' || role === 'Owner')" @click="showAddBalanceWindow()" type="primary">balance:</el-link>
    </div>
    <div id="add-b">
      <div class="input-wrapper">
        <el-input v-model="addValue" placeholder="Please input user name" style="width: 100%" @keyup.enter="login"></el-input>
      </div>
      <div class="buttons">
        <el-button type="mini" @click="Add()" class="login-btn">Add</el-button>
        <el-button type="mini"@click="cancel()">Cancel</el-button>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
   data() {
    return {
      addValue: 0,
    }
   },
  computed: {
    role() {
      return this.$store.state.currentRole;
    },
    user() {
      return this.$store.state.currentUser;
    },
    balance() {
      return this.$store.state.balance;
    },
  },
  methods: {
    Add() {
      const params = {
        name: this.user,
        addValue: this.addValue
      }
      fetch("http://127.0.0.1:5000/addbalance", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(params),
        headers: new Headers({
          'Content-Type': 'application/json;charset=utf-8',
          'user-agent': 'Mozillia/4.0 MDN Example'
        })
      }).then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            this.$message({
              type: 'info',
              message: 'success to add balance'
            });
            this.getbalance();
          }
          document.getElementById('add-b').style.display = "none";
        })
        .catch(function (e) {
          console.log('oops! error:', e.message)
        })
    },
    getbalance() {
       const params = {
        name: this.user,
      }
      fetch("http://127.0.0.1:5000/getbalance", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(params),
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8',
            'user-agent': 'Mozillia/4.0 MDN Example'
          })
        })
        .then(res => res.json())
        .then(data => {
          this.$store.dispatch('balanceActions', data.balance);
        })
        .catch(function (e) {
          console.log('oops! error:', e.message)
        })
    },
    GotoMyOrder() {
      this.$router.push('/orders');
    },
    showAddBalanceWindow() {
      document.getElementById('add-b').style.display = "block";
    },
    cancel() {
      document.getElementById('add-b').style.display = "none";
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

.balance {
  color: #409EFF;
  line-height: 30px;
  margin-right: 10px;
  font-size: 14px;
}

#add-b {
  display: none;
  width: 200px;
  height: 70px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position:absolute;
  top: 30px;
  left: calc(100% - 210px);
}
</style>
