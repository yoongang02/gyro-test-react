import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import './MgGame.css'

import mgBgFall from '../img/move-bg-fall.png';
import mgBgSpring from '../img/move-bg-spring.png';
import mgBgSummer from '../img/move-bg-summer.png';
import mgBgWinter from '../img/move-bg-winter.png';

import charStop from '../img/char-stop.png'
import charLeft from '../img/char-left.png'
import charRight from '../img/char-right.png'

import charBody from '../img/move-char-body.png';
import charHead from '../img/move-char-head.png';
import mgGoBtn from '../img/move-go.png';

import mgStopBtn from '../img/btn-stop.png';
import mgClockImg from '../img/clock.png';
import mgClockBack from '../img/clock-back.png';

import mgStopOptionKeepGoing from '../img/mg-keep-going.png';
import mgStopOptionReplay from '../img/mg-replay.png';
import mgStopOptionStop from '../img/mg-stop.png';


export default function App() {
  const mgTimeLimit = 10;
  const [timePerRound, setTimePerRound] = useState(mgTimeLimit);
  const [mgRound, setMgRound] = useState(1);
  const [mgScore, setMgScore] = useState(0);
  const [mgTimeStop, setMgTimeStop] = useState(true);

  const [isReady, setIsReady] = useState(false);
  const [showStopOption, setShowStopOption] = useState(false);

  const mgBgArray = [mgBgSpring, mgBgSummer, mgBgFall, mgBgWinter];
  const [bgSelector, setBgSelector] = useState(0);
  const [bgBackwardSelector, setBgBackwardSelector] = useState(0);

  const location = useLocation();
  const isIPhone = location.state.isIPhone;

  const clientWidth = window.innerWidth;
  const charRatio = 10;
  const charSize = clientWidth / charRatio; //캐릭터 크기는 바꾸지 말자.
  const maxPx = clientWidth / 2 - charSize / 2;
  const minPx = -clientWidth / 2 + charSize / 2;
  const [gamma, setGamma] = useState(0);
  const [gammaPosition, setGammaPosition] = useState(0);
  const [charRate, setCharRate] = useState(6);
  const rateConstant = charRate * clientWidth / 180;

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

      const bgBackwardIndex = parseInt(mgRound + 1 / 5) % 4;
      setBgBackwardSelector(bgBackwardIndex);
      console.log(bgSelector);
  }, [mgRound]);

  const onClickTimeStop = () => {
      setShowStopOption(true);
      setMgTimeStop(true);
      //mgTimeStop ? setMgTimeStop(false) : setMgTimeStop(true);
  }

  const onClickKeepGoing = () => {
      setShowStopOption(false);
      setMgTimeStop(false);
  }

  const onClickReplay = () => {
      window.location.replace("/movingGame/game");
  }

  const onClickQuit = () => {
      //바로 사망처리
  }

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
          let gamma = event.gamma;
          setGamma(gamma);
          let gammaPos = gamma * rateConstant;
          gammaPos = Math.max(minPx, Math.min(maxPx, gammaPos));
          setGammaPosition(gammaPos);
      })
      setIsReady(true);
      setMgTimeStop(false);
  }

  const clocPointWidthVW = 69;
  const [timeProgress, setTimeProgress] = useState(1);
  useEffect(() => {
      const remainTime = timePerRound / mgTimeLimit;
      setTimeProgress(remainTime);
  }, [timePerRound]);



  return (
      <div className='mg-outer-container'
          style={{ backgroundImage: `url(${mgBgArray[bgBackwardSelector]})` }}>
          {isReady ? <div></div> :
              <div className='mg-permission'>
                  <span id='mgAreYouReady'>준비되었나요?</span>
                  <img src={charHead} id='charHead' className='mg-charset' />
                  <img src={charBody} id='charBody' className='mg-charset' />

                  <img src={mgGoBtn} id='mgGoBtn' onClick={isIPhone ? getDeviceOrientation : onClickReady} />
              </div>
          }
          {showStopOption ?
              <div className='mg-permission'>
                  <div className='mg-stop-option-container'>
                      <img src={mgStopOptionKeepGoing} id='mgStopOptionKeepGoing' className='msStopOptionBtn' onClick={onClickKeepGoing} />
                      <img src={mgStopOptionReplay} id='mgStopOptionReplay' className='msStopOptionBtn' onClick={onClickReplay} />
                      <img src={mgStopOptionStop} id='mgStopOptionStop' className='msStopOptionBtn' onClick={onClickQuit} />
                  </div>
              </div>
              : <div></div>}
          <div className='mg-bg'
              style={{
                  backgroundImage: `url(${mgBgArray[bgSelector]})`,
                  height: '100vh',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 80%',
                  backgroundRepeat: 'no-repeat',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
              }}>
              <div>
                  <div className='mg-time-and-stopBtn'>
                      <div className='mg-clock-container'>
                          <div id='mgClockPoint' style={{ width: `${timeProgress * clocPointWidthVW}vw` }}></div>
                          <img src={mgClockImg} id='mgClockImg' />
                          <img src={mgClockBack} id='mgClockBack' />
                      </div>
                      <img src={mgStopBtn} id='mgStopBtn' onClick={onClickTimeStop} />
                  </div>
                  <div className='mg-score-and-round'>
                      <div id='mgScore'>Score: {mgScore}</div>
                      <div id='mgRound'>Round: {mgRound}</div>
                  </div>
              </div>
              <div>
                  <div>time: {timePerRound}</div>
                  <div>round: {mgRound}</div>
                  <div>gamma: {gamma}</div>
                  <div>gammaPosition: {gammaPosition}</div>
                  <button onClick={onClickTimeStop}>timestop</button>
              </div>
              <div>
                  <img src={charStop}
                      style={{
                          width: `${charSize}px`,
                          position: 'relative',
                          bottom: '0',
                          left: `${gammaPosition}px`
                      }}
                      id='charStop' className='mg-char' />
              </div>
          </div>
      </div>
  )
}
