import { ChangeEvent } from "react";
import IFeatureType from "../types/featureType"
import "./FeaturesDisplay.css"
import { getFeatures } from "./hooks/getFeatures";

export interface FeaturesDisplayProps {
    features?: IFeatureType;
    featureOverrides: (string | null)[];
    date: Date;
    setFeatures: (features: IFeatureType) => void;
    setFeatureOverrides: (featureOverrides: (string | null)[]) => void;
    setDate: (date: Date) => void;
    showErrors: boolean;
};

export enum FeatureFormat {
    Integer,
    Decimal,
    Percentage
}

export enum FeatureUnit {
    Feet,
    Fahrenheit,
    Celcius,
    None,
    Inches,
    Mph,
    Meters,
    Percentage
}

const getFormatString = (value: number, format: FeatureFormat): string => {
    switch (format) {
        case (FeatureFormat.Integer):
            return value.toFixed(0);
        case (FeatureFormat.Decimal):
            return value.toFixed(2);
        case (FeatureFormat.Percentage):
            return value.toFixed(1);
    }
}

const getUnitString = (unit: FeatureUnit): string => {
    switch (unit) {
        case (FeatureUnit.Feet):
            return " ft";
        case (FeatureUnit.Fahrenheit):
            return " F°";
        case (FeatureUnit.Celcius):
            return " C°";
        case (FeatureUnit.Inches):
            return " in";
        case (FeatureUnit.Meters):
            return " m";
        case (FeatureUnit.Mph):
            return "mph";
        case (FeatureUnit.Percentage):
            return "%";
        default:
            return "";
    }
}

export default function FeaturesDisplay(props: FeaturesDisplayProps) {
    const getCurrentFeatures = (features: IFeatureType | undefined): null | [string, string, number | undefined, string, FeatureFormat, FeatureUnit][] => {
        if (!features) {
            console.log("Features are null");
            return null;
        }

        console.log("Features aren't null")
        return getFeatures(features);
    }

    if (!props.features)
        return null;

    const handleChange = (index: number, value: string | undefined) => {
        if (value === undefined)
            return;

        const newFeatureOverrides = [...props.featureOverrides];
        newFeatureOverrides[index] = value;
        props.setFeatureOverrides(newFeatureOverrides);
    }

    const handleCheck = (value: number, index: number, format: FeatureFormat) => {
        console.log("Checked!");
        const newFeatureOverrides = [...props.featureOverrides];
        newFeatureOverrides[index] = props.featureOverrides[index] !== null ? null : getFormatString(value, format);
        props.setFeatureOverrides(newFeatureOverrides);
    }

    return (
        <div className="features_box">
            <div className="date-line">
                <label className="date-label">Select Date: </label>
                <input
                    type="date"
                    value={props.date.toISOString().split("T")[0]}
                    onChange={(e) => props.setDate(new Date(e.target.value))}
                />
            </div>
            {getCurrentFeatures(props.features!)?.map(([attribute, label, value, tooltip, format, unit], index) => {
                return <p className="feature_text">
                    <input type="checkbox" checked={props.featureOverrides[index] !== null} onChange={() => handleCheck(value!, index, format)} />
                    {props.featureOverrides[index] !== null ? 
                        <>
                            <strong>{label}</strong>: <input 
                                className={value === undefined ? "input-error" : "feature-input"}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)} 
                                value={props.featureOverrides[index] || ""}
                                placeholder="Enter feature" 
                            />{getUnitString(unit)}
                        </> :
                        <>
                            <strong>{label}</strong>: <span 
                                className={value === undefined ? "input-error" : "feature-input"}
                                onClick={() => handleCheck(value!, index, format)}
                            >{getFormatString(value!, format)}</span>{getUnitString(unit)}
                        </>
                    }
                </p>
            })}
        </div>
    )
}