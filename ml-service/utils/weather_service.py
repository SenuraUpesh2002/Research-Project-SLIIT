import requests
import os
import json
from datetime import datetime, timedelta
import random

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.cache_file = "weather_cache.json"
        self.location = "Negombo,LK"  # Default location
        self.cache = self._load_cache()

    def _load_cache(self):
        """Load weather cache from file"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}

    def _save_cache(self):
        """Save weather cache to file"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump(self.cache, f)
        except Exception as e:
            print(f"Error saving weather cache: {e}")

    def get_current_weather(self):
        """Get current weather data"""
        if not self.api_key:
            return self._get_mock_weather()

        try:
            # Check cache execution for current weather (valid for 30 mins)
            cache_key = f"current_{datetime.now().strftime('%Y-%m-%d_%H')}"
            if cache_key in self.cache:
                return self.cache[cache_key]

            url = f"{self.base_url}/weather?q={self.location}&appid={self.api_key}&units=metric"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                weather_data = self._parse_api_response(data)
                
                # Update cache
                self.cache[cache_key] = weather_data
                self._save_cache()
                
                return weather_data
            else:
                print(f"Weather API Error: {response.status_code}")
                return self._get_mock_weather()

        except Exception as e:
            print(f"Error fetching weather: {e}")
            return self._get_mock_weather()

    def get_forecast(self, date_str):
        """Get forecast for a specific date"""
        if not self.api_key:
            return self._get_mock_weather(date_str)

        try:
            # Check cache
            if date_str in self.cache:
                return self.cache[date_str]

            url = f"{self.base_url}/forecast?q={self.location}&appid={self.api_key}&units=metric"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                # Find forecast closest to noon on target date
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                
                best_forecast = None
                
                for item in data['list']:
                    item_date = datetime.fromtimestamp(item['dt']).date()
                    if item_date == target_date:
                        # Pick the one closest to 12:00 PM
                        best_forecast = item
                        if "12:00:00" in item['dt_txt']:
                            break
                
                if best_forecast:
                    weather_data = self._parse_api_response(best_forecast)
                    self.cache[date_str] = weather_data
                    self._save_cache()
                    return weather_data

            return self._get_mock_weather(date_str)

        except Exception as e:
            print(f"Error fetching forecast: {e}")
            return self._get_mock_weather(date_str)

    def _parse_api_response(self, data):
        """Parse OpenWeatherMap response"""
        main = data.get('main', {})
        weather = data.get('weather', [{}])[0]
        wind = data.get('wind', {})
        
        return {
            "temperature": main.get('temp', 28.0),
            "humidity": main.get('humidity', 75),
            "pressure": main.get('pressure', 1010),
            "condition": weather.get('main', 'Clear'),
            "description": weather.get('description', 'clear sky'),
            "wind_speed": wind.get('speed', 5.0),
            "rainfall_prob": data.get('pop', 0) * 100 if 'pop' in data else 0
        }

    def _get_mock_weather(self, date_str=None):
        """Generate realistic mock weather data for Sri Lanka"""
        # Base implementation for Negombo/Colombo weather patterns
        is_monsoon = False
        if date_str:
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                month = dt.month
                # SW Monsoon (May-Sep) or NE Monsoon (Dec-Feb) 
                is_monsoon = month in [5, 6, 7, 8, 9, 10, 11, 12]
            except:
                pass
        else:
            month = datetime.now().month
            is_monsoon = month in [5, 6, 7, 8, 9, 10, 11, 12]

        if is_monsoon:
            condition = random.choice(['Rain', 'Clouds', 'Thunderstorm', 'Drizzle'])
            temp = random.uniform(26.0, 30.0)
            humidity = random.randint(75, 95)
            rainfall_prob = random.randint(40, 90)
        else:
            condition = random.choice(['Clear', 'Clouds', 'Partly Cloudy'])
            temp = random.uniform(28.0, 33.0)
            humidity = random.randint(60, 80)
            rainfall_prob = random.randint(0, 30)

        return {
            "temperature": round(temp, 1),
            "humidity": humidity,
            "pressure": 1012,
            "condition": condition,
            "description": f"mock {condition.lower()}",
            "wind_speed": round(random.uniform(3.0, 15.0), 1),
            "rainfall_prob": rainfall_prob,
            "is_mock": True
        }
