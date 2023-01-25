
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: campground.geometry.coordinates, 
    // starting position [lng, lat]
    zoom: 8, // starting zoom
    });
 


    const marker = new mapboxgl.Marker().setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h1>${campground.title}</h1> <p>${campground.location}</p>`)) 
    .addTo(map);