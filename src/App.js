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
import Table from'./Table';
import { sortData } from "./utilities";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);

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

    await fetch(url).then((response) =>
      response.json().then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      })
    );
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
            title="Coronavirus Cases"
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          ></InfoBox>

          <InfoBox
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          ></InfoBox>

          <InfoBox
            title="Deceased"
            total={countryInfo.deaths}
            cases={countryInfo.todayDeaths}
          ></InfoBox>
        </div>

        <div>
          <Map></Map>
        </div>
      </div>

      <Card className="app-right-container">
        <CardContent>
          <h3>Live Cases By Country</h3>
					<Table countries={tableData}></Table>
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
