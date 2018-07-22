import Vue from 'vue'
// import Index from '@/components/home/SubmissionForm/Index'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
  it('cheks that the submission form starts closed', () => {
    // const IndexConstructor = Vue.extend(Index)
    const Constructor = Vue.extend(GMap)
    // const IndexComponent = new IndexConstructor().$mount()
    const GMapComponent = new Constructor().$mount()
    // console.log('**********')
    // console.log(GMapComponent)
    // console.log(IndexComponent.submissionDialog)
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

  it('prevents markers being created outside the boundaries of UCSC', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    console.log('**********')
    // console.log(GMapComponent)
    console.log(GMapComponent.$parent.getMap)
  })
})
