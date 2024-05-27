// Museum locations in Antwerp
let museums = [
    { name: "Museum 1", lat: 51.2194, lon: 4.4025 },
    { name: "Museum 2", lat: 51.2167, lon: 4.4000 },
    { name: "Museum 3", lat: 51.2130, lon: 4.3971 },
    { name: "Museum 4", lat: 51.2200, lon: 4.4050 },
    { name: "Museum 5", lat: 51.2215, lon: 4.4044 },
  ];
  
  let visitedMuseums = [];
  
  const map = L.map('map').setView([51.2194, 4.4025], 13);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);
  
  // Add markers to the map for each museum
  museums.forEach((museum, index) => {
    L.marker([museum.lat, museum.lon]).addTo(map)
      .bindPopup(`<b>${museum.name}</b>`).openPopup();
  });
  
  // Add event listeners to the upload buttons
  document.querySelectorAll('.upload-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const museumIndex = btn.getAttribute('data-museum');
      checkGeolocation(museumIndex);
    });
  });
  
  function checkGeolocation(museumIndex) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
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
      document.getElementById('feedback').innerText = `Photo for Museum ${museumIndex} uploaded!`;
      if (visitedMuseums.length === museums.length) {
        document.getElementById('feedback').innerText = "Congratulations! You visited all museums!";
      }
    }
  }
  