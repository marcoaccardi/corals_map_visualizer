// import React, { forwardRef, useMemo, useState, useEffect } from "react";
// import { Viewer, Entity, ImageryLayer, CameraFlyTo } from "resium";
// import "cesium/Source/Widgets/widgets.css";
// import { SingleTileImageryProvider, Rectangle, Cartesian3 } from "cesium";
// import io from "socket.io-client";
// import image from "./assets/dhw.png";

// // ZOOM_IN-ZOOM_OUT
// // CHANGE ALPHA CHANNEL ON CHANGE
// const Map = forwardRef((props, ref) => {
//   const { coordinates } = props;
//   const flyToLocation = useMemo(() => {
//     return Cartesian3.fromDegrees(
//       coordinates.lon,
//       coordinates.lat,
//       coordinates.height
//     );
//   }, [coordinates]);

//   const rectangle = useMemo(() => {
//     return Rectangle.fromDegrees(-180, -90, 180, 90);
//   }, []);

//   const [imageUrl, setImageUrl] = useState("");

//   const imageryProvider = useMemo(() => {
//     return new SingleTileImageryProvider({
//       url: imageUrl,
//       rectangle: rectangle,
//       credit: "NOAA",
//     });
//   }, [imageUrl, rectangle]);

//   const dummyCredit = useMemo(() => document.createElement("div"), []);

//   const socket = io("http://localhost:4000");
//   useEffect(() => {
//     socket.on("image-data", (data) => {
//       setImageUrl(URL.createObjectURL(new Blob([data])));
//     });

//     socket.on("image-end", () => {
//       console.log("Image transmission complete");
//     });

//     return () => {
//       socket.off("image-data");
//       socket.off("image-end");
//     };
//   }, []);

//   return (
//     <Viewer
//       ref={ref}
//       full
//       creditContainer={dummyCredit}
//       animation={false}
//       baseLayerPicker={false}
//       fullscreenButton={false}
//       geocoder={false}
//       homeButton={false}
//       infoBox={false}
//       sceneModePicker={false}
//       selectionIndicator={false}
//       timeline={false}
//       navigationHelpButton={false}
//     >
//       <Entity name="My image layer" description="This is my texture layer">
//         <ImageryLayer alpha={0.8} imageryProvider={imageryProvider} />
//         <CameraFlyTo duration={5} destination={flyToLocation} />
//       </Entity>
//     </Viewer>
//   );
// });

// export default Map;
import React, { forwardRef, useMemo, useState, useEffect } from "react";
import { Viewer, Entity, ImageryLayer, CameraFlyTo } from "resium";
import "cesium/Source/Widgets/widgets.css";
import { SingleTileImageryProvider, Rectangle, Cartesian3 } from "cesium";
import io from "socket.io-client";

const Map = forwardRef((props, ref) => {
  const { coordinates } = props;
  const flyToLocation = useMemo(() => {
    return Cartesian3.fromDegrees(
      coordinates.lon,
      coordinates.lat,
      coordinates.height
    );
  }, [coordinates]);

  const rectangle = useMemo(() => {
    return Rectangle.fromDegrees(-180, -90, 180, 90);
  }, []);

  const [blobUrl, setBlobUrl] = useState(
    "https://www.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/5km/v3.1_op/image_plain/daily/sst/png/1985/coraltemp_v3.1_19850101.png"
  );

  const imageryProvider = useMemo(() => {
    return new SingleTileImageryProvider({
      url: blobUrl || undefined, // Use undefined if blobUrl is empty
      rectangle: rectangle,
      credit: "NOAA",
    });
  }, [blobUrl]);

  const dummyCredit = useMemo(() => document.createElement("div"), []);

  const socket = io(
    "http://localhost:4000",
    // {transports: ["websocket"]},
    {
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    }
  );
  useEffect(() => {
    socket.on("image-data", (data) => {
      const blob = new Blob([data], { type: "image/png" });
      const blobUrl = URL.createObjectURL(blob);
      console.log(blobUrl);
      setBlobUrl(blobUrl);
    });

    socket.on("image-end", () => {
      console.log("Image transmission complete");
    });

    return () => {
      socket.off("image-data");
      socket.off("image-end");
    };
  }, [blobUrl]);

  return (
    <Viewer
      ref={ref}
      full
      creditContainer={null}
      animation={false}
      baseLayerPicker={false}
      fullscreenButton={false}
      geocoder={false}
      homeButton={false}
      infoBox={false}
      sceneModePicker={false}
      selectionIndicator={false}
      timeline={false}
      navigationHelpButton={false}
    >
      <Entity name="My image layer" description="This is my texture layer">
        <ImageryLayer alpha={0.8} imageryProvider={imageryProvider} />
        <CameraFlyTo duration={5} destination={flyToLocation} />
      </Entity>
    </Viewer>
  );
});

export default Map;
