/**
 * Created by Tyler on 8/26/2016.
 */
var map, trampingFL, itemsLayer, markers, markersArray = [];
function initialize(){
  map = L.map('map', {'center': L.latLng(38, -97), 'zoom':5,'worldCopyJump':true});
}

function addBaseMaps(){
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function realtimeJsonLayer() {
  var realtime = L.realtime({
    url: 'https://api.close5.com/items',
    crossOrigin: true,
    type: 'json',
    success: function(res) {
      // Translates json into geoJSON for use by Leaflet
      var newFeature = {};
      res.type = 'FeatureCollection';
      res.features = [];
      res.rows.forEach(function(item) {
        newFeature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: item.loc.reverse()
          },
          properties: item
        };
        res.features.push(newFeature);
      });
      delete res.rows;
    }
  }, {
    interval: 3 * 1000,

    pointToLayer: function (feature) {
      return L.marker(feature.geometry.coordinates.reverse(), {bounceOnAdd: true});
    },
    onEachFeature: function (feature, layer) {
      var popupContent = document.createElement('div');
      var popupDesc = document.createElement('div');
      var popupDescText = document.createTextNode(feature.properties.shortDescription || feature.properties.description);
      var popupSeller = document.createElement('div');
      var popupSellerText = document.createTextNode('By: ' + feature.properties.owner.name + ' ' + feature.properties.owner.lastInitial);
      popupDesc.appendChild(popupDescText);
      popupSeller.appendChild(popupSellerText);
      popupContent.appendChild(popupDesc).appendChild(popupSeller);
      layer.bindPopup(popupContent);
    }
  }).addTo(map);

  realtime.on('update', function(updateData) {
    //map.fitBounds(realtime.getBounds());
  });

}

initialize();
addBaseMaps();
realtimeJsonLayer();
