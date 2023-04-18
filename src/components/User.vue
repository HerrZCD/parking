<template>
<div class="wrapper">
  <h2>Where do you want to go...</h2>
  <el-autocomplete
          class="inline-input"
          v-model="location"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
  ></el-autocomplete>
  <div id="map"></div>
  <div id="book-box">
    <h3>Book Parking Port</h3>
    <div class="input-wrapper">
      <span class="tag">Start time:</span>
      <el-date-picker
        v-model="start_time"
        type="datetime"
        placeholder="Select start time">
      </el-date-picker>
    </div>
    <div class="input-wrapper">
      <span class="tag">Duration:</span>
      <el-input v-model="duration" placeholder="Please input time duration" style="width: 220px" type="number"></el-input>
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
          type="danger"
          @click="handleBook(scope.$index, scope.row)">Book</el-button>
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
  name: 'user',
  data() {
    return {
      location: '',
      lat: 0,
      lng: 0,
      map: '',
      google: '',
      service: '',
      id: '',
      owner: '',
      location: '',
      price: '',
      start_time: '',
      duration: '',
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
      return this.duration * this.price;
    }
  },
  mounted() {
    this.initMap();
    this.GetParkingSpots();
  },

  methods: {
    Book() {
      document.getElementById('book-box').style.display = "none";
    },
    Cancel() {
      document.getElementById('book-box').style.display = "none";
      
    },
    handleBook(index, row) {
      this.id = row.id;
      this.owner = row.owner;
      this.location = row.location;
      this.price = row.price;


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
  margin-top: 5%;
}

#map {
  width: 80%;
  height: 400px;
  border: 1px solid black;
  margin-left:10%;
  margin-top: 10px;
}

#book-box {
  display: none;
  width: 450px;
  height: 300px;
  border-radius: 4px;
  border: 1px #ebebeb solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto;
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
