<template>
  <div class="wrapper">
    <h2>Manage my parking spots</h2>
    <el-button type="primary" @click="OpenAddDiag()" class="add-btn">Add a spot</el-button>
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
        <el-button type="primary" @click="submit()" class="login-btn">Confirm</el-button>
        <el-button @click="cancel()">Cancel</el-button>
      </div>
    </div>
     <el-table
      class="spotsTable"
      :data="parkingSpots"
      border
      stripe
      style="width: 1120px">
      <el-table-column
        prop="id"
        label="id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="height"
        label="height"
        width="80">
      </el-table-column>
      <el-table-column
        prop="width"
        label="width"
        width="80">
      </el-table-column>
      <el-table-column
        prop="location"
        label="location"
        width="180">
      </el-table-column>
      <el-table-column
        prop="owner"
        label="owner"
        width="80">
      </el-table-column>
      <el-table-column
        prop="price"
        label="price"
        width="80">
      </el-table-column>
      <el-table-column
        prop="user_time_start"
        label="user_time_start"
        width="180">
        <template slot-scope="scope">
          <span>{{Date(scope.row.user_time_start)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="user_time_end"
        width="180">
        <template slot-scope="scope">
          <span>{{Date(scope.row.user_time_end)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="actions"
        width="180">
        <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: 'manage',
  computed: {
    parkingSpots() {
      return this.$store.state.parkingSpots;
    }
  },
  data() {
    return {
      id: 0,
      width: 0,
      height: 0,
      location: '',
      timeRange: '',
      price: 0,
      action: 'modify',
    }
  },

  methods: {
    OpenAddDiag() {
      this.action = 'create',
      document.getElementsByClassName('box')[0].style.display = "block";
    },
    handleEdit(index, row) {
      this.id = row.id;
      this.action = 'modify',
      this.id = row.id;
      this.width = row.width;
      this.height = row.height;
      this.location = row.location;
      this.price = row.price;

      this.timeRange = [new Date(row.user_time_start), new Date(row.user_time_end)]
      document.getElementsByClassName('box')[0].style.display = "block";
    },
    handleDelete(index, row) {
      const params = {
        id: row.id
      };
      fetch("http://127.0.0.1:5000/deletespots", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(params),
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8',
            'user-agent': 'Mozillia/4.0 MDN Example'
          })
        }).then(res => res.json()).then(data => {
          if (data.status === 'success') {
            this.$message({
              type: 'info',
              message: 'delte success'
            });
            this.GetParkingSpots();
            document.getElementsByClassName('box')[0].style.display = "none";
          } else {
            this.$message({
              type: 'info',
              message: 'fail to deletespots'
            });
          }
        })
    },
    GetParkingSpots() {
      const params = {
        name: this.$store.state.currentUser
      };
      fetch("http://127.0.0.1:5000/getSpots", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(params),
        headers: new Headers({
          'Content-Type': 'application/json;charset=utf-8',
          'user-agent': 'Mozillia/4.0 MDN Example'
        })
      }).then(res => res.json()).then(data => {
        if (data.status === 'success') {
          this.$store.dispatch('initSpotsActions', data.results);
        }
      })
    },
    submit() {
      let fromTime = '';
      let toTime = '';
      if (Array.isArray(this.timeRange)) {
        fromTime = this.timeRange[0].getTime();
        toTime = this.timeRange[1].getTime();
      }
      const params = {
        width: this.width,
        height: this.height,
        location: this.location,
        price: this.price,
        user_time_start: fromTime,
        user_time_end: toTime,
        owner: this.$store.state.currentUser,
      }
      if (this.action === 'create') {
        fetch("http://127.0.0.1:5000/addspots", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(params),
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8',
            'user-agent': 'Mozillia/4.0 MDN Example'
          })
        }).then(res => res.json()).then(data => {
          if (data.status === 'success') {
            this.$message({
              type: 'info',
              message: 'add success'
            });
            this.GetParkingSpots();
            document.getElementsByClassName('box')[0].style.display = "none";
          } else {
            this.$message({
              type: 'info',
              message: 'fail to add'
            });
          }
        })
      } else if (this.action === 'modify') {
        params.id = this.id;
        fetch("http://127.0.0.1:5000/modifyspots", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(params),
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8',
            'user-agent': 'Mozillia/4.0 MDN Example'
          })
        }).then(res => res.json()).then(data => {
          if (data.status === 'success') {
            this.$message({
              type: 'info',
              message: 'modify success'
            });
            this.GetParkingSpots();
            document.getElementsByClassName('box')[0].style.display = "none";
          } else {
            this.$message({
              type: 'info',
              message: 'fail to modify'
            });
          }
        })
      }
    },
    cancel() {
      document.getElementsByClassName('box')[0].style.display = "none";
    }
   
  },
  mounted() {
    const params = {
      name: this.$store.state.currentUser
    }
    fetch("http://127.0.0.1:5000/getSpots", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(params),
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8',
        'user-agent': 'Mozillia/4.0 MDN Example'
      })
    }).then(res => res.json()).then(data => {
      if (data.status === 'success') {
        this.$store.dispatch('initSpotsActions', data.results);
      }
    })
    console.log(`the component is now mounted.`);
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
  display: none;
  // position: absolute;
  // left: calc(50% - 325px);
  // top: 200px;
  z-index:100;
}

.spotsTable {
  margin-left: calc(50% - 560px);
}

.login-btn {
  margin-top: 20px;
}

</style>
