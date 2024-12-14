import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [buildup1] = useState(new Audio("/riser1.wav"));
  const impactSounds = [
    new Audio("/impact1.wav"),
    new Audio("/impact2.wav"),
    new Audio("/impact3.wav"),
    new Audio("/impact4.wav")
  ];
  const riserSounds = [
    new Audio("/riser1.wav"),
    new Audio("/riser2.wav")
  ];
  const [muteStatus, setMute] = useState("Mute");
  const [zoomed, setZoom] = useState(false);
  const [brightText, setBrightText] = useState(false);
  const [easeSilenceText, setEaseText] = useState(false);
  const [equation, setEquation] = useState("");
  
  async function calculate() {
    if (equation != "") {
      if(muteStatus == "Mute"){
        playRiserSound(getRandomInt(0, 1));
      }
      // zooming in takes 4 seconds
      setZoom(true);
      // plays the sound a little early to account for lag
      setTimeout(() => {
        if(muteStatus == "Mute"){
          playImpactSound(getRandomInt(0, 3));
        }
      }, 4900);
      // pauses for one second after fully zoomed and solves + bloom
      setTimeout(() => {      
        setEquation(eval(equation));
        setBrightText(true);
      }, 5000);
      // after another second, starts un-zooming and dimming the text
      setTimeout(() => {
        setZoom(false);
        setEaseText(true);
        setBrightText(false);
      }, 6000);
      setTimeout(() => {
        setEaseText(false);
      }, 10000);
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const playImpactSound = (index) => {
    const sound = impactSounds[index];
    if (sound) {
      sound.play().catch((error) => {
        console.error(`Error playing sound at index ${index}`, error);
      });
    } else {
      console.error(`Sound at index ${index} not found!`);
    }
  };

  const playRiserSound = (index) => {
    const sound = riserSounds[index];
    if (sound) {
      sound.play().catch((error) => {
        console.error(`Error playing sound at index ${index}`, error);
      });
    } else {
      console.error(`Sound at index ${index} not found!`);
    }
    setTimeout(() => {      
      sound.pause();
      sound.currentTime = 0;
    }, 5000);
  };

  const toggleSound = () => {
    if(muteStatus == "Mute"){
      setMute("Unmute");
    } else {
      setMute("Mute");
    }
  }

  const updateEq = (value) => {
    setEquation((prevText) => prevText + value);
  };

  const resetEq = () => {
    setEquation("");
  };

  return (
    <main className="container">
      {/* Total Equation Information */}
      <div
        className={`titleRow
          ${zoomed ? "zoomed-in" : ""}
          ${brightText ? "brightText" : ""}
          ${easeSilenceText ? "easeText" : ""}`}
      >
        <h1>{equation}</h1>
      </div>
      {/* Row 1 */}
      
      <div className="buttonGrid">
        <button onClick={() => updateEq("1")}>1</button>
        <button onClick={() => updateEq("2")}>2</button>
        <button onClick={() => updateEq("3")}>3</button>
        <button onClick={() => updateEq("4")}>4</button>
        <button onClick={() => updateEq("5")}>5</button>
        <button onClick={() => updateEq("6")}>6</button>
        <button onClick={() => updateEq("7")}>7</button>
        <button onClick={() => updateEq("8")}>8</button>
        <button onClick={() => updateEq("9")}>9</button>
        <button onClick={() => updateEq(".")}>.</button>
        <button onClick={() => updateEq("0")}>0</button>
        <button onClick={() => updateEq("/")}>/</button>
        <button onClick={() => updateEq("+")}>+</button>
        <button onClick={() => updateEq("-")}>-</button>
        <button onClick={() => updateEq("*")}>*</button>
        <button onClick={() => resetEq()}>Clear</button>
        <button onClick={() => toggleSound()}>{muteStatus}</button>
        <button onClick={() => calculate()}>=</button>
      </div>
    </main>
  );
}

export default App;
