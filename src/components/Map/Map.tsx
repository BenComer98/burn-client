import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import IFire from "../../types/fireType";
import MapLayerPickerControl from "./MapLayerPickerControl";
import L from "leaflet";
import CustomSliderLayersControl from "./CustomSliderLayersControl";
import fireCursorIcon from './assets/firecursor.png'
import "./Map.css";
import { ModelStage } from "../../enums/modelStage";
import { FormatListNumbered } from "@mui/icons-material";

export interface MapProps {
    fireData: IFire[];
    setFireData: (fireData: IFire[]) => void;
    seed: number;
    counties: string[];
    countyRefresh: number;
    modelStage: ModelStage;
    handleSelectLocation: (latitude: number, longitude: number) => void;
    handleUpdateLocation: (latitude: number, longitude: number) => void;
}

// Improve performance of using Callback functions
const MemoizedMapLayerPickerControl = React.memo(MapLayerPickerControl);
const MemoizedCustomSliderLayersControl = React.memo(CustomSliderLayersControl);

const Map = (props: MapProps) => {
    const [value1, setValue1] = useState(1);
    const [value2, setValue2] = useState(1);
    const [value3, setValue3] = useState(1);
    const [value4, setValue4] = useState(1);
    const [value5, setValue5] = useState(1);

    const mapRef = useRef<L.Map | null>(null);

    const defaultPosition: LatLngExpression = [36.7783, -119.4179]; // California position
    const [currentPosition, setCurrentPosition] = useState<LatLng>(new LatLng(defaultPosition[0], defaultPosition[1]));
    const [mouseScreenPosition, setMouseScreenPosition] = useState<{x: number, y: number}>({x: -1, y: -1});
    const [mouseOnMap, setMouseOnMap] = useState(false);

    const isDraggingIconRef = useRef(false);

    // Don't need state here! We don't want to re-render
    let screenX = 0; let screenY = 0;

    // Upon the user finishing selection
    const showFireIcon = [
        ModelStage.SelectingDate,
        ModelStage.Loading,
        ModelStage.MissingFeatures,
        ModelStage.FeaturesError,
        ModelStage.ReadyForResubmit,
        ModelStage.Result,
    ].includes(props.modelStage);

    if (showFireIcon && mapRef.current) {
        const containerPoint = mapRef.current.latLngToContainerPoint(currentPosition);
        const mapRect = mapRef.current.getContainer().getBoundingClientRect();
        screenX = mapRect.left + containerPoint.x;
        screenY = mapRect.top + containerPoint.y;
    }

    const updateValue1 = useCallback((newValue: number) => {setValue1(newValue); },[] );
    const updateValue2 = useCallback((newValue: number) => {setValue2(newValue); },[] );
    const updateValue3 = useCallback((newValue: number) => {setValue3(newValue); },[] );
    const updateValue4 = useCallback((newValue: number) => {setValue4(newValue); },[] );
    const updateValue5 = useCallback((newValue: number) => {setValue5(newValue); },[] );
    
    const handleGetLocation = (latlng: L.LatLng) => {
        if (props.modelStage === ModelStage.SelectingLocation) {
            const lat = latlng.lat;
            const lon = latlng.lng;
            props.handleSelectLocation(lat, lon);
        }
    }

    const getLatLngPrecision = (zoom: number) => {
        if (zoom >= 15) return 6;
        if (zoom >= 12) return 5;
        if (zoom >= 10) return 4;
        if (zoom >= 8) return 3;
        if (zoom >= 6) return 2;
        return 1;
    };

    const handleDocumentMouseMove = (e: globalThis.MouseEvent) => {
        if (!isDraggingIconRef.current || !mapRef.current) return;
        const rect = mapRef.current.getContainer().getBoundingClientRect();
        const newLatLng = mapRef.current.containerPointToLatLng(
          L.point(e.clientX - rect.left, e.clientY - rect.top)
        );
        setCurrentPosition(newLatLng);
      };
      
      const handleDocumentMouseUp = (e: globalThis.MouseEvent) => {
        isDraggingIconRef.current = false;
        if (mapRef.current) {
            mapRef.current.dragging.enable();

            const rect = mapRef.current.getContainer().getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;

            const latlng = mapRef.current.containerPointToLatLng(L.point(relativeX, relativeY));
        
            props.handleUpdateLocation(latlng.lat, latlng.lng);
        }
      
        document.removeEventListener("mousemove", handleDocumentMouseMove);
        document.removeEventListener("mouseup", handleDocumentMouseUp);

      };
      

    const handleIconMouseDown = (e: React.MouseEvent) => {
        if (props.modelStage === ModelStage.MissingFeatures || props.modelStage === ModelStage.FeaturesError || props.modelStage === ModelStage.ReadyForResubmit || props.modelStage === ModelStage.Result) {
          isDraggingIconRef.current = true;
          if (mapRef.current) {
            mapRef.current.dragging.disable();
      
            const rect = mapRef.current.getContainer().getBoundingClientRect();
            const start = mapRef.current.containerPointToLatLng(
              L.point(e.clientX - rect.left, e.clientY - rect.top)
            );
            if (start) setCurrentPosition(start);
          }
    
          document.addEventListener("mousemove", handleDocumentMouseMove);
          document.addEventListener("mouseup", handleDocumentMouseUp);
        }
      };

    useEffect(() => {
        console.log("Hit!");
        if (!mapRef.current)
            return;

        const container = mapRef.current.getContainer();
        if (props.modelStage === ModelStage.SelectingLocation) {
            container.classList.add("selecting-cursor");
        } else {
            container.classList.remove("selecting-cursor");
        }

        const handleClick = (e: L.LeafletMouseEvent) => {
            handleGetLocation(e.latlng);
        }

        const handleHover = (e: L.LeafletMouseEvent) => {
            setMouseScreenPosition({x: e.originalEvent.clientX, y: e.originalEvent.clientY});
            if (props.modelStage === ModelStage.SelectingLocation) {
                setCurrentPosition(e.latlng);
            }
        }

        const handleMouseEnter = () => {
            setMouseOnMap(true);
        }

        const handleMouseLeave = () => {
            setMouseOnMap(false);
        }

        mapRef.current.on('click', handleClick);
        mapRef.current.on('mousemove', handleHover);
        mapRef.current.getContainer().addEventListener('mouseenter', handleMouseEnter);
        mapRef.current.getContainer().addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (mapRef.current) {
                mapRef.current.off('click', handleClick);
                mapRef.current.off('mousemove', handleHover);
                mapRef.current.getContainer().removeEventListener('mouseenter', handleMouseEnter);
                mapRef.current.getContainer().removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [mapRef, props.modelStage]);

    return (
        <div>           
            <MapContainer
                className="map__container"
                center={defaultPosition}
                zoom={6}
                ref={mapRef}
            >

                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapRef.current && <MemoizedMapLayerPickerControl seed={props.seed} fireData={props.fireData} map={mapRef.current} counties={props.counties}
                    valueSliderValue={[value1, value2, value3, value4, value5]} countyRefresh={props.countyRefresh} />}
                    
                {mapRef.current && <MemoizedCustomSliderLayersControl seed={props.seed} setValue = {[updateValue1, updateValue2, updateValue3, updateValue4, updateValue5]} map={mapRef.current} />}

                {(props.modelStage === ModelStage.SelectingLocation || isDraggingIconRef.current) && mouseOnMap && (
                    <p 
                        className="latlng-cursor-box"
                        style={{
                            top: mouseScreenPosition.y + 10,
                            left: mouseScreenPosition.x + 10
                        }}
                    >
                        [{currentPosition.lat.toFixed(getLatLngPrecision(mapRef.current?.getZoom() ?? 6))}, {currentPosition.lng.toFixed(getLatLngPrecision(mapRef.current?.getZoom() ?? 6))}]
                    </p>
                )}

                {showFireIcon && (
                  <img
                    src={fireCursorIcon}
                    alt="Fixed Fire Icon"
                    className="fixed-fire-icon"
                    style={{
                      left: `${screenX}px`,
                      top: `${screenY}px`
                    }}
                    onMouseDown={handleIconMouseDown}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                )}
            </MapContainer>
        </div>
    );
};

export default Map;