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

$.getJSON('./data/coordinates.json', function(floodRows) {

  floodRows.forEach(function(floodRow) {
    console.log(floodRows.name)

    var html = `
      <div>
        <h3>${floodRow.name}</h3>
      </div>
    `

  //  all non MUP and CUSP will be this color
    var color = 'green'
    if (floodRow.source === 'npd advisory') {
        color = 'blue'
}
    if (floodRow.source === 'prestorm inspection list') {
      color = 'pink'
}

    new mapboxgl.Marker({
      color: color,
      scale: 0.5,
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
    'data': './data/itreeppi.geojson'
  });
  map.addLayer({
    'id': 'iTreeLayer',
    'type': 'fill',
    'source': 'iTree',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'fill-color': {
        'property': 'iTree ppi updated_Priority Index',
        'stops': [
          [1, '#4dac26'],
          [12.5, '#8acb5d'],
          [25, '#c1e596'],
          [37.5, '#e5f1d7'],
          [50, '#f6e5ef'],
          [62.5, '#f2c0df'],
          [75, '#e374b8'],
          [87.2, 'orange'],
          [100, '#d01c8b']
        ]
      },
      'fill-outline-color': 'white',
      'fill-opacity': 0.95
    }
  });
});

//toggle on/off layers from https://docs.mapbox.com/mapbox-gl-js/example/toggle-layers/
// enumerate ids of the layers
var toggleableLayerIds = ['iTreeLayer'];

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

var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

// toggle layer visibility by changing the layout object's visibility property
if (visibility === 'visible') {
map.setLayoutProperty(clickedLayer, 'visibility', 'none');
this.className = '';
} else {
this.className = 'active';
map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
}
};

var layers = document.getElementById('menu');
layers.appendChild(link);
}
