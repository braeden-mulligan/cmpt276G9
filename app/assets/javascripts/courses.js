// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/
//

function createInit(){

	var coords = [];
	var markersArr = [];
	var lines = []; //stores polylines
	var j = 0; // length of markerArr
	var k = 0; // index of lines[]
	var runningPath; //polyline of markers

	$("#cc").click(function(){
		var arr = [];
		var point = [];
		var pack = "[";

		var n = coords.length;
		for(var i = 0; i < (n-1); i++){
			arr[i] = [coords[i]["lat"], coords[i]["lng"]];
			pack = pack + "[" + arr[i] + "], ";
		};
			pack = pack + "[" + coords[n-1]["lat"] +","+coords[n-1]["lng"] + "]";
			pack = pack + "]";
		var n = $("#cn").val();
		var r = $("#cr").val();

		//for debugging only.
		alert("data package: " + n +", " + r + ", " + pack);

		$.ajax({
			type: "POST",
			url: "/create",
			data: {name: n, region: r, coords: pack},
			success: function(){
				alert("posted");
			},
			error: function(){
				alert("fail");
			}
		});
	});

  //setting up initial map of Vancouver
	var map = new google.maps.Map(document.getElementById('mapcreate'), {
		center: {lat: 49.27750, lng: -122.91450},
		zoom: 17
	});

	if( navigator.geolocation ){
		navigator.geolocation.getCurrentPosition(showPosition, errorMessage);
	}
	else{
		alert("Error: This browser does not support geolocation.");
	}

	var infoWindowStart, infoWindowEnd;

	google.maps.event.addListener(map, "click", function (event) {
    	var latitude = event.latLng.lat();
			var longitude = event.latLng.lng();

			pos = {
	      lat: latitude,
	      lng: longitude
	    };

	    coords.push(pos);

			var marker = new google.maps.Marker(
				{ map: map,
					unique_id: j,    //able to identify a specific marker to do stuff to
					position: pos,
					draggable: true
				}
			);
			j++;

			markersArr.push(marker);
			marker.setPosition(markersArr[markersArr.length - 1].position);
	//    marker.setPosition(pos);





				updatePath();

				//redraw polyline after a marker is dragged in place
				google.maps.event.addListener(marker, 'dragend', function() {

					var	position = this.getPosition(); //get LatLng of marker
					var index = markersArr.indexOf(this); //get the index of this marker

					coords[index] = position;	//update new coordinate in array

					updatePath();
				});
	});

	function updatePath(){

		runningPath = new google.maps.Polyline({
		  path: coords,
		  geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
		});

		if (lines.length > 0){
			lines[lines.length - 1].setMap(null); //removes previous polyline from map
		}

		lines.push(runningPath);
		lines[lines.length -1].setMap(map); //sets the new polyline on map
	}
/*
	function windowsDisplay(){
		//show infowindow to show where the start marker is
		if (infoWindowStart == null && markersArr.length > 0){
					infoWindowStart = new google.maps.InfoWindow({map: map});
					infoWindowStart.setContent("Start");
					infoWindowStart.open(map, markersArr[0]); //infowindow to indicate first marker placed
		}
		//show infowindow to show where the last marker is
		if (markersArr.length > 1){
			if(infoWindowEnd == null){
				infoWindowEnd = new google.maps.InfoWindow({map: map});
				infoWindowEnd.setContent("End");
				infoWindowEnd.open(map, markersArr[markersArr.length - 1]); //infowindow to indicate last marker placed
	//					infoWindowEnd.setPosition(coords.length - 1);
				}
	//						infoWindowEnd.close();
					infoWindowEnd.setPosition(coords.length -1);
		}
	}
	*/
///////////////////
	function showPosition(position){
    	pos = {
    		lat: position.coords.latitude,
    		lng: position.coords.longitude
   		};
    	map.setCenter(pos);
	};
}

function errorMessage(error){
	alert("Error: Location info is unavailable.");
};
