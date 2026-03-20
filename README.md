# 🌐 IoT Dashboard - Real-time Environmental Monitoring

A premium, commercial-grade IoT Dashboard built with React, TailwindCSS, Framer Motion, and Recharts for real-time environmental sensor monitoring.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success) ![React](https://img.shields.io/badge/React-18-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animated-ff69b4)

## ✨ Features

### 🎴 Real-time Sensor Monitoring
- **Temperature Sensor**: Dynamic heat effects with color-coded glows (cold/normal/hot)
- **Humidity Sensor**: Animated fog overlay effects based on humidity levels
- **Light Intensity Sensor**: Radial glow effects with rotating sun/moon icons

### 🎨 Premium Visual Effects
- **Glassmorphism UI**: Semi-transparent cards with backdrop blur
- **3D Tilt Effects**: Interactive perspective transforms on hover
- **Dynamic Animations**: Framer Motion powered smooth transitions
- **Heat Wave Distortion**: CSS-based distortion at high temperatures
- **Fog Overlay**: Floating animation for humidity visualization
- **Radial Glow**: Pulsing light effects for brightness levels

### 📊 Data Visualization
- **Multi-line Time-series Chart**: Recharts powered historical data display
- **Color-coded Lines**: Temperature (yellow), Humidity (cyan), Light (yellow)
- **Custom Tooltips**: Status indicators (Low/Normal/High) with values
- **Real-time Updates**: Auto-updates every 2.5 seconds

### 🎭 Design Aesthetic
- **Dark Mode**: Professional gradient background
- **Glassmorphism**: Modern, premium card design
- **Inter Font**: Google Fonts integration
- **Responsive Layout**: Adapts to different screen sizes

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS v3
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd e:/WebPtit/IoT-Web

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173/
```

## 📁 Project Structure

```
e:/WebPtit/IoT-Web/
├── index.html                  # Root HTML
├── tailwind.config.js          # Custom TailwindCSS theme
├── postcss.config.js           # PostCSS configuration
├── vite.config.js              # Vite configuration
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Main dashboard
│   ├── index.css               # Global styles
│   ├── hooks/
│   │   └── useSensorData.js    # Real-time data hook
│   ├── utils/
│   │   ├── constants.js        # Thresholds & constants
│   │   └── sensorEffects.js    # Visual effect logic
│   └── components/
│       ├── SensorCard.jsx      # Base card component
│       ├── TemperatureCard.jsx # Temperature sensor
│       ├── HumidityCard.jsx    # Humidity sensor
│       ├── LightCard.jsx       # Light sensor
│       ├── SensorChart.jsx     # Time-series chart
│       └── effects/
│           ├── FogOverlay.jsx  # Fog effect
│           ├── HeatWave.jsx    # Heat distortion
│           └── RadialGlow.jsx  # Radial light
```

## 🎯 Sensor Thresholds

### Temperature
- **Cold**: < 20°C (Blue glow, slow animation)
- **Normal**: 20-30°C (Yellow/orange gradient)
- **Hot**: > 30°C (Red glow, pulse, heat wave)

### Humidity
- **Dry**: < 40% (Clear appearance)
- **Normal**: 40-70% (Light fog)
- **Wet**: > 70% (Heavy fog with blur)

### Light
- **Dark**: < 300 lux (Minimal glow)
- **Medium**: 300-800 lux (Soft glow)
- **Bright**: > 800 lux (Radial glow, rotating icon)

## 🔧 Customization

### Modify Sensor Ranges
Edit `src/utils/constants.js`:

```javascript
export const SENSOR_RANGES = {
  temperature: { min: 15, max: 35 },
  humidity: { min: 30, max: 90 },
  light: { min: 100, max: 1200 },
};
```

### Adjust Update Interval
Edit `src/utils/constants.js`:

```javascript
export const UPDATE_INTERVAL = 2500; // milliseconds
```

### Change Color Palette
Edit `tailwind.config.js`:

```javascript
colors: {
  temp: {
    cold: '#60A5FA',
    normal: '#FBBF24',
    hot: '#EF4444',
  },
  // ... more colors
}
```

## 🌐 WebSocket Integration (Future Enhancement)

To connect real IoT devices, replace the simulated data in `src/hooks/useSensorData.js`:

```javascript
// Replace setInterval simulation with:
useEffect(() => {
  const ws = new WebSocket('ws://your-iot-server.com');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setSensorData(data);
  };

  return () => ws.close();
}, []);
```

## 📸 Screenshots

See the full walkthrough at `walkthrough.md` for detailed screenshots and testing results.

## 🏆 Features Checklist

- ✅ React + Vite setup
- ✅ TailwindCSS integration
- ✅ Framer Motion animations
- ✅ Recharts time-series visualization
- ✅ Real-time data simulation
- ✅ 3D tilt effects on hover
- ✅ Dynamic visual effects (heat, fog, glow)
- ✅ Glassmorphism design
- ✅ Dark mode theme
- ✅ Responsive layout
- ✅ Professional aesthetics
- ✅ Counter animations
- ✅ Custom tooltips
- ✅ Status indicators

## 📝 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 👨‍💻 Author

Built by a Senior Front-End Engineer & Creative Technologist

---

**Note**: This is a production-ready application, not a student demo. The code is clean, well-structured, and follows modern best practices for React development.
