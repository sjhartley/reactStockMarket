import logo from './logo.svg';
import './App.css';
import React from 'react';
import Switch from "react-input-switch";

import { Link } from "react-router-dom";

export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state={
      mode: "dark",
      modeEmojis: { dark: "&#x1F31B;", light: "&#x1F31E;" },
    };
  };

  changeColor = (mode) => {
    localStorage.setItem('mode', mode);
    this.setState({ mode: mode });
    let color = "";
    let emojiMode = document.getElementById("modeEmoji");
    let body = document.body;

    if (mode == "dark") {
      color = "#000000";
      //emojiMode.innerHTML = this.state.modeEmojis[mode];
    } else if (mode == "light") {
      color = "#FFFFFF";
      //emojiMode.innerHTML = this.state.modeEmojis[mode];
    }

    body.style.backgroundColor = color;

    if (emojiMode !== null) {
      emojiMode.innerHTML = this.state.modeEmojis[mode];
    }
  };

  componentDidMount(){
    document.body.style.backgroundImage="none";
    let local_mode=localStorage.getItem("mode");
    console.log(`mode=${localStorage.getItem("mode")}`);
    if(local_mode !== null){
      this.changeColor(local_mode);
    }
    else{
      this.changeColor(this.state.mode);
    }
  }

  render(){
    return (
      <div>
        <div>
        <h2 id="home-title">Home</h2>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
            backgroundColor: "yellow"
          }}
        >
          <Link to="/data">NYSE/NASDAQ data</Link> |{" "}
          <Link to="/radio">Bloomberg Radio</Link> |{" "}
          <Link to="/watchlist">Watchlist</Link>
          <div>
          <span>{`${this.state.mode}`}</span>
          <span id="modeEmoji"></span>

          <span>
          <Switch
            on="light"
            off="dark"
            value={this.state.mode}
            onChange={(mode) => this.changeColor(mode)}

          />
          </span>
          </div>
        </nav>
        </div>
        <div align="center">
          <iframe src="https://giphy.com/embed/IhCzUdnSvrTaymIofq" width="800" height="600" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/stock-wall-street-stockmarket-IhCzUdnSvrTaymIofq"></a></p>
        </div>
      </div>
    );
  };
}
