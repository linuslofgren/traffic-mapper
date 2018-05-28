/* global crossfilter */
'use strict'

window.DataController = function (rawData) {
  // {data, primaryKey, otherKeys, highlightFunctions}) {

  var dataCrossfilter
  var fdim
  var primaryDimension
  var filterArray = []
  var allGroup
  var totalGroup
  var data = rawData

  const reduceF = (f) => (r, i) => {
    r.name = i.name
    r.position = i.position
    switch (i.class_id) {
      case 0:
        r.cars = f(r.cars, i.count)
        break
      case 1:
        r.cyc = f(r.cyc, i.count)
        break
      case 2:
        r.ped = f(r.ped, i.count)
        break
    }
    return r
  }
  const plus = (a, b) => a + b
  const minus = (a, b) => a - b
  const reduceAdd = reduceF(plus)
  const reduceRemove = reduceF(minus)

  dataCrossfilter = crossfilter(data)
  primaryDimension = dataCrossfilter.dimension((d) => d.direction_id)
  allGroup = primaryDimension.group().reduce(reduceAdd, reduceRemove, () => ({cyc: 0, ped: 0, cars: 0, name: '', position: {lat: 0, lng: 0}}))

  fdim = dataCrossfilter.dimension((d) => d.direction_id)

  this.filterFor = function (func) {
    fdim.filter(func)
  }

  this.addToFilter = function (id) {
    if (filterArray.indexOf(id) > -1) {
      return
    }
    filterArray.push(id)
    fdim.filter((d) => filterArray.indexOf(d) > -1)
  }
  this.clearFilter = function () {
    filterArray = []
    fdim.filterAll()
  }
  this.removeFromFilter = function (name) {
    var index = filterArray.indexOf(name)
    if (index > -1) {
      filterArray.splice(index, 1)
    }
    fdim.filter((d) => filterArray.indexOf(d) > -1)
  }

  this.filteredAllGroup = function () {
    return allGroup
  }

  this.filteredTotGroup = function () {
    return totalGroup
  }

  this.all = function () {
    console.log(this.group)
    return allGroup.all()
  }

  this.nameFromIndex = function (index) {
    if (typeof index === 'undefined') {
      console.warn('Index is undefined, in DataController (name from index)')
      return undefined
    }
    var name = this.filteredTotGroup().all()[index].key
    return name
  }
}
