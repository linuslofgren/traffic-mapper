/* global google, Mapper, MarkerClusterer */
'use strict'
function CustomPopup (position, content) {
  this.position = position
  content.classList.add('popup-content')
  this.anchor = document.createElement('div')
  this.anchor.classList.add('popup-anchor')
  this.anchor.appendChild(content)
  // this.stopEventPropagation()
}

window.Mapper = class {
  constructor ({zoom = 10, origin = Mapper.latlng(58.4038594, 15.5407342), mapElement, style}) {
    this.map = new google.maps.Map(mapElement, {
      zoom: zoom,
      center: origin,
      styles: style,
      disableDefaultUI: true
    })
    this.markers = []

    CustomPopup.prototype = Object.create(google.maps.OverlayView.prototype)
    CustomPopup.prototype.onAdd = () => { this.getPanes().floatPane.appendChild(this.Anchor) }
    var c = document.createElement('div')
    c.innerHTML = 'POP'
    var popup = new CustomPopup(Mapper.latlng(58.4038594, 15.5407342), c)
    popup.map = this.map
  }
  addContentToMarkers (contentForMarker) {
    this.markers.forEach(contentForMarker)
  }
  addContent (marker, content, id, callback, sidebar, sidebarData) {
    // console.log(marker);
    if (typeof content === 'string' && typeof this.map !== 'undefined' && marker !== 'undefined') {
      var infoWindow = new google.maps.InfoWindow({
        content: "<div class='info-box-content'><h3 class='info-box-title'>" + content + '</h3><span class="info-box-small"><i>Klicka för att lägga till i listan.</i></span></div>'
      })
      marker.addListener('mouseover', function () {
        infoWindow.open(this.map, marker)
      })
      marker.addListener('mouseout', function () {
        infoWindow.close(this.map, marker)
      })
      marker.addListener('click', function () {
        // sidebar.addStat(sidebarData, content)
        callback(content, id)
        console.log(content)
      })
    } else {
      console.log('No marker, content or map provided')
    }
  }
  addMarkers ({markers, inClusters = false} = {}) {
    this.markers = markers.map(Mapper.makeMarker)
    if (inClusters) {
      var markerCluster = new MarkerClusterer(this.map, this.markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      })
      console.log(markerCluster)
    }
    return this.markers
  }
  static makeMarker (position) {
    var size = 40
    var marker = new google.maps.Marker({
      position: position,

      icon: {
        url: 'https://image.flaticon.com/icons/png/128/71/71422.png',
        scaledSize: new google.maps.Size(size, size),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(size / 2, size / 2)
      }
    })
    return marker
  }

  static markersFromPositions (positions) {
    return positions.map((p) => Mapper.makeMarker(p))
  }
  static latlng (lat, lng) {
    return {lat: lat, lng: lng}
  }
}
