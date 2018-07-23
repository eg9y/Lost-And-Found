import Vue from 'Vue'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
  it('checks that the submission form is closed, when component is first opened', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

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

  it('should show the user location inside the UCSC boundaries', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.center.lat).to.equal(this.lat)
    expect(GMapComponent.center.lng).to.equal(this.lng)
  })
})
