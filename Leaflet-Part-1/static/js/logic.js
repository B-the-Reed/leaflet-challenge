let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



d3.json(queryUrl).then(function (data) {
    
    createFeatures(data.features)

  });


function createFeatures(earthquakeData) {

    function forEachPoint(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    };


    function pointColor(feature){
      let depth = feature.geometry.coordinates[2];
      let pointColor = getColor(depth);
      return pointColor;
    }


    // let depth = feature.geometry.coordinates[2];
    // let pointColor = getColor(depth);

    function getColor(depth){
      if (depth < 10){
        return "#fec9c9" // light red
      } 
      else if (depth < 30){
        return "#f99"
      }
      else if (depth < 50){
        return "#ff6868"
      }
      else if (depth < 70){
        return "#ff3737"
      }
      else if (depth < 90){
        return "#d40000"
      }
      else {
        return "#a30000"
      }
    };

    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: forEachPoint, 
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: (feature.properties.mag * 10),
          fillColor: pointColor(feature), 
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
    }});

      console.log("earthquakes!", earthquakes);
  
    
      // Send our earthquakes layer to the createMap function/
      createMap(earthquakes);

};


function createMap(earthquakes){
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
    
     // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topo Map": topo
    };

    let myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
      });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    let legend = L.control({
      position: "bottomright"
    });

    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
  
      let legendDepth = [-10, 10, 30, 50, 70, 90];
      let legendColors = [
        "#fec9c9",
        "#f99",
        "#ff6868",
        "#ff3737",
        "#d40000",
        "#a30000"];
      

      div.innerHTML = '<h2> Earthquake Depth </h2>'

      // Loop through our intervals and generate a label with a colored square for each interval.
      for (let i = 0; i < legendDepth.length; i++) {
        div.innerHTML += "<li style='background: "
          + legendColors[i]
          + "'>"
          + legendDepth[i]
          + (legendDepth[i + 1] ? "&ndash;" + legendDepth[i + 1] + "<br>" : "+")
          +  "</li>";

      }
      return div;
    };
    
    legend.addTo(myMap) 
  
  }



