import L from "leaflet";
import { FeatureGroup, Marker, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { MapContainer } from "react-leaflet/MapContainer";
import MapImage from "./MapImage";
type Props = {};

export default function Map({}: Props) {
  //   const imgRef = useRef() as React.MutableRefObject<any>;
  //   useEffect(() => {
  //     if (imgRef && imgRef.current) {
  //       imgRef.current.setBounds([
  //         [50, 50],
  //         [100, 100],
  //       ]);
  //     }
  //   }, [imgRef]);

  return (
    <div className="w-screen h-screen">
      <MapContainer
        className="w-full h-full bg-gray-900"
        center={[0, 0]}
        zoom={0}
        minZoom={-4}
        maxZoom={2}
        scrollWheelZoom={true}
        crs={L.CRS.Simple}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            // onEdited={onEdited}
            // onCreated={(e) => {
            //   //   setTemp(e);
            // }}
            // onDeleted={onDeleted}
            // // onMounted={onMounted}
            // onEditStart={onEditStart}
            // onEditStop={onEditStop}
            // onDeleteStart={onDeleteStart}
            // onDeleteStop={onDeleteStop}
            // onDrawStart={onDrawStart}
            // onDrawStop={onDrawStop}
            draw={{
              marker: false,
              circlemarker: false,
              circle: false,
              rectangle: false,
              polygon: false,
              //   polyline: {
              //     shapeOptions: {
              //       ...pathStyle,
              //       color: `#${pathStyle.color}`,
              //       dashArray: `${pathStyle.dashArray[0]},${pathStyle.dashArray[1]}`,
              //     },
              //   },
            }}
            // color="black"
          />
        </FeatureGroup>
        <MapImage />
        <Marker position={[0, 0]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
