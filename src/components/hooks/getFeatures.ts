import IFeatureType from "../../types/featureType";
import { FeatureFormat, FeatureUnit } from "../FeaturesDisplay";

export function getFeatureSpecs(): [keyof IFeatureType, string, string, FeatureFormat, FeatureUnit][] {
    return [
        ["elevationAvg", "Elevation Average", "The average elevation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["elevationMin", "Elevation Min", "The minimum elevation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["elevationMax", "Elevation Max", "The maximum elevation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["elevationStd", "Elevation Std Dev", "The standard deviation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["climateAvg", "Average Temperature", "The average temperature in Fahrenheit for this latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Celcius],
        ["climateMin", "Low Temperature", "The lowest temperature for the day on this latitude and longitude, in Fahrenheit.", FeatureFormat.Decimal, FeatureUnit.Celcius],
        ["climateMax", "High Temperature", "The highest temperature for the day on this latitude and longitude, in Fahrenheit.", FeatureFormat.Decimal, FeatureUnit.Celcius],
        ["climateHumidity", "Average Humidity", "The average humidity for the day on this latitude and longitude.", FeatureFormat.Percentage, FeatureUnit.Percentage],
        ["climatePrecip", "Average Precipitation", "The average precipitation for this day on this latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Inches],
        ["climateWindSpd", "Average Wind Speed", "The average wind speed for this day on this latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Mph],
        ["vegetationCover", "Vegetation Cover", "The percent coverage of vegetation on the latitude and longitude.", FeatureFormat.Percentage, FeatureUnit.Percentage],
        ["vegetationHeight", "Vegetation Height", "The average vegetation height on the latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Meters],
        ["vegetationDeparture", "Vegetation Departure", "The average departure of vegetation from the area.", FeatureFormat.Percentage, FeatureUnit.Percentage]
    ]
}

export function getFeatures(features: IFeatureType): [keyof IFeatureType, string, number | undefined, string, FeatureFormat, FeatureUnit][] {
    return [
        ["elevationAvg", "Elevation Average", features.elevationAvg, "The average elevation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["elevationMin", "Elevation Min", features.elevationMin, "The minimum elevation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["elevationMax", "Elevation Max", features.elevationMax, "The maximum elevation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["elevationStd", "Elevation Std Dev", features.elevationStd, "The standard deviation for this latitude and longitude.", FeatureFormat.Integer, FeatureUnit.Feet],
        ["climateAvg", "Average Temperature", features.climateAvg, "The average temperature in Fahrenheit for this latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Celcius],
        ["climateMin", "Low Temperature", features.climateMin, "The lowest temperature for the day on this latitude and longitude, in Fahrenheit.", FeatureFormat.Decimal, FeatureUnit.Celcius],
        ["climateMax", "High Temperature", features.climateMax, "The highest temperature for the day on this latitude and longitude, in Fahrenheit.", FeatureFormat.Decimal, FeatureUnit.Celcius],
        ["climateHumidity", "Average Humidity", features.climateHumidity, "The average humidity for the day on this latitude and longitude.", FeatureFormat.Percentage, FeatureUnit.Percentage],
        ["climatePrecip", "Average Precipitation", features.climatePrecip, "The average precipitation for this day on this latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Inches],
        ["climateWindSpd", "Average Wind Speed", features.climateWindSpd, "The average wind speed for this day on this latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Mph],
        ["vegetationCover", "Vegetation Cover", features.vegetationCover, "The percent coverage of vegetation on the latitude and longitude.", FeatureFormat.Percentage, FeatureUnit.Percentage],
        ["vegetationHeight", "Vegetation Height", features.vegetationHeight, "The average vegetation height on the latitude and longitude.", FeatureFormat.Decimal, FeatureUnit.Meters],
        ["vegetationDeparture", "Vegetation Departure", features.vegetationDeparture, "The average departure of vegetation from the area.", FeatureFormat.Percentage, FeatureUnit.Percentage]
    ]
}