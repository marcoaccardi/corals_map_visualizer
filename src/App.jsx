import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// import Map from "./testComponents/Map";
import Map from "./Map";
import { Cartesian3 } from "cesium";

function App() {
  const socket = io("http://localhost:4000");
  const viewerRef = useRef(null);
  const [coordinates, setCoordinates] = useState({
    lat: 40.59777,
    lon: -30.03883,
    height: 5000000,
  });
  const [prevCoordinates, setPrevCoordinates] = useState(null);
  let coords;
  useEffect(() => {
    socket.on("coords", (data) => {
      // console.log(data);
      coords = {
        lat: data[1],
        lon: data[0],
        height: 9000000,
      };
      // console.log(coords);

      if (prevCoordinates) {
        // calculate distance between previous and new location
        const distance = Cartesian3.distance(
          Cartesian3.fromDegrees(
            prevCoordinates.lon,
            prevCoordinates.lat,
            prevCoordinates.height
          ),
          Cartesian3.fromDegrees(coords.lon, coords.lat, coords.height)
        );
        console.log(distance, "PREV COOORDS");

        if (distance > 10000) {
          console.log(distance, "> 10000");
          viewerRef.current.camera?.flyTo({
            destination: Cartesian3.fromDegrees(
              coords.lon,
              coords.lat,
              coords.height - 2000
            ),
            duration: 3,
          });
        } else {
          console.log(distance, "< 10000");
          viewerRef.current.camera?.flyTo({
            destination: Cartesian3.fromDegrees(
              coords.lon,
              coords.lat,
              coords.height + 100000
            ),
            duration: 3,
          });
        }
      }
      console.log(coords);
      setPrevCoordinates(coords);
      setCoordinates(coords);
    });
    // socket.on("imageUrl", (data) => {
    //   console.log(data);
    // });
    return () => {
      socket.off("coords");
      // socket.disconnect();
    };
  }, [socket, prevCoordinates]);

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  console.log("render", coordinates);
  return (
    <div>
      <Map ref={viewerRef} coordinates={coordinates} />
    </div>
  );
}

export default App;
