import Vue from 'Vue'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
<<<<<<< HEAD
  it('checks that the submission form is closed, when component is first opened', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

  it('prevents markers being added outside of UCSC boundaries', () => {
=======
  it('checks that the submission is closed when component is first loaded', () => {
>>>>>>> origin/BACKUP-MASTER
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
})
