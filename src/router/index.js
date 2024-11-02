/* eslint-disable no-undef */
import Vue from 'vue'
import Router from 'vue-router'
import index from '@/index/index'
import Analysis from '../components/Analysis.vue'
import Transcribe from '../components/Transcribe.vue'

Vue.use(Router)

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/analysis',
          name: 'analysis',
          component: Analysis
        },
        {
          path: '/transcribe',
          name: 'transcribe',
          component: Transcribe
        }
      ]
    }
  ]
})
