import Vue from 'vue'
import database from '@/components/database/database'

describe('Database.vue', () => {
  it('should display the results from the database', function () {
    const Constructor = Vue.extend(database)
    const databaseComponent = new Constructor().$mount()
    expect(databaseComponent.submissionDialog).to.equal(true)
  })
})
