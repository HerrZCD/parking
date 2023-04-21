<template>
  <div id="app">
    <div id="my-info-bar">
      <el-link type="primary" @click="BACK()" v-if="$route.path !== '/login'" class="back"><i class="el-icon-back"></i>BACK</el-link>
      <el-link type="primary" @click="GotoMyOrder()" v-if="(role==='User' || role === 'Owner') && $route.path !== '/orders' && $route.path !== '/login' && $route.path !== '/register'">My Orders</el-link>
      <span v-if="(role==='User' || role === 'Owner')" class="balance">{{balance}}</span><el-link v-if="(role==='User' || role === 'Owner')" @click="showAddBalanceWindow()" type="primary">balance:</el-link>
    </div>
    <div id="add-b">
      <div class="input-wrapper" id="valueAdd">
        <el-input v-model="addValue" style="width: 100%" @keyup.enter="login" id="my-input">
        </el-input>
        <div id="button" @click="Add()"><i class="el-icon-plus"></i></div>
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
    Hide(e) {
      document.getElementById('add-b').style.display = "none";
    },
    BACK() {
      this.$router.back() .back();
    },
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
        Hide();
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
      document.getElementById('my-input').focus();
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
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 10px;
}

#valueAdd {
  position: relative;
}

.back {
  position: absolute;
  left: 10px;
}

#button {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #409eff;
  line-height: 40px;
  color: white;
  cursor: pointer;
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
  height: 40px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position:absolute;
  top: 30px;
  left: calc(100% - 210px);
}
</style>
