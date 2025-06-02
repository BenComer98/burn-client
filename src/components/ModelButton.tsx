import React, { useEffect, useState } from 'react';
import './ModelButton.css';
import { ModelStage } from '../enums/modelStage';
import IFeatureType from '../types/featureType';

interface ModelButtonProps {
  startModel: () => void;
  resubmitModel: () => void;
  selectLocation: () => void;
  currentStage: ModelStage;
  errorFields: boolean;
}

export default function ModelButton(props: ModelButtonProps) {
  const [buttonText, setButtonText] = useState("Predict Prescribed Fire Spread");

  const handleClick = () => {
    if (props.currentStage === ModelStage.SelectingLocation) {
      props.selectLocation();
    }
    else if (props.currentStage === ModelStage.MissingFeatures || props.currentStage === ModelStage.ReadyForResubmit) {
      props.resubmitModel();
    }
    else {
      props.startModel();
    }
  };

  useEffect(() => {
    setButtonText(getButtonLabel());
  }, [props.currentStage]);

  const getButtonLabel: () => string = () => {
    switch (props.currentStage) {
      case (ModelStage.SelectingLocation):
        return "Submit Location";
      case (ModelStage.SelectingDate):
      case (ModelStage.Result):
        return "Restart Predictor";
      case (ModelStage.Loading):
        return "Loading...";
      case (ModelStage.ReadyForResubmit):
      case (ModelStage.MissingFeatures):
        return "Re-Submit Predictor";
      default:
        return "Predict Prescribed Fire Spread"
    }
  }

  return (
    <button className="model-button" onClick={handleClick}>
      {buttonText}
    </button>
  );
};
