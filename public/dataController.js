'use strict'

function DataController(data){//{data, primaryKey, otherKeys, highlightFunctions}) {



	var dataCrossfilter,
		fdim,
		primaryDimension,
		filterArray = [],
		allGroupNotEmpty,
		totalGroupNotEmpty,
		allGroup,
		totalGroup,
		data = data

	const reduceF = (f) => (r, i)=>{
		r.name = i.name
		r.position = i.position
		switch (i.class_id) {
			case 0:
				r.cars = f(r.cars, i.count)
				break;
			case 1:
				r.cyc = f(r.cyc, i.count)
				break;
			case 2:
				r.ped = f(r.ped, i.count)
				break;
		}
		return r
	}
	const plus = (a, b) => a + b
	const minus = (a, b) => a - b
	const reduceAdd = reduceF(plus)
	const reduceRemove = reduceF(minus)

		dataCrossfilter =	crossfilter(data)
		primaryDimension = dataCrossfilter.dimension((d)=>d.direction_id)
		allGroup = primaryDimension.group().reduce(reduceAdd,reduceRemove,()=>({cyc: 0, ped: 0, cars: 0, name: "", position: {lat: 0, lng: 0}}))

	// dataCrossfilter = crossfilter(data)

	fdim = dataCrossfilter.dimension((d)=>d.direction_id)
	// primaryDimension = dataCrossfilter.dimension((d)=>d[primaryKey])
	//
	//
	// totalGroupNotEmpty = primaryDimension.group().reduce(
	//
	// 	(objectToReturn,currentObject)=>{
	// 		var tot = 0
	// 		for (var key of otherKeys) {
	// 			tot += currentObject[key]
	// 		}
	// 		objectToReturn.tot = tot
	// 		return objectToReturn
	// 	},
	//
	// 	(objectToReturn,currentObject)=>{
	// 		objectToReturn.tot = objectToReturn.tot-currentObject.tot
	// 		return objectToReturn
	// 	},
	//
	// 	()=>({tot:0})
	// )
	//
	// allGroupNotEmpty = primaryDimension.group().reduce(
	//
	// 	(objectToReturn,currentObject)=>{
	// 		objectToReturn.tot = 0
	// 		for (var key of otherKeys) {
	// 			objectToReturn[key] = objectToReturn[key]||0 + currentObject[key]
	// 			objectToReturn.tot += objectToReturn[key]
	// 		}
	// 		return objectToReturn
	// 	},
	//
	// 	(objectToReturn,currentObject)=>{
	// 		for (var key of otherKeys) {
	// 			objectToReturn[key] = objectToReturn[key] - currentObject[key]
	// 		}
	// 		objectToReturn.tot = objectToReturn.tot-currentObject.tot
	// 		return objectToReturn
	// 	},
	//
	// 	()=>(otherKeys.concat(["tot"]).reduce((res,item,index)=>{res[index]=item;return res},{}))
	// )
	//

	// allGroup = removeEmptyBins(allGroupNotEmpty)
	// totalGroup = removeEmptyBins(totalGroupNotEmpty)


	this.filterFor = function(func) {
		fdim.filter(func)
	}

	this.addToFilter = function(id) {
		if (filterArray.indexOf(id)>-1) {
			return
		}
		filterArray.push(id)
		fdim.filter((d)=>filterArray.indexOf(d)>-1)
	}
	this.clearFilter = function() {
		filterArray = []
		fdim.filterAll()
	}
	this.removeFromFilter = function(name) {
		var index = filterArray.indexOf(name)
		if (index > -1) {
			filterArray.splice(index, 1)
		}
		fdim.filter((d)=>filterArray.indexOf(d)>-1)
	}

	this.filteredAllGroup = function() {
		return allGroup
	}

	this.filteredTotGroup = function() {
		return totalGroup
	}

	this.all = function() {
		console.log(this.group);
		return allGroup.all()
	}

	this.dataPoint = function() {
		return new DataPoint()
	}

	this.nameFromIndex = function(index) {
		if (typeof index == "undefined") {
			console.warn("Index is undefined, in DataController (name from index)");
			return undefined
		}
		var name = this.filteredTotGroup().all()[index].key
		return name
	}

	function removeEmptyBins(sourceGroup) {

		return {
			all: function(){
				return sourceGroup.all().filter((d)=>{
					return d.value.tot==0||isNaN(d.value.tot)?false:true
				})
			}
		}

	}

}





//
// function DataPoint({style,value}) {
// 	this.element = undefined
// 	this.name = ""
//
// 	this.makeFromName = function(name, i) {
// 		console.log("Color for index ", i);
// 		var color = colorForIndex(i,0.8)
// 		var li = document.createElement("li")
// 		var cont = document.createElement("div")
// 		cont.classList.add("list-content")
// 		li.innerHTML = name
// 		cont.style.backgroundColor = color
// 		li.appendChild(cont)
// 		this.element = li
// 		this.name = name
// 		pickerInView.appendChild(this.element)
// 		return this
// 	}
//
// 	this.extraOption = style
// }
//
// function ChartController({ctx, chartOptions}) {
// 	var ctx = ctx
// 	this.chart = new Chart(ctx, chartOptions)
// 	this.redraw = function() {
// 		this.chart.update()
// 	}
// 	this.setData = function(data) {
// 		chart.data = data
// 	}
// 	this.expand = function() {
// 		ctx.canvas.parentNode()
// 	}
// }
//
// function ChartDataMerger() {}
