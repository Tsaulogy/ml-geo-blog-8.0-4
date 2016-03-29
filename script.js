function initMap() {
  var mapDiv = document.getElementById('map');
  var map;
  var pointsArray = [];
  var linesArray = [];
  var approxArray = [];

  map = new google.maps.Map(mapDiv, {
    center: { lat: 37.50716, lng: -122.2117 },
    zoom: 12
  });

  map.data.setStyle({
    fillColor:'gray',
    strokeColor: 'black'
    //draggable: true
    //editable: true   
  });

  map.data.addListener('click', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {
      fillColor: 'orange',
      strokeColor: 'orange'
    });

    var selectPoly = event.feature.getGeometry();
    $.ajax({
      type: 'POST',
      url: 'result.sjs',
      data: JSON.stringify(selectPoly),
      contentType: 'application/json',
      dataType: 'json',
      success: updatePageWithSelectPoly
    });
  });

  map.data.loadGeoJson('marklogic.json');
  
  // map the generated interior point for the selected polygon
  $("#button-interior-point").on("click", function(){
    var interPointGeojsonValue = $("#interior-point").text();
    var interPointLatLngValue = $("#interior-point-latlng").text();
    if (isJSON(interPointLatLngValue)) {
      addMarker(jQuery.parseJSON(interPointLatLngValue), jQuery.parseJSON(interPointGeojsonValue), pointsArray);
    }
    else 
      noSelectionError();
  });

  // map the linestring that was converted from the selected polygon
  $("#button-poly-to-line").on("click", function(){
    var lineGeojsonValue = $("#poly-to-line").text();
    var lineLatLngValue = $("#poly-to-line-latlng").text();
    if (isJSON(lineLatLngValue)) {
      addMarker(jQuery.parseJSON(lineLatLngValue), jQuery.parseJSON(lineGeojsonValue), linesArray);
    }
    else
      noSelectionError();
  });
    
  // map the approximated region based on the input threshold
  $("#region-approx-submit").click(function(event) {
    event.preventDefault();
    var selectRegion = $("#geojson").text();
    var inputThreshold = $("#threshold").val();
    if (selectRegion == "") {
      noSelectionError();
    }
    else if (inputThreshold == "" || isNaN(inputThreshold) ) {
      alert("You need to input a threshold value (#)");
    }
    else {
      $.ajax({
        type: 'POST',
        url: 'region-approx.sjs',
        data: JSON.stringify({ region: jQuery.parseJSON(selectRegion), threshold: inputThreshold }),
        contentType: 'application/json',
        dataType: 'json',
        success: updatePageWithRegionApprox
      });                
    }
  });

  $("#clean-map").on("click", function(){
    clearMarkers(map);
  });

  
  // ajax response when a shape on Google Maps is selected
  function updatePageWithSelectPoly ( result ) {
    $("#result-package").html(JSON.stringify(result));
    $("#vertices").html(JSON.stringify(result.vertices));
    $("#distinct-vertices").html(JSON.stringify(result.distinctVertices));
    $("#interior-point").html(JSON.stringify(result.interiorPoint));
    $("#interior-point-latlng").html(JSON.stringify(result.interiorPointLatLng));
    $("#poly-to-line").html(JSON.stringify(result.polyToLine));
    $("#poly-to-line-latlng").html(JSON.stringify(result.polyToLineLatLng));
    $("#ctsregion").html(JSON.stringify(result.ctsregion));
    $("#geojson").html(JSON.stringify(result.geojson));
    $("#kml").html(JSON.stringify(result.kml));
    $("#gml").html(JSON.stringify(result.gml));
    $("#georss").html(JSON.stringify(result.georss));
    $("#wkt").html(JSON.stringify(result.wkt));
    $("#wkb").html(JSON.stringify(result.wkb));
  }

  // ajax response when user asks to approximate region
  function updatePageWithRegionApprox ( result ) {
    $("#region-approx").html(JSON.stringify(result.approxRegionGeojson));
    $("#region-approx-latlng").html(JSON.stringify(result.approxRegionLatLng));
    var approxGeojsonValue = $("#region-approx").text();
    var approxLatLngValue = $("#region-approx-latlng").text();
    
    addMarker(jQuery.parseJSON(approxLatLngValue), jQuery.parseJSON(approxGeojsonValue), approxArray);
  }

  // check if string can be parsed to JSON object
  function isJSON ( str ) {
    try {
      jQuery.parseJSON(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  // error message when no polygon is selected
  function noSelectionError () {
    alert("Please select a polygon on the map first.");
  }

  // adds a marker to the map and push to the array
  function addMarker ( locationLatLng, locationGeojson, array) {
    if (locationGeojson.type == "Point") {
      var marker = new google.maps.Marker({
        position: locationLatLng,
        map: map,
        draggable: true
      });
      array.push(marker);
    }
    else if (locationGeojson.type == "LineString") {
      var line = new google.maps.Polyline({
        path: locationLatLng,
        map: map,
        draggable: true
      });
      array.push(line);
    }
    else if (locationGeojson.type == "Polygon") {
      var polygon = new google.maps.Polygon({
        path: locationLatLng,
        map: map,
        draggable: true
      });
      array.push(polygon);
    }
  }

  // sets the map on all markers in the array -- currently not used b/c only one map
  function setMarkersOnMap ( map, array ) {
    for (var i = 0; i < array.length; i++) {
      array[i].setMap(map);
    }
  }
  // removes the markers from the map, but keeps them in the array
  function clearMarkers ( map ) {
    setMarkersOnMap(null, pointsArray);
    setMarkersOnMap(null, linesArray);
    setMarkersOnMap(null, approxArray)
  }

  // shows any markers currently in the array
  function showMarkers ( map , array ) {
    setMarkersOnMap(map, array);
  }

  // deletes all markers in the array by removing references to them
  function deleteMarkers ( map, array ) {
    clearMarkers(map);
    array = [];
  }
}