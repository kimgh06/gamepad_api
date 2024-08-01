"use client"

import { useEffect, useState } from "react"

export default function App() {
  const [pad, setPad] = useState<Gamepad>();
  function Loop() {
    let pad = navigator.getGamepads()[0] as Gamepad;
    if (!pad) {
      return;
    }
    if (pad) {
      pad.buttons.forEach((button, index) => {
        if (button.pressed) {
          // console.log(`${pad.timestamp / 1000}s Button ${index} pressed on value ${button.value}`);
        }
      });

      pad.axes.forEach((axis, index) => {
        if (Math.abs(axis) > 0.1) {
          console.log(`${pad.timestamp / 1000}s Axis ${index} on gamepad  value: ${axis}`);
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
    </div>}
  </main>
}