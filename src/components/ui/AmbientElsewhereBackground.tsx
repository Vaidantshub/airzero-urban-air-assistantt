"use client"

import React, { useEffect, useRef, useState, type CSSProperties } from "react"
import { Volume2, VolumeX, Sun, Moon } from "lucide-react"

const DEFAULT_DAY =
  "https://cdn.21st.dev/assets/mirror/a6/a639af57ee941fdd518c604efb043501ad0e815dcce9f7efba850998bafa3453.mp4"

const DEFAULT_NIGHT =
  "https://cdn.21st.dev/assets/mirror/4b/4badf32b0bc920a2fd1b066182eee89e98d8615f680e01fb19ff62fb56e86872.mp4"

function createAmbientEngine(ctx: AudioContext) {
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Shared low drone
  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.16
  droneGain.connect(master)

  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 700
  filter.connect(droneGain)

  const droneA = ctx.createOscillator()
  droneA.type = "sine"
  droneA.frequency.value = 110

  const droneB = ctx.createOscillator()
  droneB.type = "sine"
  droneB.frequency.value = 110 * 1.008

  droneA.connect(filter)
  droneB.connect(filter)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.045

  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 260

  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  droneA.start()
  droneB.start()
  lfo.start()

  // Day / night layers
  const dayGain = ctx.createGain()
  dayGain.gain.value = 0
  dayGain.connect(master)

  const nightGain = ctx.createGain()
  nightGain.gain.value = 0
  nightGain.connect(master)

  const timers: ReturnType<typeof setTimeout>[] = []
  const clearTimers = () => {
    timers.forEach(clearTimeout)
    timers.length = 0
  }

  // Distant muffled typing
  const distantGain = ctx.createGain()
  distantGain.gain.value = 0.34
  distantGain.connect(master)

  const distantFilter = ctx.createBiquadFilter()
  distantFilter.type = "lowpass"
  distantFilter.frequency.value = 1300
  distantFilter.connect(distantGain)

  function distantKeyClick(time: number) {
    const osc = ctx.createOscillator()
    osc.type = "triangle"
    osc.frequency.value = 280 + Math.random() * 160
    osc.detune.value = (Math.random() - 0.5) * 120

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, time)
    g.gain.linearRampToValueAtTime(0.55, time + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.13)

    osc.connect(g)
    g.connect(distantFilter)
    osc.start(time)
    osc.stop(time + 0.16)
  }

  function scheduleDistantTyping() {
    let t = 0
    const count = 2 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => distantKeyClick(ctx.currentTime), t))
      t += 110 + Math.random() * 170
    }
    timers.push(setTimeout(scheduleDistantTyping, t + 700 + Math.random() * 1400))
  }

  // Alien typing blips
  function typingBlip(time: number) {
    const osc = ctx.createOscillator()
    osc.type = "square"
    const scale = [560, 620, 680, 760, 900]
    const base = scale[Math.floor(Math.random() * scale.length)]
    osc.frequency.value = Math.random() < 0.12 ? base * 2.6 : base
    osc.detune.value = (Math.random() - 0.5) * 500

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, time)
    g.gain.linearRampToValueAtTime(0.45, time + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)

    osc.connect(g)
    g.connect(dayGain)
    osc.start(time)
    osc.stop(time + 0.07)
  }

  function scheduleTyping() {
    let t = 0
    const count = 3 + Math.floor(Math.random() * 6)
    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => typingBlip(ctx.currentTime), t))
      t += 90 + Math.random() * 150
    }
    timers.push(setTimeout(scheduleTyping, t + 900 + Math.random() * 1800))
  }

  // Cicadas
  function cicadaBurst() {
    const now = ctx.currentTime
    const duration = 0.6 + Math.random() * 1.1

    const carrier = ctx.createOscillator()
    carrier.type = "sawtooth"
    carrier.frequency.value = 4000 + Math.random() * 900

    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.frequency.value = carrier.frequency.value
    band.Q.value = 9

    const amp = ctx.createGain()
    amp.gain.value = 0

    const chop = ctx.createOscillator()
    chop.type = "sine"
    chop.frequency.value = 28 + Math.random() * 14

    const chopDepth = ctx.createGain()
    chopDepth.gain.value = 0.28

    const chopOffset = ctx.createConstantSource()
    chopOffset.offset.value = 0.28

    chop.connect(chopDepth)
    chopDepth.connect(amp.gain)
    chopOffset.connect(amp.gain)

    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.4, now + duration * 0.25)
    envelope.gain.linearRampToValueAtTime(0, now + duration)

    carrier.connect(band)
    band.connect(amp)
    amp.connect(envelope)
    envelope.connect(nightGain)

    carrier.start(now)
    chop.start(now)
    chopOffset.start(now)

    carrier.stop(now + duration)
    chop.stop(now + duration)
    chopOffset.stop(now + duration)
  }

  function scheduleCicadas() {
    cicadaBurst()
    if (Math.random() < 0.4) {
      timers.push(setTimeout(cicadaBurst, 180 + Math.random() * 260))
    }
    timers.push(setTimeout(scheduleCicadas, 700 + Math.random() * 1600))
  }

  scheduleTyping()
  scheduleCicadas()
  scheduleDistantTyping()

  return {
    setMuted(muted: boolean) {
      master.gain.linearRampToValueAtTime(muted ? 0 : 0.55, ctx.currentTime + 0.4)
    },
    setNight(isNight: boolean) {
      const t = ctx.currentTime
      dayGain.gain.linearRampToValueAtTime(isNight ? 0 : 1, t + 0.8)
      nightGain.gain.linearRampToValueAtTime(isNight ? 1 : 0, t + 0.8)
    },
    dispose() {
      clearTimers()
      ;[droneA, droneB, lfo].forEach((oscillator) => {
        try {
          oscillator.stop()
        } catch {
          // Already stopped
        }
      })
      master.disconnect()
    },
  }
}

