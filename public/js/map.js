// This file is used to display the map on the listing show page. It uses the Mapbox GL JS library to display the map and the marker for the listing location. The map token is passed from the server to the client using a script tag in the EJS template. The map is initialized with the center and zoom level, and a marker is added to the map at the listing location.

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// Add a marker to the map at the listing location
const marker = new mapboxgl.Marker({ color: "red" }) // Set the marker color to red
    .setLngLat(listing.geometry.coordinates) //Listing geometry coordinates [lng, lat]
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location will beprovided after booking</p>`))
    .addTo(map);



