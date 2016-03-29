xdmp.setResponseContentType("application/json");

// import module "namespaces"
var geo = require("/MarkLogic/geospatial/geospatial.xqy");
var geojson = require('/MarkLogic/geospatial/geojson.xqy');
var geokml = require('/MarkLogic/geospatial/kml.xqy');
var geogml = require('/MarkLogic/geospatial/gml.xqy');
var georss = require('/MarkLogic/geospatial/georss.xqy');
var convert = require('convert.sjs');

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
result.approxRegionLatLng = convert.geojsonToGoogLatLng(result.approxRegionGeojson);

result;

/******************* end of main *************************/

/*********************** functions **********************/

function ResultClass () {
  this.approxRegionGeojson;
  this.approxRegionLatLng
}

/****************** end of functions ********************/
