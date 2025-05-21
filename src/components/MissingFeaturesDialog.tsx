import { useState, ChangeEvent } from "react";
import { FeatureFormat, FeatureUnit } from "./FeaturesDisplay";
import IFeatureType from "../types/featureType";
import MissingFeature, { InputtedFeature } from "../types/missingFeature";

interface MissingFeaturesDialogProps {
    missingFeatures: MissingFeature[];
    handleSubmit: (features: InputtedFeature[]) => void;
    handleCancel: () => void;
}

const getUnitString = (unit: FeatureUnit): string => {
    switch (unit) {
        case FeatureUnit.Feet: return " ft";
        case FeatureUnit.Fahrenheit: return " F°";
        case FeatureUnit.Celcius: return " C°";
        case FeatureUnit.Inches: return " in";
        case FeatureUnit.Meters: return " m";
        case FeatureUnit.Mph: return "mph";
        case FeatureUnit.Percentage: return "%";
        default: return "";
    }
};

export default function MissingFeaturesDialog(props: MissingFeaturesDialogProps) {
    const [values, setValues] = useState<{ [index: number]: string }>(() => {
        const initial: { [index: number]: string } = {};
        props.missingFeatures.forEach((f) => {
            initial[f.index] = "";
        });
        return initial;
    });

    const handleChange = (index: number, value: string) => {
        setValues((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = () => {
        const features: InputtedFeature[] = [];

        for (const feature of props.missingFeatures) {
            const raw = values[feature.index];
            const num = Number(raw);

            if (raw.trim() === "" || isNaN(num)) {
                alert(`Invalid input for "${feature.name}". Please enter a valid number.`);
                return;
            }

            features.push({ ...feature, value: num });
        }

        props.handleSubmit(features);
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2>Enter Missing Features</h2>
                <div style={{ marginBottom: '1rem'}}>Some features for the selected date and location couldn't be found. Please enter these features' values.</div>

                {props.missingFeatures.map(({ index, name, tooltip, unit }) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                        <label title={tooltip}>
                            <strong>{name}</strong>: 
                        </label>
                        <input
                            type="text"
                            placeholder="Enter value"
                            value={values[index]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                            style={styles.input}
                        />
                        <span>{getUnitString(unit)}</span>
                    </div>
                ))}

                <div>
                    <button onClick={handleSubmit} style={styles.button}>Submit</button>
                    <button onClick={props.handleCancel} style={styles.cancelButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: '5px',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '25%',
        maxHeight: '60%',
        overflowY: 'auto',
        scrollbarGutter: 'stable both-edges',
        width: '100%',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    input: {
        padding: '5px',
        marginLeft: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100px',
    },
    button: {
        marginTop: '5px',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        marginRight: '10px',
        marginBottom: '10px',
    },
    cancelButton: {
        marginTop: '5px',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#D0D0D0',
        color: 'black',
        cursor: 'pointer',
    },
};
