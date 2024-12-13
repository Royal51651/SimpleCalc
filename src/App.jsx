import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [buildup1] = useState(new Audio("/riser1.wav"));
  const [impact1] = useState(new Audio("/impact1.wav"));
  const [zoomed, setZoom] = useState(false);
  const [brightText, setBrightText] = useState(false);
  const [easeSilenceText, setEaseText] = useState(false);
  const [equation, setEquation] = useState("");

  async function calculate() {
    if (equation != "") {
      buildup1.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
      // zooming in takes 4 seconds
      setZoom(true);
      // plays the sound a little early to account for lag
      setTimeout(() => {
        impact1.play().catch((error) => {
          console.error("Error playing sound", error);
        });
      }, 4900);
      // pauses for one second after fully zoomed and solves + bloom
      setTimeout(() => {
        let total = eval(equation);
        setEquation(total);
        buildup1.pause();
        buildup1.currentTime = 0;
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

  const updateEq = (value) => {
    setEquation((prevText) => prevText + value);
  };

  const resetEq = () => {
    setEquation("");
  };

  return (
    <main className="container">
      <div className="calculator">
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
        <div className="row">
          <button onClick={() => updateEq("1")}>1</button>
          <button onClick={() => updateEq("2")}>2</button>
          <button onClick={() => updateEq("3")}>3</button>
        </div>
        {/* Row 2 */}
        <div className="row">
          <button onClick={() => updateEq("4")}>4</button>
          <button onClick={() => updateEq("5")}>5</button>
          <button onClick={() => updateEq("6")}>6</button>
        </div>
        {/* Row 3 */}
        <div className="row">
          <button onClick={() => updateEq("7")}>7</button>
          <button onClick={() => updateEq("8")}>8</button>
          <button onClick={() => updateEq("9")}>9</button>
        </div>
        {/* Row 4 */}
        <div className="row">
          <button onClick={() => updateEq(".")}>.</button>
          <button onClick={() => updateEq("0")}>0</button>
          <button onClick={() => updateEq("/")}>/</button>
        </div>
        <div className="row">
          <button onClick={() => updateEq("+")}>+</button>
          <button onClick={() => updateEq("-")}>-</button>
          <button onClick={() => updateEq("*")}>*</button>
        </div>
        <div className="row">
          <button onClick={() => resetEq()}>Clear</button>
          <button onClick={() => calculate()}>=</button>
        </div>
      </div>
    </main>
  );
}

export default App;
