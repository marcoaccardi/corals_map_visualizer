import React, { useState, useEffect } from "react";
import {
  when,
  Cartesian3,
  Math as CesiumMath,
  Color,
  CylinderEmitterShape,
  HeadingPitchRoll,
} from "cesium";
import { ParticleSystem, ResiumProvider, Viewer } from "resium";

const WindDataComponent = () => {
  const [windData, setWindData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Use the same steps outlined in my previous answer to retrieve the wind data from NOAA
      // and parse it to extract the wind speed and direction for each data point
      // ...

      setWindData({
        speed: windSpeeds, // An array of wind speeds in meters per second
        direction: windDirections, // An array of wind directions in radians
        positions: positions, // An array of Cartesian3 positions for each data point
      });
    };
    fetchData();
  }, []);

  return (
    <ResiumProvider>
      <Viewer full>
        {windData && (
          <ParticleSystem
            loop
            emitterModelMatrix={HeadingPitchRoll.IDENTITY}
            emitterLifetime={Number.POSITIVE_INFINITY}
            startScale={1.0}
            endScale={0.0}
            startColor={Color.WHITE.withAlpha(0.8)}
            endColor={Color.WHITE.withAlpha(0.0)}
            particleLife={Number.POSITIVE_INFINITY}
            speed={50.0}
            emissionRate={2000.0}
            shape={new CylinderEmitterShape(0.1)}
            forces={[new Cartesian3(0.0, 0.0, -0.5)]}
            modelMatrix={CesiumMath.scale(
              CesiumMath.identity(),
              new Cartesian3(1000.0, 1000.0, 1000.0)
            )}
          >
            {when(
              () => true,
              () => {
                const particles = [];
                for (let i = 0; i < windData.speed.length; i++) {
                  const direction = windData.direction[i];
                  const speed = windData.speed[i];
                  const position = windData.positions[i];
                  const velocity = new Cartesian3(
                    Math.cos(direction) * speed,
                    Math.sin(direction) * speed,
                    0.0
                  );
                  particles.push({
                    position,
                    velocity,
                  });
                }
                return particles;
              }
            )}
          </ParticleSystem>
        )}
      </Viewer>
    </ResiumProvider>
  );
};

export default WindDataComponent;
