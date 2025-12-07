const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const city = "College Station"; // Default city
        const units = 'metric'; // Use 'imperial' for Fahrenheit
        const apiKey = process.env.OPEN_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather`;
        
        const response = await axios.get(url, {
        params: {
            q: city,
            units,
            appid: apiKey
        },
        timeout: 5000
        });

        const weatherData = response.data;
        const formattedData = {
            temperature: weatherData.main.temp,
            feels_like: weatherData.main?.feels_like,
            description: weatherData.weather?.[0]?.description,
            icon: weatherData.weather?.[0]?.icon
        };
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
})

module.exports = router;