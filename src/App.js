import "./App.css";
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, formatStats } from "./utilities";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.90746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // setInputCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([34.90746, -40.4796]);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app-left-container">
        <div className="app-header">
          <h1> COVID-19-TRACKER</h1>
          <FormControl className="app-dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app-data">
          <InfoBox
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Coronavirus Cases"
            isRed
            total={formatStats(countryInfo.cases)}
            cases={formatStats(countryInfo.todayCases)}
          ></InfoBox>

          <InfoBox
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered"
            total={formatStats(countryInfo.recovered)}
            cases={formatStats(countryInfo.todayRecovered)}
          ></InfoBox>

          <InfoBox
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deceased"
            isRed
            total={formatStats(countryInfo.deaths)}
            cases={formatStats(countryInfo.todayDeaths)}
          ></InfoBox>
        </div>

        <div>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            caseType={caseType}
          ></Map>
        </div>
      </div>

      <Card className="app-right-container">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}></Table>
          <h3 className="cases-padding">Worldwide new {caseType}</h3>
          <LineGraph caseType={caseType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
