import React, {useEffect, useState} from "react";
import "./App.css";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Map from "./components/Map/Map";
import About from "./components/static/About";
import Contact from "./components/static/Contact";
import Filters from "./components/Drawer/Filters";
import StatisticsPane from "./components/StatsPane/StatisticsPane"
import IFire from "./types/fireType";
import {getAllPrescribedFires} from "./service/burnService";
import { ModelStage } from "./enums/modelStage";
import DateEntry from "./components/DateEntry";
import ModelButton from "./components/ModelButton";
import PredictionBox from "./components/PredictionBox";
import { getModelPrediction, IPrediction } from "./service/mlService";
import SelectLocationPromptBox from "./components/SelectLocationPromptBox";
import FeaturesDisplay from "./components/FeaturesDisplay";
import IFeatureType from "./types/featureType";
import ExitModelButton from "./components/ExitModelButton";
import { hasAllFeatures, getMissingFeatures } from "./components/hooks/hasAllFeatures";
import MissingFeaturesDialog from "./components/MissingFeaturesDialog";
import MissingFeature, { InputtedFeature } from "./types/missingFeature";
import { LatLng } from "leaflet";
import LatLngEntryBox from "./components/LatLngEntryBox";

const testingFeatureInput: boolean = false;

function App() {
    const [fireData, setFireData] = useState<IFire[]>([]);
    const [statistics, setStatistics] = useState("");
    const [seed, setSeed] = useState(1);
    const updateBurnWindow = () => setSeed(seed + 1);
    const resetBurnWindow = () => setSeed(1);
    const [counties, setCounties] = useState<string[]>([]);
    const [countyRefresh, setCountyRefresh] = useState(1);
    const [modelStage, setModelStage] = useState(ModelStage.Standby);
    const [modelLatLng, setModelLatLng] = useState<LatLng | null>(null);
    const [modelDate, setModelDate] = useState<Date | null>(null);
    const [predictionAcreage, setPredictionAcreage] = useState<number | null>(null);
    const [predictionConfidence, setPredictionConfidence] = useState<number | null>(null);
    const [predictionFeatures, setPredictionFeatures] = useState<IFeatureType | undefined>(undefined);
    const [showErrorFields, setShowErrorFields] = useState<boolean>(false);
    const [userOverrides, setUserOverrides] = useState<(string | null)[]>(new Array<string | null>(13).fill(null));
    const [missingFeatures, setMissingFeatures] = useState<MissingFeature[]>([]);

    // Loads all non-escaped fire 12K+ records will be slow on first load/page refresh/Home button click
    useEffect(() => {
        getAllPrescribedFires()
            .then(data => setFireData(data))
            .catch(err => console.error(err));
    }, []);

    const handleStartModel = () => {
        setModelStage(ModelStage.SelectingLocation);
        resetOverrides();
    }

    const handleExitModel = () => {
        setModelStage(ModelStage.Standby);
        setModelLatLng(null);
        setModelDate(null);
        resetOverrides();
    }

    const handleResubmitModel = () => {
        if (!hasAllFeatures(predictionFeatures)) {
            setShowErrorFields(true);
        }
        else {
            handleSubmitModel();
        }
    }

    const handleSubmitMissingFeatures = (features: InputtedFeature[]) => {
        const newOverrides = [...userOverrides];
        features.forEach((feature: InputtedFeature) => {
            newOverrides[feature.index] = feature.value.toString();
        });

        console.log(newOverrides);
        setUserOverrides(newOverrides);
        setModelStage(ModelStage.Loading);
        handleSubmitModel(undefined, newOverrides);
    };

    const handleSelectLocation = (latitude?: number, longitude?: number) => {
        if (modelLatLng === null || isNaN(modelLatLng.lat) || isNaN(modelLatLng.lng)) {
            return; // Require lat and lng to be set
        }

        if (latitude !== undefined && longitude !== undefined) {
            setModelLatLng(new LatLng(latitude, longitude));
        }
        setModelStage(ModelStage.SelectingDate);
    }

    const handleReselectLocation = (latitude: number, longitude: number) => {
        setModelLatLng(new LatLng(latitude, longitude));
        if (modelStage !== ModelStage.FeaturesError) {
            setModelStage(ModelStage.ReadyForResubmit);
        }
    }
 
    const handleSelectDate = async (date: Date) => {
        setModelDate(date);
        setModelStage(ModelStage.Loading);
        handleSubmitModel(date);
    }

    const getOverrideValues = (overrides: (string | null)[]): (number | null)[] => {
        return overrides.map((value) => {
            const parsed = value !== null ? parseFloat(value) : NaN;
            return !isNaN(parsed) ? parsed : null;
        });
    }

    const handleSubmitModel = async (date?: Date, overrides?: (string | null)[]) => {
        console.log(overrides);
        await getModelPrediction(modelLatLng!, modelDate || date!, getOverrideValues(overrides || userOverrides), testingFeatureInput).then((prediction: IPrediction) => {
            console.log(prediction);
            if (prediction.success && hasAllFeatures(prediction.features)) {
                console.log("Success!");
                setPredictionFeatures(prediction.features);
                setPredictionAcreage(prediction.acreage);
                setPredictionConfidence(prediction.confidence);
                setModelStage(ModelStage.Result);
            }
            else {
                console.log("Missing features");
                console.log(getMissingFeatures(prediction.features));
                setMissingFeatures(getMissingFeatures(prediction.features));
                setModelStage(ModelStage.MissingFeatures);
            }
        });
    }

    const handleSetFeatures = (features: IFeatureType): void => {
        setPredictionFeatures(features);
    }

    const handleSetOverrides = (featureOverrides: (string | null)[]): void => {
        setUserOverrides(featureOverrides);
        setModelStage(ModelStage.ReadyForResubmit);
    }

    const handleChangeDate = (date: Date): void => {
        setModelDate(date);
    }

    const handleChangeLatLng = (latitude: number, longitude: number): void => {
        setModelLatLng(new LatLng(latitude, longitude));
    }

    const resetOverrides = () => {
        setUserOverrides(new Array<string | null>(13).fill(null));
    }

    return (
        <Router>
            <Navbar/>
            <Switch>
                <Route path="/" exact>
                    <span className="model-container">
                        {modelStage === ModelStage.SelectingLocation && <SelectLocationPromptBox />}
                        {modelStage === ModelStage.Result && <PredictionBox confidence={predictionConfidence!} predicted_reach={predictionAcreage!} />}
                        {(modelStage === ModelStage.SelectingLocation || modelStage === ModelStage.Result || modelStage === ModelStage.ReadyForResubmit || modelStage === ModelStage.FeaturesError) && <LatLngEntryBox latlng={modelLatLng} setLatLng={handleChangeLatLng} date={modelDate} setDate={handleChangeDate}/>}
                        {(modelStage === ModelStage.FeaturesError || modelStage === ModelStage.ReadyForResubmit || modelStage === ModelStage.Result) && <FeaturesDisplay features={predictionFeatures} featureOverrides={userOverrides} setFeatures={handleSetFeatures} setFeatureOverrides={handleSetOverrides} showErrors={showErrorFields}/>}
                        <div className="model-buttons">
                            {modelStage !== ModelStage.SelectingDate && <ModelButton startModel={handleStartModel} resubmitModel={handleResubmitModel} selectLocation={handleSelectLocation} errorFields={showErrorFields} currentStage={modelStage} />}
                            {modelStage !== ModelStage.Standby && <ExitModelButton onExit={handleExitModel}/>}
                        </div>
                    </span>
                    <StatisticsPane statistics={statistics} counties={counties}/>
                    <Map fireData={fireData} setFireData={setFireData} seed={seed} counties={counties} countyRefresh={countyRefresh} modelStage={modelStage} modelLatLng={modelLatLng} handleSelectLocation={handleSelectLocation} handleUpdateLocation={handleReselectLocation}/>
                    <Filters setFireData={setFireData} setStatistics={setStatistics} setCountyRefresh={setCountyRefresh}
                      updateBurnWindow={updateBurnWindow} resetBurnWindow={resetBurnWindow} setCounties={setCounties}/>
                    {modelStage === ModelStage.SelectingDate && <DateEntry handleCancel={handleExitModel} selectDate={handleSelectDate} /> /* Keeping this one separate for its screen-spanning */}
                    {modelStage === ModelStage.MissingFeatures && <MissingFeaturesDialog missingFeatures={missingFeatures} handleSubmit={handleSubmitMissingFeatures} handleCancel={handleExitModel}/>}
                </Route>
                <Route path="/about">
                    <About/>
                </Route>
                <Route path="/contact">
                    <Contact/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
