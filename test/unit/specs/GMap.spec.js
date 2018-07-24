import Vue from 'Vue'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
  it('checks that the submission is closed when component is first loaded', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })
  // Following test is not working
  /* it('prevents markers being added outside of UCSC boundaries', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    console.log('**********')
    console.log(GMapComponent.$el)
  }) */

  it('checks that the map is centered properly when the webpage is refreshed', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.center.lat).to.equal(36.994635)
    expect(GMapComponent.center.lng).to.equal(-122.058842)
  })
})
