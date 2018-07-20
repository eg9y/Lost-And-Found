import Vue from 'vue'
import App from '@/App'

describe('App.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(App)
    const AppComponent = new Constructor().$mount()
    expect(AppComponent.$el.textContent).to.contain('Display')
  })
})
