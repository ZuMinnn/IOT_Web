# IoT Dashboard - Real-time Environmental Monitoring

A high-performance, commercial-grade IoT Dashboard built with React, TailwindCSS, Framer Motion, and Recharts for real-time environmental sensor monitoring.

![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success) ![React: 18](https://img.shields.io/badge/React-18-blue) ![TailwindCSS: 3](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![Framer Motion: Animated](https://img.shields.io/badge/Framer%20Motion-Animated-ff69b4)

## Architecture Overview

This project implements a scalable frontend architecture for processing and visualizing high-frequency IoT sensor data streams.

### Core Capabilities
- **Real-time Sensor Monitoring**: Processes and visualizes dynamic data streams for temperature, humidity, and light intensity.
- **Data Visualization**: Leverages Recharts for multi-line time-series charting with custom tooltips, threshold indicators, and optimized micro-re-renders.
- **Hardware-accelerated Visual Effects**: Utilizes CSS and Framer Motion for performant UI feedback (e.g., heat distortion, fog overlays, radial glows).
- **Responsive UI**: Implements a glassmorphism design system built on TailwindCSS, scalable to enterprise monitoring requirements.
- **Historical Activity Logging**: Provides paginated tracking logs and compound filtering (Time, Sensor IDs, Actions).

## Technology Stack

- **Core Infrastructure**: React 18, Vite
- **Styling Architecture**: TailwindCSS v3 (Utility-first, Custom Themes)
- **Animation Engine**: Framer Motion
- **Data Visualization**: Recharts
- **Iconography**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18.x or strictly higher recommended)
- npm or yarn package manager

### Initialization

```bash
# Navigate to the repository
cd e:/WebPtit/IoT-Web

# Install dependencies
npm install

# Initialize development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

## System Architecture mapped to Project Structure

```text
src/
├── components/          # Reusable view components
│   ├── effects/         # Componentized specialized rendering logic for sensor UI feedback
│   └── *.jsx            # Complex compositions (e.g., SensorHistory, DeviceHistory)
├── hooks/               # Custom React hooks managing states and API lifecycles
├── utils/               # Business logic, configuration constants, and format handling
├── App.jsx              # Application shell and route/composition root
└── index.css            # Global stylesheet and Tailwind layer directives
```

## Configuration & Tuning

### Sensor Threshold Profiles
The client application dynamically updates UI feedback based on configurable engineering thresholds found in `src/utils/constants.js`.

- **Temperature Module**: Cold (< 20°C), Normal (20-30°C), Hot (> 30°C)
- **Humidity Module**: Dry (< 40%), Normal (40-70%), Wet (> 70%)
- **Illuminance Module**: Dark (< 300 lux), Medium (300-800 lux), Bright (> 800 lux)

### Customization Vectors
Adjust application parameters like polling rates and operational ranges directly via constants:

```javascript
// src/utils/constants.js
export const SENSOR_RANGES = {
  temperature: { min: 15, max: 35 },
  humidity: { min: 30, max: 90 },
  light: { min: 100, max: 1200 },
};

export const UPDATE_INTERVAL = 2500; // ms between automated sync cycles
```

## Production Deployment & Integration

### External Data Integration (WebSocket/REST)
The application is pre-configured to handle external integrations cleanly. To transition from polled REST to instantaneous WebSocket execution:

```javascript
// Inside your data fetching strategy
useEffect(() => {
  const ws = new WebSocket(import.meta.env.VITE_IOT_BROKER_URL);
  
  ws.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    handleDataStreamUpdate(payload);
  };

  return () => ws.close();
}, []);
```

## License
Provided "as is" under the MIT License. Structured and maintained for enterprise-grade scalability.
