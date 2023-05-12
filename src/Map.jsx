import React, {
  forwardRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Viewer,
  Entity,
  ImageryLayer,
  CameraFlyTo,
  PointGraphics,
} from "resium";
import "cesium/Source/Widgets/widgets.css";
import { SingleTileImageryProvider, Rectangle, Cartesian3 } from "cesium";
import io from "socket.io-client";
import terrain from "./assets/terrain.jpeg";
const Map = forwardRef((props, ref) => {
  const socket = useMemo(() => io("http://localhost:4000"), []);

  const [coordinates, setCoordinates] = useState({
    lat: 40.59777,
    lon: -30.03883,
    height: 9000000,
  });
  const flyToLocation = useMemo(() => {
    console.log("MAP", coordinates);
    return Cartesian3.fromDegrees(
      coordinates.lon,
      coordinates.lat,
      coordinates.height
    );
  }, [coordinates]);

  const position = useMemo(() => {
    return Cartesian3.fromDegrees(coordinates.lon, coordinates.lat);
  }, [coordinates]);

  const rectangle = useMemo(() => {
    return Rectangle.fromDegrees(-180, -90, 180, 90);
  }, []);

  const blackTexture = useMemo(() => {
    return new SingleTileImageryProvider({
      url: terrain || undefined,
      rectangle: rectangle,
    });
  }, []);

  const [blobUrl, setBlobUrl] = useState(
    "https://www.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/5km/v3.1_op/image_plain/daily/sst/png/1985/coraltemp_v3.1_19850101.png"
  );

  const [imageryProvider, setImageryProvider] = useState(() => {
    return new SingleTileImageryProvider({
      url: blobUrl || undefined,
      rectangle: rectangle,
      credit: "NOAA",
    });
  });

  const updateImageryProvider = useCallback(
    (newBlobUrl) => {
      const newImageryProvider = new SingleTileImageryProvider({
        url: newBlobUrl || undefined,
        rectangle: rectangle,
        credit: "NOAA",
      });

      newImageryProvider.readyPromise.then(() => {
        console.log("Texture loaded");
      });

      setImageryProvider((prevProvider) => {
        if (prevProvider.url !== newBlobUrl) {
          return newImageryProvider;
        } else {
          return prevProvider;
        }
      });
    },
    [rectangle]
  );

  const dummyCredit = useMemo(() => document.createElement("div"), []);

  // useEffect(() => {
  //   socket.on("texture_sst", (data) => {
  //     if (data) {
  //       const blob = new Blob([data.buffer], { type: "image/png" });
  //       const url = URL.createObjectURL(blob);
  //       updateImageryProvider(url);
  //     }
  //   });

  //   return () => {
  //     socket.off("texture_sst");

  //     // socket.disconnect();
  //   };
  // }, [updateImageryProvider]);
  // const flyToLocationOut = useMemo(() => {
  //   console.log("memo out");
  //   return Cartesian3.fromDegrees(coordinates.lon, coordinates.lat, 900000);
  // }, [coordinates]);
  useEffect(() => {
    socket.on("texture_baa", (data) => {
      if (data) {
        const blob = new Blob([data.buffer], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        updateImageryProvider(url);
        console.log("TEXTURE BAA", data);
      }
    });

    socket.on("coords", (data) => {
      const coords = {
        lat: data[1],
        lon: data[0],
        height: 20000000,
      };
      setShouldRenderSecond(false);
      setCoordinates(coords);
      console.log(data);
    });

    return () => {
      socket.off("texture_baa");
      socket.off("coords");
      socket.disconnect();
    };
  }, [updateImageryProvider]);

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  const [shouldRenderSecond, setShouldRenderSecond] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldRenderSecond(true);
    }, 4500);
    return () => {
      clearTimeout(timeout);
    };
  }, [coordinates]);
  return (
    <Viewer
      ref={ref}
      full
      creditContainer={dummyCredit}
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
      imageryProvider={blackTexture}
    >
      <Entity name="My image layer" description="This is my texture layer">
        <ImageryLayer
          alpha={1}
          imageryProvider={imageryProvider}
          key={imageryProvider.url}
        />
      </Entity>
      <Entity position={position}>
        <PointGraphics
          pixelSize={15}
          color={Cesium.Color.TRANSPARENT}
          outlineWidth={2}
          outlineColor={Cesium.Color.BLACK}
        />
      </Entity>
      <CameraFlyTo duration={5} destination={flyToLocation} />
      {shouldRenderSecond && (
        <CameraFlyTo
          duration={3}
          destination={Cartesian3.fromDegrees(
            coordinates.lon,
            coordinates.lat,
            4000000
          )}
        />
      )}
      {/* <CameraFlyTo duration={5} destination={flyToLocationOut} /> */}
    </Viewer>
  );
});

export default Map;
