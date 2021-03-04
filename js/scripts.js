mapboxgl.accessToken = 'pk.eyJ1IjoiY2dtNDAyIiwiYSI6ImNra2lqZ3ltNTA4dTIydm52MzUycms0c2sifQ.7SbXsgoXVCjxbo33Zg_OYA';

var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-74.177229,40.734395], // starting position [lng, lat]
  zoom: 11.5 // starting zoom
});

// add a navigation control
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

$.getJSON('./data/coordinates1.json', function(floodRows) {

  floodRows.forEach(function(floodRow) {
    var html = `
      <div>
        <h5>${floodRow.name}</h5>
        data source: ${floodRow.source}
      </div>
    `

  //  all non-source tagged will be grey
    var color = 'steelblue'
    // if I wanted markers coloured by source
    if (floodRow.source === 'LTCP community meeting') {
        color = 'pink'
}/*
    if (floodRow.source === 'prestorm inspection list') {
      color = 'pink'
}
*/
    new mapboxgl.Marker({
      color: color,
      scale: 0.75,
    })
      .setLngLat([floodRow.longitude,floodRow.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(html)) // add popup
      .addTo(map);
  })
})

//adding chloropleth itree layer
// lots of help from https://ovrdc.github.io/gis-tutorials/mapbox/05-2-choropleth/#4/39.94/-95.52
map.on('style.load', function() {
  map.addSource('iTree', {
    'type': 'geojson',
    'data': './data/itreeppi1.geojson'
  });
  map.addLayer({
    'id': 'imperviousness',
    'type': 'fill',
    'source': 'iTree',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'fill-color': {
        'property': 'ppiimpervious',
        'stops': [
          [12.5, '#4dac26'],
          [25, '#8acb5d'],
          [37.5, '#c1e596'],
          [50, '#e5f1d7'],
          [62.5, '#f6e5ef'],
          [75, '#f2c0df'],
          [87.2, '#e374b8'],
          [100, '#d01c8b']
        ]
      },
      'fill-outline-color': 'white',
      'fill-opacity': 0.95
    }
  });
  map.addLayer({
    'id': 'density',
    'type': 'fill',
    'source': 'iTree',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-color': {
        'property': 'ppidefault',
        'stops': [
          [12.5, '#4dac26'],
          [25, '#8acb5d'],
          [37.5, '#c1e596'],
          [50, '#e5f1d7'],
          [62.5, '#f6e5ef'],
          [75, '#f2c0df'],
          [87.2, '#e374b8'],
          [100, '#d01c8b']
        ]
      },
      'fill-outline-color': 'white',
      'fill-opacity': 1
    }
  });
map.addLayer({
  'id': 'minority',
  'type': 'fill',
  'source': 'iTree',
  'layout': {
    'visibility': 'none'
  },
  'paint': {
    'fill-color': {
      'property': 'ppiminority',
      'stops': [
        [12.5, '#4dac26'],
        [25, '#8acb5d'],
        [37.5, '#c1e596'],
        [50, '#e5f1d7'],
        [62.5, '#f6e5ef'],
        [75, '#f2c0df'],
        [87.2, '#e374b8'],
        [100, '#d01c8b']
      ]
    },
    'fill-outline-color': 'white',
    'fill-opacity': 1
  }
  });
map.addLayer({
  'id': 'poverty',
  'type': 'fill',
  'source': 'iTree',
  'layout': {
    'visibility': 'none'
  },
  'paint': {
    'fill-color': {
      'property': 'ppipoverty',
      'stops': [
        [12.5, '#4dac26'],
        [25, '#8acb5d'],
        [37.5, '#c1e596'],
        [50, '#e5f1d7'],
        [62.5, '#f6e5ef'],
        [75, '#f2c0df'],
        [87.2, '#e374b8'],
        [100, '#d01c8b']
      ]
    },
    'fill-outline-color': 'white',
    'fill-opacity': 1
  }
  });
  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted lot
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 5,
      'line-opacity': 0.9,
      'line-color': 'white',
    }
  });

});


//adding vector flooding source layer
// lots of help from https://ovrdc.github.io/gis-tutorials/mapbox/05-2-choropleth/#4/39.94/-95.52
map.on('style.load', function() {
  map.addSource('flooding', {
    'type': 'geojson',
    'data': './data/lines.geojson'
  });
  map.addLayer({
    'id': 'floodingLayer',
    'type': 'line',
    'source': 'flooding',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-color': 'black',
      'line-width': 3    }
  });
});

//adding fill flooding source layer
map.on('style.load', function() {
  map.addSource('floodingEXT', {
    'type': 'geojson',
    'data': './data/shapes1.geojson'
  });
  map.addLayer({
    'id': 'floodingEXTLayer',
    'type': 'fill',
    'source': 'floodingEXT',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'fill-color': 'black',
      'fill-outline-color': 'black',
      'fill-opacity': 0.95,
}
  });
});


//toggle on/off layers from https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
// enumerate ids of the layers
var toggleableLayerIds = ['imperviousness','density','minority','poverty'];

// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        for (var j = 0; j < toggleableLayerIds.length; j++) {
          if (clickedLayer === toggleableLayerIds[j]) {
            layers.children[j].className = 'active';
            map.setLayoutProperty(toggleableLayerIds[j], 'visibility', 'visible');
          }
          else {
            layers.children[j].className = '';
            map.setLayoutProperty(toggleableLayerIds[j], 'visibility', 'none');
          }
  }

    };

var layers = document.getElementById('menu');
layers.appendChild(link);
}



//attempt to get hover popup working
// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});

map.on('mousemove', function (e) {
// query for the features under the mouse, but only in the lots layer
var features = map.queryRenderedFeatures(e.point, {
    layers: ['imperviousness','density','minority','poverty'],
});

if (features.length > 0) {
  // show the popup
  // Populate the popup and set its coordinates
  // based on the feature found.
  var hoveredFeature = features[0]
if (features[0].layer.id === 'imperviousness') {
  var blockID =  hoveredFeature.properties.ppiimpervious
} else if (features[0].layer.id === 'density') {
  var blockID = hoveredFeature.properties.ppidefault
} else if (features[0].layer.id === 'minority') {
  var blockID = hoveredFeature.properties.ppiminority
} else if (features[0].layer.id === 'poverty') {
  var blockID = hoveredFeature.properties.ppipoverty
}

  var popupContent = `
    <div>
      ${blockID}
    </div>
  `

  popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

  // set this lot's polygon feature as the data for the highlight source
  map.getSource('highlight-feature').setData(hoveredFeature.geometry);

  // show the cursor as a pointer
  map.getCanvas().style.cursor = 'pointer';
} else {
  // remove the Popup
  popup.remove();

  map.getCanvas().style.cursor = '';
}

})
