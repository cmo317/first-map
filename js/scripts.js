mapboxgl.accessToken = 'pk.eyJ1IjoiY2dtNDAyIiwiYSI6ImNra2lqZ3ltNTA4dTIydm52MzUycms0c2sifQ.7SbXsgoXVCjxbo33Zg_OYA';

var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
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
      color: color
    })
      .setLngLat([floodRow.longitude,floodRow.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(html)) // add popup
      .addTo(map);
  })
})
