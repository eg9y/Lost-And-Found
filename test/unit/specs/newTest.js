import Vue from 'vue'
import database from '@/components/database/database'

var assert = chai.assert

describe('Database.vue', () => {
  it('should display the results from the database', function () {
    assert.equal(arr.length, 0)
    const Constructor = Vue.extend(database)
    const databaseComponent = new Constructor().$mount()
    expect(databaseComponent.submissionDialog).to.equal(true)
  })
})
