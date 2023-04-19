<template>
<div class="wrapper">
  <h2>Where do you want to go...</h2>
  <el-autocomplete
          class="inline-input"
          v-model="search_location"
          :fetch-suggestions="querySearch"
          placeholder="Please Input"
          @select="handleSelect"
  ></el-autocomplete>
  <div id="map"></div>
  <div id="book-box">
    <h3>Book Parking Port</h3>
    <div class="input-wrapper">
      <span class="tag">Start time:</span>
      <el-date-picker
        v-model="start_time"
        type="datetimerange"
        range-separator="To"
        start-placeholder="Start time"
        :picker-options="pickerOptions"
        end-placeholder="End Time">
      </el-date-picker>
    </div>
    <div class="input-wrapper">
      <span class="tag">Price:</span>
      <span class="tag">{{totalPrice}}</span>
    </div>
    <el-button type="primary" @click="Book()" class="login-btn">Book</el-button>
    <el-button type="primary" @click="Cancel()" class="login-btn">Cancel</el-button>
  </div>
  <el-table
      class="spotsTable"
      :data="parkingSpots"
      border
      stripe
      style="width: 1200px">
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
          <span>{{new Date(Number(scope.row.user_time_start))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="Available time(To)"
        width="180">
        <template slot-scope="scope">
          <span>{{new Date(Number(scope.row.user_time_end))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_time_end"
        label="Actions"
        width="180">
        <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleBook(scope.$index, scope.row)">Book</el-button>
        <span v-if="scope.$index===min_index">Recommend </span>
      </template>
      </el-table-column>
      <el-table-column
        prop="likes"
        label="Likes"
        width="80">
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
  name: 'user',
  data() {
    return {
      search_location: '',
      lat: 0,
      lng: 0,
      map: '',
      google: '',
      service: '',
      id: '',
      owner: '',
      min_index: 0,
      location: '',
      price: 0,
      start_time: '',
      user_time_end: 0,
      user_time_start: 0,
      pickerOptions: {
        disabledDate: (date) => {
          return date.getTime() < this.user_time_start || date.getTime() > this.user_time_end;
        }
      }
    }
  },
  computed: {
    parkingSpots() {
      return this.$store.state.parkingSpots;
    },
    role() {
      return this.$store.state.currentRole;
    },
    totalPrice() {
      if (isNaN(this.duration * this.price)) return 0;
      return this.duration * this.price;
    },
    user() {
      return this.$store.state.currentUser;
    },
    duration() {
      if (Array.isArray(this.start_time) && this.start_time.length === 2) {
        console.log(this.start_time)
        return (this.start_time[1].getTime() - this.start_time[0].getTime()) / 1000 / 3600;
      }
    },
    start_order_time() {
      if (Array.isArray(this.start_time) && this.start_time.length === 2) {
        console.log(this.start_time)
        return this.start_time[0].getTime();
      }
    }
  },
  mounted() {
    this.initMap();
    this.GetParkingSpots();
  },

  methods: {
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
          this.$store.dispatch('roleActions', data.role);
        })
        .catch(function (e) {
          console.log('oops! error:', e.message)
        })
    },
    Book() {
      const params = {
        spot_id : this.id,
        location: this.location,
        owner: this.owner,
        user: this.user,
        price: this.totalPrice,
        user_time_start: this.start_order_time,
        duration: this.duration
      }

      fetch("http://127.0.0.1:5000/createorder", {
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
                message: 'create order success'
              });
          const payParams = {
          user: this.user,
          owner: this.owner,
          money: this.totalPrice
        }
        fetch("http://127.0.0.1:5000/setBalance", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(payParams),
          headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8',
            'user-agent': 'Mozillia/4.0 MDN Example'
          })
        }).then(res => res.json()).then(data => {
          if (data.status === 'success') {
            this.getbalance();
          } else {
          }
        })
        document.getElementById('book-box').style.display = "none";
        } else {
          this.$message({
            type: 'info',
            message: 'failed to create order'
          });
        }
      })
    },
    Cancel() {
      document.getElementById('book-box').style.display = "none";
      
    },
    handleBook(index, row) {
      this.id = row.id;
      this.owner = row.owner;
      this.location = row.location;
      this.price = row.price;
      this.user_time_start = Number(row.user_time_start);
      this.user_time_end = Number(row.user_time_end);
      console.log(this.user_time_start)
      console.log("===================")
      console.log(this.user_time_end)


      document.getElementById('book-box').style.display = "block";
    },
    GetParkingSpots() {
      let params;
      if (this.role !== 'Owner') {
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
    handleSelect(item) {
      console.log(item);

      this.lat = item.position.lat;
      this.lng = item.position.lng;
      console.log(this.lat);
      console.log(this.lng);

      console.log(this.parkingSpots);
      let index = 0;
      let min_distance;
      for (let i = 0; i < this.parkingSpots.length; i ++) {
        let lat = this.parkingSpots[i].lat;
        let lng = this.parkingSpots[i].lng;
        let dist = (this.lat - lat) * (this.lat - lat) + (this.lng - lng) * (this.lng - lng);
        console.log(dist);

        if (!min_distance) {
          min_distance = dist;
        }
        if (min_distance > dist) {
          min_distance = dist;
          index = i;
        }
      }
      console.log(index);
      this.min_index = index;
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
                  lat: results[i].geometry.location.lat(),
                  lng: results[i].geometry.location.lng()
                }
              })
              // createMarker(results[i]);
            }
            this.map.setCenter(results[0].geometry.location);
            cb(results_to_show);
          }
        });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.wrapper {
  width: 100%;
}

#map {
  width: 80%;
  height: 400px;
  margin-left:10%;
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#book-box {
  display: none;
  width: 450px;
  height: 300px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 10px auto;
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

.spotsTable {
  margin-left: calc(50% - 560px);
  margin-top: 20px;
}
</style>
