<template>
  <div class="wrapper">
    <h2>Manage <span v-if="role==='Owner'">my</span> parking spots</h2>
    <el-button type="primary" @click="OpenAddDiag()" class="add-btn" v-if="role==='Owner'">Add a spot</el-button>
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
      <div class="input-wrapper">
        <span class="tag">location:</span>
        <el-autocomplete
          class="inline-input"
          v-model="location"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <div class="input-wrapper">
        <div id="map"></div>
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
        label="Id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="height"
        label="Height"
        width="80">
      </el-table-column>
      <el-table-column
        prop="width"
        label="Width"
        width="80">
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
        label="Price (Per Hour)"
        width="80">
      </el-table-column>
      <el-table-column
        prop="user_time_start"
        label="Available time(From)"
        width="180">
        <template slot-scope="scope">
          <span>{{Date(scope.row.user_time_start)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="Available time(To)"
        width="180">
        <template slot-scope="scope">
          <span>{{Date(scope.row.user_time_end)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="Actions"
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
import { Loader } from "@googlemaps/js-api-loader"
const loader = new Loader({
  apiKey: "AIzaSyAia-ZeqnIWGC1RRI2HTRzwrSTTaZj62Hc", //api的key
  libraries: ["places"],
})
export default {
  name: 'manage',
  computed: {
    parkingSpots() {
      return this.$store.state.parkingSpots;
    },
    role() {
      return this.$store.state.currentRole;
    },
  },
  data() {
    return {
      lat: 0,
      lng: 0,
      id: 0,
      width: 0,
      height: 0,
      location: '',
      timeRange: '',
      price: 0,
      action: 'modify',
      google: '',
      map: '',
      service: '',
      infoWindow: '',
      marker: ''
    }
  },

  methods: {
    OpenAddDiag() {
      this.initMap();
      this.action = 'create',
      document.getElementsByClassName('box')[0].style.display = "block";
      document.getElementsByClassName('spotsTable')[0].style.display = "none";
    },
    handleSelect(item) {
      this.lat = item.position.lat;
      this.lng = item.position.lng;
    },
    querySearch(queryString, cb) {
      var request = {
            query: queryString,
            fields: ['name', 'geometry'],
          };
      this.service.findPlaceFromQuery(request, (results, status) => {
              console.log(results)
              console.log(status)
          let results_to_show = [];
          
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              console.log(results)
              results_to_show.push({
                value: results[i].name,
                position: {
                  lat: results[i].geometry.lat,
                  lng: results[i].geometry.lat,
                }
              })
              // createMarker(results[i]);
            }
            this.map.setCenter(results[0].geometry.location);
            cb(results_to_show);
          }
        });
    },
    initMap() {
      const mapOptions = {
        center: { lat: 22.602, lng: 114.043 },
        zoom: 20
      }
      loader
        .load()
        .then((google) => {
          this.google = google
          this.map = new google.maps.Map(
            document.getElementById("map"),
            mapOptions
          )
          var request = {
            query: '上海闵行区龙柏香榭苑',
            fields: ['name', 'geometry'],
          };
          // service 地点查询类
          this.service = new google.maps.places.PlacesService(this.map)
          this.service.findPlaceFromQuery(request, (results, status) => {
                console.log(results)
                console.log(status)
            
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                console.log(results)
                // createMarker(results[i]);
              }
              this.map.setCenter(results[0].geometry.location);
            }
          });
          // this.infoWindow = new google.maps.InfoWindow({ // 地图信息窗口
          //   content: "",
          //   // disableAutoPan: true,
          // })
          // this.marker = new google.maps.Marker() // 地图标记类
          // this.google.maps.event.addListener(this.map, 'click', this.clickMap) // 监听地图点击事件
        }).catch((e) => {
          console.log(e)
        })
    },
    handleEdit(index, row) {
      this.initMap();
      this.id = row.id;
      this.action = 'modify',
      this.id = row.id;
      this.width = row.width;
      this.height = row.height;
      this.location = row.location;
      this.price = row.price;
      console.log(row.user_time_start);
      console.log(row.user_time_end);

      let a = new Date(Number(row.user_time_start));
      let b = new Date(Number(row.user_time_end));
      console.log(a);
      console.log(b);


      this.timeRange = [a, b];
      console.log(this.timeRange);
      console.log(row.user_time_start);
      console.log(row.user_time_end);
      document.getElementsByClassName('box')[0].style.display = "block";
      document.getElementsByClassName('spotsTable')[0].style.display = "none";
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
              message: 'delete success'
            });
            this.GetParkingSpots();
          } else {
            this.$message({
              type: 'info',
              message: 'fail to deletespots'
            });
          }
        })
    },
    GetParkingSpots() {
      let params;
      if (this.role === 'Admin') {
        params = {
          name: 'ALLUSERNAMES'
        }
      } else {
        params = {
          name: this.$store.state.currentUser
        }
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
        } else {
          this.$store.dispatch('initSpotsActions', []);
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
            document.getElementsByClassName('spotsTable')[0].style.display = "block";
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
            document.getElementsByClassName('spotsTable')[0].style.display = "block";
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
      document.getElementsByClassName('spotsTable')[0].style.display = "block";
    }
   
  },
  mounted() {
    this.GetParkingSpots();
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

#map {
  width: 100%;
  height: 250px;
}

.tag {
  margin: 0 20px 15px 20px;
  line-height: 40px;
  font-weight: bold;
  width: 150px;
}

.box {
  width: 850px;
  height: 700px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  display: none;
  position: absolute;
  left: calc(50% - 425px);
  top: 250px;
  z-index:100;
}

.spotsTable {
  margin-left: calc(50% - 560px);
}

.login-btn {
  margin-top: 20px;
}

</style>
