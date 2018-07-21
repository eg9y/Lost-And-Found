import Vue from 'Vue'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
  it('prevents markers being added outside of UCSC boundaries', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()

    // const button = ListComponent.$el.querySelector('button');
    console.log('**********')
    console.log(GMapComponent.$el.querySelector('.text-xs-center'))
  })
})
