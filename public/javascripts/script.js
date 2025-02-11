const socket = io();

const map = L.map("map").setView([0, 0], 15);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; Ray'
}).addTo(map);

const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending location:", latitude, longitude);

            socket.emit("send-location", { latitude, longitude });

            if (markers["my-location"]) {
                markers["my-location"].setLatLng([latitude, longitude]);
            } else {
                markers["my-location"] = L.marker([latitude, longitude]).addTo(map);
            }

            map.setView([latitude, longitude], 16);
        },
        (error) => {
            console.error("Geolocation Error:", error);
            alert("Error getting location. Please make sure location services are enabled.");
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}



socket.on("receive-location", (data) => {
    console.log("Received location:", data); 
    const { id, latitude, longitude } = data;

  
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    map.setView([latitude, longitude], 16);
});


socket.on("user-disconnected", function(id) {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});