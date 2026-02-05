// Safety check
console.log("Map JS Loaded");
console.log(mapLat, mapLng);

// Create map
const map = L.map("map");

// Add tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Red marker icon
const redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Marker + popup (auto open)
L.marker([mapLat, mapLng], { icon: redIcon })
  .addTo(map)
  .bindPopup(
  `<h5>${mapTitle}</h5>
   <p>Exact location will be provided after booking!</p>`
)

  .openPopup();

// Center map
map.setView([mapLat, mapLng], 12);
