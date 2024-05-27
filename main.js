// Museum locations in Antwerp
let museums = [
  { name: "Plantin-Moretus Museum", lat: 51.2187, lon: 4.3974 },
  { name: "Museum aan de Stroom (MAS)", lat: 51.2282, lon: 4.4043 },
  { name: "Rubens House", lat: 51.2156, lon: 4.4105 },
  { name: "Red Star Line Museum", lat: 51.2295, lon: 4.4049 },
  { name: "Royal Museum of Fine Arts Antwerp", lat: 51.2123, lon: 4.3956 },
];

let visitedMuseums = [];
let userMarker = null;

const map = L.map('map').setView([51.2194, 4.4025], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Add markers to the map for each museum
museums.forEach((museum, index) => {
  const marker = L.marker([museum.lat, museum.lon]).addTo(map)
    .bindPopup(`<b>${museum.name}</b><br><button class="assign-btn" data-museum="${index + 1}">Take a Photo</button>`);

  marker.on('click', () => {
    marker.setIcon(L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      shadowSize: [50, 64],
      shadowAnchor: [4, 62],
    }));
  });

  marker.on('popupopen', () => {
    document.querySelector(`.assign-btn[data-museum="${index + 1}"]`).addEventListener('click', () => {
      checkGeolocation(index + 1);
    });
  });
});

// Add event listeners to the upload buttons
document.querySelectorAll('.upload-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const museumIndex = btn.getAttribute('data-museum');
    checkGeolocation(museumIndex);
  });
});

// Add event listener to the locate button
document.getElementById('locate-btn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        if (userMarker) {
          userMarker.setLatLng([latitude, longitude]);
        } else {
          userMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
              iconSize: [38, 95],
              iconAnchor: [22, 94],
              popupAnchor: [-3, -76],
              shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
              shadowSize: [50, 64],
              shadowAnchor: [4, 62],
            })
          }).addTo(map);
        }
        map.setView([latitude, longitude], 13);
      },
      () => {
        document.getElementById('feedback').innerText = "Geolocation failed!";
      }
    );
  } else {
    document.getElementById('feedback').innerText = "Geolocation is not supported by this browser.";
  }
});

function checkGeolocation(museumIndex) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        if (userMarker) {
          userMarker.setLatLng([latitude, longitude]);
        } else {
          userMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
              iconSize: [38, 95],
              iconAnchor: [22, 94],
              popupAnchor: [-3, -76],
              shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
              shadowSize: [50, 64],
              shadowAnchor: [4, 62],
            })
          }).addTo(map);
        }
        if (isNearMuseum(latitude, longitude, museumIndex)) {
          document.getElementById('photo-input').click();
          document.getElementById('photo-input').onchange = function () {
            handleFileUpload(museumIndex);
          };
        } else {
          document.getElementById('feedback').innerText = "You are not near the museum!";
        }
      },
      () => {
        document.getElementById('feedback').innerText = "Geolocation failed!";
      }
    );
  } else {
    document.getElementById('feedback').innerText = "Geolocation is not supported by this browser.";
  }
}

function isNearMuseum(lat, lon, museumIndex) {
  const museum = museums[museumIndex - 1];
  const distance = getDistanceFromLatLonInKm(lat, lon, museum.lat, museum.lon);
  return distance < 0.1; // 100 meters
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function handleFileUpload(museumIndex) {
  const file = document.getElementById('photo-input').files[0];
  if (file) {
    visitedMuseums.push(museumIndex);
    document.getElementById('feedback').innerText = `Photo for museum ${museumIndex} uploaded successfully!`;
    if (visitedMuseums.length === museums.length) {
      document.getElementById('feedback').innerText += " Congratulations! You've visited all the museums!";
    }
  }
}
