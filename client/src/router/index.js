import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta:{
        icon: 'mdi-home'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue'),
      meta:{
        icon: 'mdi-information'
      }
    },
    {
      path:'/Employee',
      name:'Employee',
      component:() =>import ('../views/Employee.vue'),
      meta:{
        icon: 'mdi-account-group-outline'
      }
    },
    {
      path:'/CrudView',
      name:'CrudView',
      component:() =>import ('../views/CrudView.vue'),
      meta:{
        icon: 'mdi-account-group-outline'
      }
    },
  ],
})

export default router
