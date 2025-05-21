import { FeatureFormat, FeatureUnit } from "../components/FeaturesDisplay";
import IFeatureType from "./featureType";

export default interface MissingFeature {
    index: number;
    attribute: keyof IFeatureType;
    name: string;
    tooltip: string;
    format: FeatureFormat;
    unit: FeatureUnit;
}

export interface InputtedFeature extends MissingFeature {
    value: number;
}