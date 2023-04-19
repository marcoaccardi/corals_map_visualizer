import React, { forwardRef, useMemo, useState, useEffect, useCallback, } from "react";

import { Viewer, Entity, ImageryLayer, CameraFlyTo } from "resium";
import { SingleTileImageryProvider, Rectangle, Cartesian3 } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

export const Map = forwardRef((props, ref) => {
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

  const [imageryProvider, setImageryProvider] = useState(() => {
    return new SingleTileImageryProvider({
      url: blobUrl || undefined,
      rectangle: rectangle,
      credit: "NOAA",
    });
  });

  const dummyCredit = useMemo(() => document.createElement("div"), []);

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
    >
      <Entity name="My image layer" description="This is my texture layer">
        <ImageryLayer
          alpha={0.5}
          imageryProvider={imageryProvider}
          key={imageryProvider.url}
        />
        <CameraFlyTo duration={5} destination={flyToLocation} />
      </Entity>
    </Viewer>
  )
})