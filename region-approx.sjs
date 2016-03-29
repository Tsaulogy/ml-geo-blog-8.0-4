xdmp.setResponseContentType("application/json");

// import module "namespaces"
var geo = require("/MarkLogic/geospatial/geospatial.xqy");
var geojson = require('/MarkLogic/geospatial/geojson.xqy');
var geokml = require('/MarkLogic/geospatial/kml.xqy');
var geogml = require('/MarkLogic/geospatial/gml.xqy');
var georss = require('/MarkLogic/geospatial/georss.xqy');

/******************* start of main ***********************/

var input = xdmp.getRequestBody();
var inputJson= xdmp.toJSON(input);
var inputRegionObject = inputJson.root.xpath("/region/data(.)");
var inputRegionObjectNode = xdmp.toJSON(inputRegionObject).root;
var inputPoly = geojson.parseGeojson(inputRegionObjectNode);

var inputThresholdObject = inputJson.root.xpath("/threshold/data(.)");

var result = new ResultClass();

// NEW 8.0-4 API
var approxRegion = geo.regionApproximate(inputPoly, inputThresholdObject);

result.approxRegionGeojson = geojson.toGeojson(approxRegion);
result.approxRegionLatLng = convertGeojsonToGoogLatLng(result.approxRegionGeojson);

result;

/******************* end of main *************************/

/*********************** functions **********************/

function ResultClass () {
  this.approxRegionGeojson;
  this.approxRegionLatLng
}

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
/****************** end of functions ********************/
