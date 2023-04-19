import React, { useEffect, useRef, useState } from "react";
import { Map } from "./map";

// import Util from "./script/util";
// import DataProcess from "./script/dataProcess"
// import CustomPrimitive from "./script/customPrimitive"
// import ParticlesComputing from "./script/particlesComputing"
// import ParticlesRendering from "./script/particlesRendering"
// import ParticleSystem from "./script/particleSystem"

import Panel from "./script/gui"
import Wind3D from "./script/wind3D"

const mode = { debug: false };
export const Cesium = () => {
  // const viewerRef = useRef(null);
  // const [coordinates, setCoordinates] = useState({
  //   lat: 40.59777,
  //   lon: -30.03883,
  //   height: 5000000,
  // });

  useEffect(() => {
    let panel = new Panel();
    let wind3D = new Wind3D(panel, mode);
  }, [])

  return (
    <>
      {/* <Map ref={viewerRef} coordinates={coordinates} /> */}
    </>
  )
}