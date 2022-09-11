import React, { useState, useEffect } from 'react'
import './MgGame.css'

import mgBgFall from './img/move-bg-fall.png';
import mgBgSpring from './img/move-bg-spring.png';
import mgBgSummer from './img/move-bg-summer.png';
import mgBgWinter from './img/move-bg-winter.png';

import charStop from './img/char-stop.png'

import charBody from './img//move-char-body.png';
import charHead from './img//move-char-head.png';
import mgGoBtn from './img/move-go.png';


export default function App() {

  const mgTimeLimit = 10;
  const [timePerRound, setTimePerRound] = useState(mgTimeLimit);
  const [mgRound, setMgRound] = useState(1);
  const [mgTimeStop, setMgTimeStop] = useState(true);

  const [isReady, setIsReady] = useState(false);

  const mgBgArray = [mgBgSpring, mgBgSummer, mgBgFall, mgBgWinter];
  const [bgSelector, setBgSelector] = useState(0);

  const user = navigator.userAgent;
  const [isIPhone, setIsIPhone] = useState(false);
  useEffect(() => {
    if (user.indexOf("iPhone") > -1) {
      setIsIPhone(true);
    }
    else if (user.indexOf("Android") > -1) {
      setIsIPhone(false);
    }
  }, [])

  const clientWidth = window.innerWidth;
  const charRatio = 10;
  const charSize = clientWidth / charRatio; //캐릭터 크기는 바꾸지 말자.
  const maxPx = clientWidth / 2 - charSize / 2;
  const minPx = -clientWidth / 2 + charSize / 2;
  const [alphaPosition, setAlphaPosition] = useState(0);
  const [charRate, setCharRate] = useState(6);
  const rateConstant = charRate * clientWidth / 180;
  const [alpha, setAlpha] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [gammaPosition, setGammaPosition] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (!mgTimeStop) {
        if (timePerRound > 0) setTimePerRound(timePerRound - 1);
        else if (timePerRound === 0) {
          clearInterval(timer);
          setTimePerRound(mgTimeLimit);
          setMgRound(mgRound + 1);
        };
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timePerRound, mgTimeStop]);

  useEffect(() => {
    const bgIndex = parseInt(mgRound / 5) % 4;
    setBgSelector(bgIndex);
    console.log(bgSelector);
  }, [mgRound]);

  const onClickTimeStop = () => {
    mgTimeStop ? setMgTimeStop(false) : setMgTimeStop(true);
  }
  //onClick={isIPhone ? getDeviceOrientation : onClickReady}

  const getDeviceOrientation = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
          onClickReady();
        }
      }).catch(console.error);
    }
  }

  const onClickReady = () => {
    //addEventListener
    window.addEventListener('deviceorientation', (event) => {
      let alpha = event.alpha;
      let gamma = event.gamma;
      setAlpha(alpha);
      setGamma(gamma);

      let pos = (alpha - 90) * rateConstant;
      let gammaPos = gamma * rateConstant;

      if (pos > maxPx) setAlphaPosition(maxPx);
      else if (pos < minPx) setAlphaPosition(minPx);
      else setAlphaPosition(pos);
      gammaPos = Math.max(0, Math.min(98, gammaPos));
      setGammaPosition(gammaPos);
    })
    setIsReady(true);
    onClickTimeStop();
  }

  return (
    <div className='App'>


      <div className='mg-outer-container'>
        {isReady ? <div></div> :
          <div className='mg-permission'>
            <span id='mgAreYouReady'>준비되었나요?</span>
            <img src={charHead} id='charHead' className='mg-charset' />
            <img src={charBody} id='charBody' className='mg-charset' />

            <img src={mgGoBtn} id='mgGoBtn' onClick={isIPhone ? getDeviceOrientation : onClickReady} />
          </div>
        }
        <div className='mg-bg'
          style={{
            backgroundImage: `url(${mgBgArray[bgSelector]})`,
            height: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <div>time: {timePerRound}</div>
          <div>round: {mgRound}</div>
          <div>alpha: {alpha}</div>
          <div>gamma: {gamma}</div>
          <div>alphaPosition: {alphaPosition} </div>
          <div>gammaPosition: {gammaPosition}</div>
          <button onClick={onClickTimeStop}>timestop</button>
          <div>
            <div>*gammaPosition*</div>
            <img src={charStop}
              style={{
                width: `${charSize}px`,
                position: 'relative',
                bottom: '0',
                left: `${gammaPosition}px`
              }}
              id='charStop' className='mg-char' />
          </div>
          <div>
            <div>*alphaPosition*</div>
            <img src={charStop}
              style={{
                width: `${charSize}px`,
                position: 'relative',
                bottom: '0',
                right: `${alphaPosition}px`
              }}
              id='charStop' className='mg-char' />
          </div>
        </div>
      </div>
    </div>
  )
}
