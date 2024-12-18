import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
new Audio("/impact1.wav"),
  new Audio("/impact2.wav"),
  new Audio("/impact3.wav"),
  new Audio("/impact4.wav")
];
const riserSounds = [
  new Audio("/riser1.wav"),
  new Audio("/riser2.wav")
];
function App() {
  // declaration of variables and sounds used throughout the project
  const impactSounds = [
    
  const [muteStatus, setMute] = useState("Mute");
  const [zoomed, setZoom] = useState(false);
  const [brightText, setBrightText] = useState(false);
  const [easeSilenceText, setEaseText] = useState(false);
  const [equation, setEquation] = useState("");

  async function calculate() {
    if (equation != "" && zoomed == false) {
      // invoke the Rust backend to actually calculate
      // use a regular const here because of some wonky stuff with js asynchrousy
      const output = await invoke("calculate", { expr: equation });

      if(muteStatus == "Mute"){
        playRiserSound(getRandomInt(0, 1));
      }

      // zooming in takes 4 seconds (transition defined in App.css)
      setZoom(true);

      // plays the sound a little early to account for lag from loading the sound and whatnot
      setTimeout(() => {
        if(muteStatus == "Mute"){
          playImpactSound(getRandomInt(0, 3));
        }
      }, 4900);

      // pauses for one second after fully zoomed and gives output + bloom
      setTimeout(() => {      
        setEquation(output);
        setBrightText(true);
      }, 5000);
      // after another second, starts un-zooming and dimming the text
      setTimeout(() => {
        setZoom(false);
        setEaseText(true);
        setBrightText(false);
      }, 6000);
      // fully resets the animation
      setTimeout(() => {
        setEaseText(false);
      }, 10000);
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // selects a random sound played once the equation is done transitioning
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

  // same thing but for risers
  const playRiserSound = (index) => {
    const sound = riserSounds[index];
    if (sound) {
      sound.play().catch((error) => {
        console.error(`Error playing sound at index ${index}`, error);
      });
    } else {
      console.error(`Sound at index ${index} not found!`);
    }
    // stops the riser right as the impact sound plays
    setTimeout(() => {      
      sound.pause();
      sound.currentTime = 0;
    }, 5000);
  };

  // mutes & unmutes
  const toggleSound = () => {
    if(muteStatus == "Mute"){
      setMute("Unmute");
    } else {
      setMute("Mute");
    }
  }

  // called whenever a number or operation is pressed
  // doesnt do anything if the calculator is playing the animation
  const updateEq = (value) => {
    if(zoomed == false){
      setEquation((prevText) => prevText + value);
    }
  };

  // same thing as above; doesnt do anything if animation is playing
  const resetEq = () => {
    if(zoomed == false){
      setEquation("");
    }
  };

  return (
    <main className="container">
      {/* Total Equation */}
      <div
        className={`titleRow
          ${zoomed ? "zoomed-in" : ""}
          ${brightText ? "brightText" : ""}
          ${easeSilenceText ? "easeText" : ""}`}
      >
        <h1>{equation}</h1>
      </div>
      {/* Row With Buttons. Divided into 3 wide by 6 long grid in App.css*/}
      
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
