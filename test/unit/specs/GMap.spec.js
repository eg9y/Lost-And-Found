import Vue from 'Vue'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
  it('prevents markers being added outside of UCSC boundaries', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    /* const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(GMap)
    }).$mount() */

    // const gMap = vm.$el.querySelector('GmapMap')

    // const button = ListComponent.$el.querySelector('button');
    console.log('**********')
    console.log('What is this? ', GMapComponent.$el)
  })
})
