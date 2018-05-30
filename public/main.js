/* global XMLHttpRequest, mapStyle, Mapper, Chart, ChartSetups, DataController */
'use strict'

var dataController

function getFetch (resourceName) {
  return new Promise((resolve) => {
    var req = new XMLHttpRequest()
    req.addEventListener('load', function () { resolve(JSON.parse(this.responseText)) })
    console.log('127.0.0.1:3000/' + resourceName)
    req.open('GET', 'http://127.0.0.1:3000/' + resourceName)
    req.send()
  })
}

window.initMap = () => {
  var map = new Mapper({mapElement: document.getElementById('map'), style: mapStyle})
  // var canvas = document.getElementById('myChart')
  // canvas.width = canvas.clientWidth
  // canvas.height = canvas.clientHeight
  // barChart = new Chart(
  //   canvas.getContext('2d'),
  //   ChartSetups.barChart()
  // )

  Promise.all([getFetch('line_events.json'), getFetch('sites_with_flow.json')])
    .then(handleLineEvents)
    .then((data) => {
      dataController = new DataController(data)
      const drawer = drawTracker((charts) => { redraw(dataController, charts) })
      map.addMarkers({markers: dataController.filteredAllGroup().all().map((d) => d.value.position), inClusters: true})
      map.addContentToMarkers((m, i) => {
        const toggle = chart('#charttemplate', drawer, document.getElementsByClassName('info-container')[0], i)
        map.addContent(m, dataController.filteredAllGroup().all()[i].value.name, dataController.filteredAllGroup().all()[i].value.direction_id, (c, id) => {
          toggle()
        })
      })
    })
}
// Called once
const drawTracker = (redrawF) => {
  const charts = []
  // Called on creation
  return (canvas, id) => {
    const barChart = new Chart(
      canvas.getContext('2d'),
      ChartSetups.barChart()
    )
    charts.push({chart: barChart, id})
    redrawF(charts)
    return () => {
      charts.splice(charts.indexOf(barChart), 1)
      redrawF(charts)
    }
  }
}
const chart = (templateName, drawF, parent, i) => {
  let j = i
  console.log(templateName)
  let element
  let drawn = false
  let remove
  return () => {
    if (!drawn) {
      const tmpl = document.querySelector(templateName).content
      let clone = document.importNode(tmpl, true)
      drawn = true
      element = clone.childNodes[1]
      parent.appendChild(clone)
      remove = drawF(element.querySelector('canvas'), j)
    } else {
      drawn = false
      remove()
      element.parentNode.removeChild(element)
    }
  }
}

const handleLineEvents = (lineEvents) => new Promise((resolve, reject) => {
  let sitesClean = [].concat(...[].concat(...lineEvents[1].sites
    .map((site) => site.lines
      .map((line) => line.directions
        .map((direction) => direction
        )))))
  let events = lineEvents[0].map((e) => {
    e.name = sitesClean.find((s) => s.id === e.direction_id).name
    e.position = sitesClean.find((s) => s.id === e.direction_id).position
    return e
  })

  resolve(events)
})

function redraw (dataController, charts) {
  var dataPoints = dataController.filteredAllGroup().all()
  // console.log(dataPoints)
  // console.log(charts)
  let maxValue = Math.max(...[].concat(...charts.map((chartContainer) => [dataPoints[chartContainer.id].value.cars, dataPoints[chartContainer.id].value.cyc, dataPoints[chartContainer.id].value.ped])))
  charts.map((chartContainer) => {
    const barChart = chartContainer.chart
    const direction = dataPoints[chartContainer.id]
    // console.log(barChart)
    var vs = direction.value
    barChart.canvas.previousElementSibling.firstChild.firstChild.innerHTML = vs.name
    var tot = vs.cars + vs.cyc + vs.ped
    var suffix = tot > 1000 ? (() => { tot = Math.floor(tot / 1000); return 'k' })() : ''
    barChart.canvas.previousElementSibling.firstChild.lastChild.innerHTML = tot + suffix + ' passager'
    barChart.data.datasets[chartContainer.id] = {}
    barChart.data.datasets[chartContainer.id].data = [vs.cars, vs.cyc, vs.ped]
    barChart.data.labels = ['🚗', '🚴🏾', '🚶‍']
    barChart.options.scales.yAxes[0].ticks.max = Math.round((maxValue * 1.1) / 100) * 100
    barChart.update()
  })
}