export default function AmbientElsewhereBackground() {
  const dayVideoRef = useRef<HTMLVideoElement>(null)
  const nightVideoRef = useRef<HTMLVideoElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const engineRef = useRef<ReturnType<typeof createAmbientEngine> | null>(null)

  const [isNight, setIsNight] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    return () => {
      engineRef.current?.dispose()
      audioCtxRef.current?.close()
    }
  }, [])

  function toggleNight() {
    setIsNight((val) => {
      engineRef.current?.setNight(!val)
      return !val
    })
  }

  function toggleMuted() {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx
      const engine = createAmbientEngine(ctx)
      engineRef.current = engine
      engine.setNight(isNight)
      engine.setMuted(false)
      setMuted(false)
      return
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }

    setMuted((val) => {
      engineRef.current?.setMuted(!val)
      return !val
    })
  }

  const videoStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 1.4s ease",
  }

  return (
    <>
      {/* Living Atmospheric Video Layer */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        {/* Day Footage */}
        <video
          ref={dayVideoRef}
          src={DEFAULT_DAY}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          style={{ ...videoStyle, opacity: isNight ? 0 : 0.85 }}
        />

        {/* Night Footage */}
        <video
          ref={nightVideoRef}
          src={DEFAULT_NIGHT}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          style={{ ...videoStyle, opacity: isNight ? 0.9 : 0 }}
        />

        {/* Crystal Ambient Vignette - clear & luminous */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/45 pointer-events-none"
        />
      </div>

      {/* Floating Crystal Glass Ambient Controls Widget */}
      <aside 
        aria-label="Ambient Soundscape and Atmosphere Controls"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 pointer-events-auto glass-pill px-3 py-2 rounded-full shadow-2xl transition-all hover:scale-[1.03]"
      >
        {/* Day / Night Toggle */}
        <button
          onClick={toggleNight}
          title={isNight ? "Switch to Day soundscape & video" : "Switch to Night soundscape & video"}
          className="p-1.5 rounded-full hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer"
        >
          {isNight ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-300" />}
        </button>

        {/* Ambient Web Audio Synthesizer */}
        <button
          onClick={toggleMuted}
          title={muted ? "Play ambient generative audio (keys & cicadas)" : "Mute ambient audio"}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            muted
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40"
          }`}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
          <span>{muted ? "Soundscape Off" : "Soundscape On"}</span>
        </button>

        <span className="text-[11px] text-white/80 font-semibold pr-1 hidden sm:inline">
          Elsewhere Sound
        </span>
      </aside>
    </>
  )
}
