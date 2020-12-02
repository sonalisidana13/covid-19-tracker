import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const caseTypeColors = {
  cases: {
    hex: "#CC1034",
    // rgb: "rgb(204, 16, 52)",
    // half_op: "rgba(204, 16, 52, 0.5)", // opacity of border
    multiplier: 800, //size of circle
  },
  recovered: {
    hex: "#7dd71d",
    // rgb: "rgb(125, 215, 29)",
    // half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    // rgb: "rgb(251, 68, 67)",
    // half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

//sort list results by highest no of cases
export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const formatStats = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
};

//draw circles on map
export const showDataOnMap = (data, caseType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={caseTypeColors[caseType].hex}
      fillColor={caseTypeColors[caseType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[caseType]) * caseTypeColors[caseType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
