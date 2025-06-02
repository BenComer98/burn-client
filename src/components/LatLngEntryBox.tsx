import { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import "./LatLngEntryBox.css";

export interface LatLngEntryBoxProps {
    latlng: null | undefined | LatLng;
    setLatLng: (latitude: number, longitude: number) => void;
    date: null | undefined | Date;
    setDate: (date: Date) => void;
}

export default function LatLngEntryBox(props: LatLngEntryBoxProps) {
    const [latInput, setLatInput] = useState("");
    const [lngInput, setLngInput] = useState("");

    useEffect(() => {
        if (props.latlng) {
            setLatInput(props.latlng.lat.toString());
            setLngInput(props.latlng.lng.toString());
        }
    }, [props.latlng]);

    const handleChangeLat = (newLat: string) => {
        setLatInput(newLat);
        const lat = parseFloat(newLat);
        const lng = parseFloat(lngInput);
        if (!isNaN(lat) && !isNaN(lng)) {
            props.setLatLng(lat, lng);
        }
    }

    const handleChangeLng = (newLng: string) => {
        setLngInput(newLng);
        const lat = parseFloat(latInput);
        const lng = parseFloat(newLng);
        if (!isNaN(lat) && !isNaN(lng)) {
            props.setLatLng(lat, lng);
        }
    }

    return (
        <div className="latlng-box">
            <div className="latlng-line">
                <label className="latlng-label">Latitude:</label>
                <input className="latlng-input" type="text" value={latInput} onChange={(e) => handleChangeLat(e.target.value)}/>
            </div>
            <div className="latlng-line">
                <label className="latlng-label">Longitude:</label>
                <input className="latlng-input" type="text" value={lngInput} onChange={(e) => handleChangeLng(e.target.value)}/>
            </div>
            {props.date && <div className="date-line">
                <label className="date-label">Select Date: </label>
                <input
                    type="date"
                    value={props.date.toISOString().split("T")[0]}
                    onChange={(e) => props.setDate(new Date(e.target.value))}
                />
            </div>}
        </div>
    )
}