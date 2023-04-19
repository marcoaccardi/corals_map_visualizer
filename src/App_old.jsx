/* import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Map from "./Map";

function App() {
  const socket = io("http://localhost:4000");
  const [coordinates, setCoordinates] = useState({
    lat: 40.59777,
    lon: -30.03883,
    height: 9000000,
  });
  const viewerRef = useRef(null);

  useEffect(() => {
    socket.on("coords", (data) => {
      console.log(data);
      let coords = {
        lat: data[1],
        lon: data[0],
        height: 5000000,
      };
      console.log(coords);
      setCoordinates(coords);
      viewerRef.current.camera?.flyTo({
        destination: Cartesian3.fromDegrees(
          coords.lon,
          coords.lat,
          coords.height
        ),
        duration: 5,
      });
    });
    return () => {
      socket.off("coords");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <Map ref={viewerRef} coordinates={coordinates} />
    </div>
  );
}

export default App;
 */

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// import Map from "./testComponents/Map";
import Map from "./Map";
import { Cartesian3 } from "cesium";

function App() {
  const socket = io("http://localhost:4000");
  const [coordinates, setCoordinates] = useState({
    lat: 40.59777,
    lon: -30.03883,
    height: 5000000,
  });
  const [prevCoordinates, setPrevCoordinates] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    socket.on("coords", (data) => {
      // console.log(data);
      let coords = {
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

        if (distance > 10000) {
          // zoom out if the distance is greater than 1000000 meters
          viewerRef.current.camera?.flyTo({
            destination: Cartesian3.fromDegrees(
              coords.lon,
              coords.lat,
              coords.height - 2000
            ),
            duration: 3,
          });
        } else {
          // zoom in if the distance is less than or equal to 1000000 meters
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
  return (
    <div>
      <Map ref={viewerRef} coordinates={coordinates} />
      {/* <WindDataComponent /> */}
    </div>
  );
}

export default App;
