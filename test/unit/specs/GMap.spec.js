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

  // Geoff's test
  it('checks that the map is centered properly when the webpage is refreshed', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.center.lat).to.equal(36.994635)
    expect(GMapComponent.center.lng).to.equal(-122.058842)
  })
})
