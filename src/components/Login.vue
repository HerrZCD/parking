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
    <div class="input-wrapper">
      <el-select v-model="logInRole" placeholder="Please select a role" style="width: 255px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
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
      logInRole: '',
      options: [{
        value: 'Owner',
        label: 'Carport Owner'
      }, {
        value: 'Admin',
        label: 'Administrator'
      },
      {
        value: 'User',
        label: 'User'
      }],
    }
  },

  methods: {
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

      if (!this.logInRole) {
        alert('Please select a role');
        return
      }
      const params = {
        name: this.userName,
        password: this.password,
        logInRole: this.logInRole,
      }
      fetch("http://192.168.199.239:3000/api/data", {
          method: 'POST', // or 'PUT'
          body: `name=${this.userName}`, //'{"name":"hehe","age":10}'
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.flag === 1) {
            this.$message({
              type: 'info',
              message: '用户名已经被占用'
            });
          } else if (data.flag === 0) {
            this.$router.push({
              path: 'chat',
              query: {
                name: this.userName
              }
            })
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
  width: 500px;
  height: 400px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
</style>
