import Vue from 'Vue'
// import Vuex from 'vuex'
import GMap from '@/components/home/GMap'
// import { store } from '@/store/store'

describe('GMap.vue', () => {
  it('checks that the submission form is closed, when component is first opened', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

  // This test is not working
  /*
  it('checks that getMarkerDetails opens the appropriate infoWindow', () => {
    // const Constructor = Vue.extend(GMap)
    // const GMapComponent = new Constructor().$mount()
    const store = new Vuex.Store()
    const StoreComponent = Vue.extend(GMap)
    const vm = new StoreComponent({store}).$mount()

    // literal values from a real entry in the database
    const COLLECTION_TITLE = 'Lost: '
    const LOCATION = new vm.firebase.firestore.GeoPoint(36.99445676398827, -122.064755734567)
    const TYPE = 'TEST'
    const DESCRIPTION = 'DO NOT DELETE -- used for unit test'
    const CONTACT_EMAIL = 'lnguye78@ucsc.edu'
    const DATE = '07/23/2018'
    const TIME = '14:58'
    const USER_ID = 'emc5X23TpscMixf4RxBBQJeJPvR2'
    const COLLECTION_NAME = 'lost-items'
    const ITEM_ID = 'lyy6KxjyjJou7n5uv9xz'
    const ITEM = {
      location: LOCATION,
      type: TYPE,
      description: DESCRIPTION,
      contactEmail: CONTACT_EMAIL,
      date: DATE,
      time: TIME,
      userID: USER_ID,
      collectionName: COLLECTION_NAME,
      id: ITEM_ID
    }

    vm.getMarkerDetails(ITEM, COLLECTION_TITLE, ITEM_ID)
    // expect(GMapComponent.infoWinOpen).to.equal(true)
    // expect(GMapComponent.currentMid).to.equal(ITEM_ID)
  })
  */

  /*
  it('prevents markers being added outside of UCSC boundaries', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(GMap)
    }).$mount()

    // const gMap = vm.$el.querySelector('GmapMap')

    // const button = ListComponent.$el.querySelector('button');
    console.log('**********')
    console.log('What is this? ', GMapComponent.$el)
  })
  */
})
