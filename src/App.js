import './App.css';
import React, { useState, useEffect, useRef } from 'react'
import charImg from './img/char.png'
import stopImg from './img/btn-stop.png'
import clockImg from './img/clock.png'

function App() {
  const [gamma, setGamma] = useState(0);
  const [position, setPosition] = useState(0);
  const [charRatio, setCharRatio] = useState(10);

  const clientWidth = window.innerWidth;
  const charSize = clientWidth / charRatio;
  const maxPx = clientWidth / 2 - charSize / 2;
  const minPx = -clientWidth / 2 + charSize / 2;
  const rateConstant = 1.5 * clientWidth / 180;

  if (window.DeviceOrientationEvent) {
    //이벤트 리스너 등록
    window.addEventListener('deviceorientation', function (event) {
      let gamma = event.gamma; //(-90, 90)
      setGamma(gamma);
      let pos = rateConstant * gamma;
      if (pos > maxPx) setPosition(maxPx);
      else if (pos < minPx) setPosition(minPx);
      else setPosition(pos);
    }, false);
  }

  return (
    <div className="App">
      <div className='삭제예정'>
        <div>clientWidth: {clientWidth}</div>
        <div>gamma: {Math.round(gamma)}</div>
        <div>px: {Math.round(position)}</div>
        <div>maxPx: {maxPx}</div>
        <div>minPx: {minPx}</div>
      </div>
      <div id='char-container'>
        <img
          id='char-img'
          style={{
            width: `${charSize}px`, position: 'relative', left: `${position}px`
          }}
          src={charImg} />
      </div>
    </div>
  );
}

export default App;
