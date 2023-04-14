<template>
  <div class="wrapper">
    <h2>Manage my parking spots</h2>
    <div class="box">
      <h3>Add Parking Port</h3>
      <div class="input-wrapper">
        <span class="tag">Width:</span>
        <el-input v-model="width" placeholder="Please input user name" style="width: 255px" type="number"></el-input>
      </div>
      <div class="input-wrapper">
        <span class="tag">Height:</span>
        <el-input v-model="height" placeholder="Please input user name" style="width: 255px" type="number"></el-input>
      </div>
      <div class="input-wrapper">
        <span class="tag">location:</span>
        <el-input v-model="location" placeholder="Please input user name" style="width: 255px"></el-input>
      </div>
      <div class="input-wrapper">
        <span class="tag">Available time:</span>
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="To"
          start-placeholder="Start from"
          end-placeholder="End Time">
        </el-date-picker>
      </div>
      <div class="input-wrapper">
        <span class="tag">Price(per h):</span>
        <el-input v-model="price" placeholder="Please input user name" style="width: 255px" type="number"></el-input>
      </div>
      <div class="buttons">
        <el-button type="primary" @click="submit()" class="login-btn">Create a spot</el-button>
        <el-button @click="cancel()">Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'manage',
  data() {
    return {
      width: 0,
      height: 0,
      location: '',
      timeRange: '',
      price: 0,
    }
  },

  methods: {
    submit() {
      console.log(this.timeRange)
    },
    cancel() {
    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  margin-top: 5%;
}

.input-wrapper {
  display: flex;
}

.tag {
  margin: 0 20px 15px 20px;
  line-height: 40px;
  font-weight: bold;
  width: 150px;
}

.box {
  width: 650px;
  height: 500px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.login-btn {
  margin-top: 20px;
}
</style>
