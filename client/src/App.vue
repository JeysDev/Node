<template>
<v-app class="bg-appvue">
  <v-app-bar color="orange">
    <v-app-bar-nav-icon @click.stop="navDrawer = !navDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>
      <strong><span><p>NODE HUB</p></span></strong>
    </v-toolbar-title>
  </v-app-bar>
  <v-navigation-drawer 
    color="black"
    temporary
    elevation="24"
    v-model="navDrawer">
  <v-list nav>
    <v-list-item 
      color="orange"
      link
      :to="item.path"
      :prepend-icon="item.meta.icon"
      v-for="(item, index) in routes.options.routes" :key="index">
      <v-list-item-title style="font-size: 15px; color:orange">
        {{ item.name }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>

</v-app>  


</template>

<script>
import { useRouter } from 'vue-router';
  export default {
    data(){
      return{
        navDrawer: true,
        routes: useRouter(),
      }
    }

  }
</script>

<style scoped>
.bg-appvue {
    background-color: rgb(0, 0, 0) !important;
}

</style>