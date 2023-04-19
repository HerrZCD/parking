<template>
<div class="wrapper">
  <h2>Welcome to parking system</h2>
  <div class="box">
    <h3>Please Login</h3>
    <div class="input-wrapper">
      <el-input v-model="userName" placeholder="Please input user name" style="width: 255px" @keyup.enter="login"></el-input>
    </div>
    <div class="input-wrapper">
      <el-input v-model="password" placeholder="please input password" style="width: 255px" @keyup.enter="login"></el-input>
    </div>
    <!-- <div class="input-wrapper">
      <el-select v-model="logInRole" placeholder="Please select a role" style="width: 255px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div> -->
    <el-button type="primary" @click="login()" class="login-btn">Enter system</el-button>
  </div>
  <a class="register" @click="register()">Do not have an account? register now</a>
</div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      userName: '',
      password: '',
    }
  },

  methods: {
    getbalance() {
       const params = {
        name: this.userName,
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

        })
        .catch(function (e) {
          console.log('oops! error:', e.message)
        })
    },
    register() {
      this.$router.push('/register');
    },
    login() {
      // debugger
      this.userName.trim();
      if (!this.userName) {
        alert('Please input valid user name');
        return
      }

      this.password.trim();
      if (!this.password) {
        alert('Please input valid password');
        return
      }
      const params = {
        name: this.userName,
        password: this.password,
        // loginRole: this.logInRole,
      }
      fetch("http://127.0.0.1:5000/login", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(params),
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8',
            'user-agent': 'Mozillia/4.0 MDN Example'
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            this.$message({
              type: 'info',
              message: 'success'
            });
            console.log(this.userName)
            console.log(data.role)
            this.$store.dispatch('roleActions', data.role);
            this.$store.dispatch('balanceActions', data.balance);
            this.$store.dispatch('nameActions', this.userName);
            if (data.role === "User") {
              this.$router.push('/user');
            } else if (data.role === 'Owner') {
              // Go to Owner page.
              this.$router.push('/manage');
            } else if (data.role === 'Admin') {
              this.$router.push('/manage');
            } else {
              // do nothing
            }
          } else {
            this.$message({
              type: 'info',
              message: 'fail to login'
            });
          }
        })
        .catch(function (e) {
          console.log('oops! error:', e.message)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.wrapper {
  width: 100%;
  margin-top: 12%;
}

h3 {
  margin-top: 50px;
}

.register {
  margin-top: 10px;
  display: block;
  margin-left: 300px;
  cursor: pointer;
}

.input-wrapper {
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
}

.login-btn {
  margin-top: 30px;
}

.box {
  width: 450px;
  height: 300px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
</style>
