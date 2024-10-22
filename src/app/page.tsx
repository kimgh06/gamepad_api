"use client"

import { useEffect, useState } from "react"

export default function App() {
  const [pad, setPad] = useState<Gamepad>();
  const [buttonLog, setButtonLog] = useState<string[]>([]);
  const [axisLog, setAxisLog] = useState<string[]>([]);
  function Loop() {
    let pad = navigator.getGamepads()[0] as Gamepad;
    if (!pad) {
      return;
    }
    if (pad) {
      pad.buttons.forEach((button, index) => {
        if (button.pressed) {
          // console.log(`${pad.timestamp / 1000}s Button ${index} pressed on value ${button.value}`);
          setButtonLog(e => [`${pad.timestamp / 1000}s Button ${index} pressed on value ${button.value}`, ...e])
          if (index === 7) {
            pad.vibrationActuator?.playEffect("dual-rumble", {
              duration: 100,
              strongMagnitude: button.value,
              startDelay: 0
            })
          }
          if (index === 6) {
            pad.vibrationActuator?.playEffect("dual-rumble", {
              duration: 100,
              weakMagnitude: button.value,
              startDelay: 0
            })
          }
        }
      });

      pad.axes.forEach((axis, index) => {
        if (Math.abs(axis) > 0.1) {
          // console.log(`${pad.timestamp / 1000}s Axis ${index} on gamepad  value: ${axis}`);
          setAxisLog(e => [`${pad.timestamp / 1000}s Axis ${index} on gamepad  value: ${axis}`, ...e]);
        }
      });
    }
    setPad(pad)
    requestAnimationFrame(Loop)
  }
  useEffect(() => {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      console.log('Gamepad connected', e)
      Loop();
    })
    window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
      console.log('Gamepad disconnected', e)
      setPad(undefined)
    })
  }, [])
  return <main>
    {pad && <div>
      {`Gamepad connected at index ${pad.index}: ${pad.id}. It has ${pad.buttons.length} buttons and ${pad.axes.length} axes.`}
      <div style={{
        display: 'flex'
      }}>
        <h2>Button Log</h2>
        <ul>
          {buttonLog.map((log, index) => <li key={index}>{log}</li>)}
        </ul>
        <h2>Axis Log</h2>
        <ul>
          {axisLog.map((log, index) => <li key={index}>{log}</li>)}
        </ul>
      </div>
    </div>}
  </main>
}