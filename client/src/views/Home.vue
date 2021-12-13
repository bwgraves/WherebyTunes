<template>
  <div class="">
    <p>Play some waiting music in your <a target="_blank" href="https://whereby.com">WhereBy</a> room, for the lolz :)</p>
      <h3>Enter your room name below</h3>
      <input v-model="roomName" style="max-width:400px;margin:0 auto;" type="text" name="roomName" /><br>

      <h3>Search for a song from YouTube</h3>
      <input v-model="tuneQuery" v-debounce:600ms="searchTunes" style="max-width:400px;margin:0 auto;margin-bottom:40px;" type="text" />
        <button type="submit" id="playButton" class="button primary" v-on:click="submitForm" :disabled="isPlayButtonDisabled">Play Tune!</button>
        <div class="results">
          <div
          v-for="item in songResults"
          v-bind:key="item.title"
          class="result-item"
          :class="tuneId == item.id.videoId ? 'selected-result' : ''"
          v-on:click="tuneId = item.id.videoId"
          >
          <div class="row">
            <div class="col-4">
              <img :src="item.snippet.thumbnails.default.url" />
            </div>
            <div class="col-8">
              <h4>{{ item.snippet.title }}</h4>
              <p>{{item.snippet.description}}</p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from 'axios';
import { getDirective } from 'vue-debounce'
export default {
  name: 'Home',
  components: {
    //HelloWorld
  },
  data: function(){
    return {
      roomName: "",
      tuneQuery: "",
      songResults: null,
      tuneId: ""
    }
  },
  methods:{
    searchTunes(){

      if (this.tuneQuery == ""){
        return;
      }

      axios
        .get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${this.tuneQuery}&key=AIzaSyCI1wuBPrrsEFQDQOY5zYWsFG9szmWQT0E`)
        .then(response => (this.songResults = response.data.items))
    },
    submitForm(){

      axios
        .post('http://localhost:5000/play', { roomName: this.roomName, tuneId: this.tuneId });

      this.$router.push({ path: 'waiting' })
    }
  },
  computed: {
    isPlayButtonDisabled(){
      return this.roomName == "" || this.tuneId == "";
    }
  },
  directives: {
    debounce: getDirective(3)
  }
}
</script>
<style scoped>
.results{
  max-width:600px;
  margin:0 auto;
  text-align:left;
  margin-top:40px;
}

.results .result-item{
  padding:10px;
  background-color: #eee;
  margin-bottom:10px;
  cursor: pointer;
  font-size:80%;
}

.results img{
  width:100%;
}

.results h4{
  font-size:120%;
}

.results .selected-result{
  background-color:#ccc;
}
</style>