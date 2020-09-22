import React, { useState, useEffect } from 'react';
import { Map, TileLayer } from "react-leaflet";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import './App.css';
import 'leaflet/dist/leaflet.css';

let timeout;

function App() {
  const callGeo = () => {
    fetch(`https://geo.api.gouv.fr/communes?nom=${textField}&limit=10&format=geojson`)
      .then(response => response.json())
      .then(json => setCities(json.features));
  }

  const debounce = (func, delay) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };

  //Hooks
  const [textField, setTextField] = useState("");
  useEffect(() => { 
    if(textField){
      debounce(callGeo, 300);
    }else{
      clearTimeout(timeout);
      setCities([]);
      /*setSelectedCity(null);*/
    }
  }, [textField]);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleTextChange = (e) => {
    e.persist();
    setTextField(e.target.value);
  }

  const handleCitySelection = (city) => {
    setSelectedCity(city);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        {/* Input Field */}
        <form noValidate autoComplete="off">
          <TextField fullWidth={true} id="standard-basic" label="Nom de la ville" onChange={handleTextChange} />
        </form>

        {/* City List */}
        {cities &&
          <List component="nav" >
            {cities.map(city => (
              <ListItem key={city.properties.code} button onClick={() => { handleCitySelection(city) }} selected={selectedCity && selectedCity.properties && selectedCity.properties.code === city.properties.code}>
                {city.properties.nom}
              </ListItem>
            ))}
          </List>
        }

        {/* Map */}
        <div className={"leaflet-container"}>
          {selectedCity &&
            <Map center={[selectedCity.geometry.coordinates[1], selectedCity.geometry.coordinates[0]]} zoom={12}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            </Map>
          }
        </div>
      </Container>
    </React.Fragment>
  );
}

export default App;
