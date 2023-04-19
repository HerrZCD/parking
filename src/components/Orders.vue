<template>
  <div class="wrapper">
    <h2>My Orders</h2>
    <el-table
      class="spotsTable"
      :data="orders"
      border
      stripe
      style="width: 1040px">
      <el-table-column
        prop="id"
        label="Id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="spot_id"
        label="Spot Id"
        width="80">
      </el-table-column>
      </el-table-column>
      <el-table-column
        prop="location"
        label="Location"
        width="180">
      </el-table-column>
      <el-table-column
        prop="owner"
        label="Owner"
        width="80">
      </el-table-column>
      <el-table-column
        prop="price"
        label="Price (total)"
        width="80">
      </el-table-column>
      <el-table-column
        prop="user_time_start"
        label="Available time(From)"
        width="180">
        <template slot-scope="scope">
          <span>{{new Date(Number(scope.row.user_time_start))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user"
        label="User Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="Actions"
        width="180">
        
        <template slot-scope="scope">
        <span v-if="scope.row.state==='stale'">Expired</span>
        <span v-if="scope.row.state==='cancel'">Canceled</span>
        <el-button v-if="scope.row.state==='unconfirm'" size="mini" @click="Confirm(scope.$index, scope.row)" class="login-btn">Confirm</el-button>
        <el-button
          size="mini"
          type="danger"
          v-if="scope.row.state==='unconfirm'"
          @click="Cancel(scope.$index, scope.row)">Cancel</el-button>
      </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: 'orders',
  data () {
    return {
    }
  },
  computed: {
    role() {
      return this.$store.state.currentRole;
    },
    user() {
      return this.$store.state.currentUser;
    },
    orders() {
      return this.$store.state.orders;
    }
  },
  mounted() {
    this.GetOrders();;
  },
  methods: {
    Confirm(index, row) {
      if (Date.now() > Number(row.user_time_start)) {
        let state = '';
        if (Date.now() > Number(row.user_time_start) + 1800 * 1000) {
          // 过期
          state = 'stale';
        } else {
          state = 'confirmed';
        }
        const params = {
          id: row.id,
          state
        }
        fetch("http://127.0.0.1:5000/changeorderstate", {
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
            if (state === 'stale') {
              this.$message({
                type: 'info',
                message: 'This order is expired'
              });
            } else if (state === 'confirmed') {
              this.$message({
                type: 'info',
                message: 'success to confirm'
              });
            }
            this.GetOrders();
          } else {
          }
        })
        .catch(function (e) {
          console.log('oops! error:', e.message)
        })
      }
    },
    Cancel(index, row) {
      let state = '';
      if (Date.now() > Number(row.user_time_start) + 1800 * 1000) {
        // 过期
        state = 'stale';
      } else {
        state = 'cancel';
      }
      const params = {
        id: row.id,
        state
      }
      fetch("http://127.0.0.1:5000/changeorderstate", {
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
          if (state === 'stale') {
            this.$message({
              type: 'info',
              message: 'This order is expired'
            });
          } else if (state === 'cancel') {
            this.$message({
              type: 'info',
              message: 'success to cancel'
            });
          }
          this.GetOrders();
        } else {
        }
      })
      .catch(function (e) {
        console.log('oops! error:', e.message)
      })

    },
    GetOrders() {
      const params = {
        name: this.user,
        role: this.role,
      };
      fetch("http://127.0.0.1:5000/getorders", {
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
              message: 'Get Orders success'
            });
            this.$store.dispatch('initOrders', data.results);
          } else {
            this.$message({
              type: 'info',
              message: 'register failed'
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

<style scoped>
.wrapper {
  width: 100%;
}

.spotsTable {
  margin: 0 auto;
}
</style>
