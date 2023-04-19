export const fileOptions = {
  dataFile: "demo.nc",
  dataDirectory: "/data/",
  glslDirectory: '/src/cesiumWind/script/glsl/'
}
// data directory
// online: https://raw.githubusercontent.com/RaymanNg/3D-Wind-Field/master/data/
// local: /data/

export const defaultParticleSystemOptions = {
  maxParticles: 64 * 64,
  particleHeight: 100.0,
  fadeOpacity: 0.996,
  dropRate: 0.003,
  dropRateBump: 0.01,
  speedFactor: 1.0,
  lineWidth: 4.0
}

export const globeLayers = [
  { name: "NaturalEarthII", type: "NaturalEarthII" },
  { name: "WMS:Air Pressure", type: "WMS", layer: "Pressure_surface", ColorScaleRange: '51640,103500' },
  { name: "WMS:Wind Speed", type: "WMS", layer: "Wind_speed_gust_surface", ColorScaleRange: '0.1095,35.31' },
  { name: "WorldTerrain", type: "WorldTerrain" }
]

export const defaultLayerOptions = {
  "globeLayer": globeLayers[0],
  "WMS_URL": "https://www.ncei.noaa.gov/thredds/wms/model-gfs-g4-anl-files-old/201809/20180916/gfsanl_4_20180916_0000_000.grb2",
}