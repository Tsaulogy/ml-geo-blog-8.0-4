// convert a GeoJSON Object to Google Maps Geometry coordinates that can be mapped
function convertGeojsonToGoogLatLng ( input ) {
  var geojsonDoc = xdmp.toJSON(input);
  var geojsonDocType = geojsonDoc.root.type;
  var geojsonDocCoord = geojsonDoc.root.coordinates;
  var latLng = {};
  var latLngArray = [];

  if ( geojsonDocType == "Point" ) {
    return latLng = {"lat": geojsonDocCoord[1], "lng": geojsonDocCoord[0]};
  }
  else if ( geojsonDocType == "LineString" ) {
    for (var i = 0; i < geojsonDocCoord.length; i++) {
      latLng = {"lat": geojsonDocCoord[i][1], "lng": geojsonDocCoord[i][0]};
      latLngArray.push(latLng);
    }
      return latLngArray;
  }
  else if ( geojsonDocType == "Polygon" ) {
    for (var i = 0; i < geojsonDocCoord[0].length; i++) {
      latLng = {"lat": geojsonDocCoord[0][i][1], "lng": geojsonDocCoord[0][i][0]};
      latLngArray.push(latLng);
    }
    return latLngArray;
  }
}

module.exports = {
  // Export the "private" function with a public name
  geojsonToGoogLatLng: convertGeojsonToGoogLatLng
};
