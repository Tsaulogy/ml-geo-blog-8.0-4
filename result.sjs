xdmp.setResponseContentType("application/json");

// import module "namespaces"
var geo = require("/MarkLogic/geospatial/geospatial.xqy");
var geojson = require('/MarkLogic/geospatial/geojson.xqy');
var geokml = require('/MarkLogic/geospatial/kml.xqy');
var geogml = require('/MarkLogic/geospatial/gml.xqy');
var georss = require('/MarkLogic/geospatial/georss.xqy');
var convert = require('convert.sjs');

/******************* start of main ***********************/

var inputPoly = xdmp.getRequestBody();
var ctsRegion = convertGoogObjToCtsRegion(inputPoly);

var result = new ResultClass();

result.ctsregion = ctsRegion;


// NEW 8.0-4 APIs
result.vertices = geo.countVertices(ctsRegion);
result.distinctVertices = geo.countDistinctVertices(ctsRegion);
result.geojson = geojson.toGeojson(ctsRegion);
result.kml = geokml.toKml(ctsRegion);
result.gml = geogml.toGml(ctsRegion);
result.georss = georss.toGeorss(ctsRegion);
result.wkb = xdmp.describe(geo.toWkb(ctsRegion));
result.interiorPoint = geojson.toGeojson(geo.interiorPoint(ctsRegion));
result.polyToLine = geojson.toGeojson(geo.polygonToLinestring(ctsRegion));
// End of NEW 8.0-4 APIs


result.wkt = geo.toWkt(ctsRegion);
result.interiorPointLatLng = convert.geojsonToGoogLatLng(result.interiorPoint);
result.linestringLatLng = convert.geojsonToGoogLatLng(result.linestring);
result.polyToLineLatLng = convert.geojsonToGoogLatLng(result.polyToLine);

result;

/******************* end of main *************************/

/*********************** functions **********************/

function ResultClass () {
  this.ctsregion;
  this.vertices;
  this.distinctVertices;
  this.geojson;
  this.kml;
  this.gml;
  this.georss;
  this.wkt;
  this.wkb;
  this.interiorPoint;
  this.interiorPointLatLng;
  this.polyToLine;
  this.polyToLineLatLng;
}

function GeometryClass () {
  this.type = "Polygon";
  this.coordinates = [];
}

// convert Google Maps Geometry object to cts.region
function convertGoogObjToCtsRegion ( input ) {
  var geojsonObject = new GeometryClass();

  // convert to Google Maps Geometry object to GeoJSON geometry
  var inputValueIt = xdmp.toJSON(input);
  var inputValueItCoord = inputValueIt.root.xpath("/j/j/data(.)");

  for (var i of inputValueItCoord) {    
    var coord = [i.lng, i.lat];
    geojsonObject.coordinates.push(coord);
  }

  geojsonObject.coordinates = [geojsonObject.coordinates];

  // NEW 8.0-4 API: convert from GeoJSON to cts.region
  return geojson.parseGeojson(geojsonObject);
}

/****************** end of functions ********************/
