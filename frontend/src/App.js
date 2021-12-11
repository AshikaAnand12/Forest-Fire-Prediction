import './App.css';
import countryData from "./data_json.json"
import BasicDatePicker from "./Component/BasicDatePicker"
import MarkerMap from "./Component/MarkerMap"
import { Box, Autocomplete, TextField, Button } from "@mui/material"
import { useState } from 'react'
import axios from "axios"

function App() {
  const [countryCode, setCountryCode] = useState("")
  const [countryName, setCountryName] = useState("")
  const [address, setAddress] = useState("")
  const [weatherData, setWeatherData] = useState({})
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" })
  const [date,setDate]  = useState(new Date())
  const [confidence,setConfidence] = useState(0.0)
  const handleAddressSearch = () => {

    console.log(address,countryCode)
    const code = countryCode.Code;
    const geocodingUrl = isNaN(address) 
    ? process.env.REACT_APP_GEOCODING_ADDRESS_API + `${address},${code}&limit=1&appid=${process.env.REACT_APP_OPEN_WEATHER_TOKEN}`
    : process.env.REACT_APP_GEOCODING_ZIP_API +`${address},${code}&appid=${process.env.REACT_APP_OPEN_WEATHER_TOKEN}`
    axios.get(geocodingUrl)
    .then(response => {
      const latitude = isNaN(address) ? response.data[0].lat : response.data.lat
      const longitude = isNaN(address) ? response.data[0].lon : response.data.lon
      setCoordinates({latitude:latitude, longitude:longitude })
      const weatherUrl = process.env.REACT_APP_ONE_CALL_API + `lat=${latitude}&lon=${longitude}&exclude=current,minutely,alerts&appid=${process.env.REACT_APP_OPEN_WEATHER_TOKEN}`
      axios.get(weatherUrl)
      .then(response=>{
        setWeatherData(response.data)
      })
      axios.get(process.env.REACT_APP_PREDICTION_API + `lat=${latitude}&lon=${longitude}&month=${date.getMonth()+1}`)
      .then(response=>{
        setConfidence(response.data.output[0])
      })
      .catch(error=>alert(error))
    })
    .catch(error=>alert(error))
  }
  return (
    <>
      <header style={{backgroundColor:"sky blue"}}>
        <Box sx={{ display: 'flex', justifyContent: "space-around"}} >
          <h3>Predicting Forest Fires</h3>
          <Box sx={{ display: "flex"}}>
            <TextField value={address} onChange={event => setAddress(event.target.value)} />
            <Autocomplete
              id="combo-box-demo"
              value={countryCode}
              inputValue={countryName}
              onInputChange={(event, newInput) => setCountryName(newInput)}
              onChange={(event, newValue) => setCountryCode(newValue)}
              options={countryData}
              getOptionLabel={item => item.Name || ""}
              sx={{ width: 180 }}
              renderInput={(params) => <TextField {...params} label="Country" />} />
              <BasicDatePicker date={date} setDate={setDate} />
            <Button variant='contained' onClick={handleAddressSearch}>Search</Button>
          </Box>
        </Box>
      </header>
      <main>
      <MarkerMap confidence={confidence} address={address} coordinates={coordinates}/>
      </main>
    </>
  )
}

export default App;