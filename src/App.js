//https://disease.sh/v3/covid-19/countries
import Infobox from "./Infobox";
import "./index.css";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Map from "./Map";
import Table from "./Table"
import { sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country1, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //to run a piece of code
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //INDIA
            value: country.countryInfo.iso2, //USA, UK, IN
          }));

          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        //all of the data....
        //from country response
        setCountryInfo(data);
      });
    //https://disease.hs/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* Title And Dropdown */}
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country1}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country, key) => (
                <MenuItem  value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Stats */}
        <div className="app__stats">
          <Infobox
            title="CoronaVirus Cases"
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          />
          <Infobox
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          />
          <Infobox
            title="Deaths"
            total={countryInfo.deaths}
            cases={countryInfo.todayDeaths}
          />
        </div>

        {/* Map */}
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}/>
          
          <h3>Worldwide Cases</h3>
          {/* Graph */}
          <LineGraph/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
