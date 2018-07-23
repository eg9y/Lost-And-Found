import Vue from 'vue'
import NavBar from '@/components/layout/NavBar'

describe('NavBar.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(NavBar)
    const AppComponent = new Constructor().$mount()
    console.log(AppComponent.$el.textContent)
    expect(AppComponent.$data.drawer).to.be.an('boolean')
    expect(AppComponent.$data.drawer).to.be.(false)
  })
})
