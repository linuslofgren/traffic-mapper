'use strict';

var chart, dataController, barChart

function getFetch(resourceName) {
	return new Promise((resolve)=>{
		var req = new XMLHttpRequest()
		req.addEventListener('load', function(){resolve(JSON.parse(this.responseText))})
		console.log('127.0.0.1:3000/'+resourceName);
		req.open('GET', 'http://127.0.0.1:3000/'+resourceName)
		req.send()
	})
}

function initMap() {
	var map = new Mapper({mapElement: document.getElementById('map'), style: mapStyle})
	var canvas = document.getElementById("myChart")
	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight
	barChart = new Chart(
		canvas.getContext("2d"),
		ChartSetups.barChart()
	)

	Promise.all([getFetch('line_events.json'), getFetch('sites_with_flow.json')])
		.then(handleLineEvents)
		.then((data)=>{
			dataController = new DataController(data)
			var markers = map.addMarkers({markers: dataController.filteredAllGroup().all().map((d)=>d.value.position), inClusters: true})
			map.addContentToMarkers((m, i)=>{
				map.addContent(m, dataController.filteredAllGroup().all()[i].value.name, dataController.filteredAllGroup().all()[i].value.direction_id, (c, id)=>{
					redrawAll()
				})
			})
		})
}



function redrawAll() {
	redraw(dataController, undefined, barChart)
}

function dataFromData(rawData, from, to) {
	return
	return rawData.map((marker)=>{return {
		name: marker.name,
		cars: marker.data.cars[0].amount,
		ped: marker.data.pedestrians[0].amount,
		cyc: marker.data.cyclists[0].amount
	}})
}

const handleLineEvents = (lineEvents) => new Promise((resolve, reject) => {
	let sitesClean = [].concat(...[].concat(...lineEvents[1].sites
		.map((site)=>site.lines
		.map((line)=>line.directions
		.map((direction)=>direction
	)))))
	let events = lineEvents[0].map((e)=>{
		e.name = sitesClean.find((s)=>s.id==e.direction_id).name
		e.position = sitesClean.find((s)=>s.id==e.direction_id).position//{lat: 58+Math.random(), lng: 15+Math.random()}
		return e
	})

	resolve(events)
})

function redraw(dataController,radarChart,barChart) {

		var dataPoints = dataController.filteredAllGroup().all()
		console.log(dataPoints)


		dataPoints.map((direction, i)=>{
			console.log(i);
			var vs = direction.value
			barChart.canvas.previousElementSibling.innerHTML=direction.key
			barChart.data.datasets[i] = {}
			barChart.data.datasets[i].label = direction.key
			barChart.data.datasets[i].data = [vs.cars, vs.cyc, vs.ped]
			barChart.data.labels = ["🚗", "🚴🏾", "🚶‍"]
			barChart.update()
		})


}

const colorForString = () => "red"
