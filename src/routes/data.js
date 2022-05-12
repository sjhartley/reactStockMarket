import { Link } from "react-router-dom";
import "./data.css";
import React from "react";
import $ from "jquery";
import "jquery.marquee";
import Switch from "react-input-switch";
const axios = require("axios");

// export default function Data() {
//   return (
//     <main>
//       <h2>NYSE/NASDAQ data</h2>
//       <nav
//         style={{
//           borderBottom: "solid 1px",
//           paddingBottom: "1rem",
//         }}
//       >
//         <Link to="/">Home</Link> |{" "}
//         <Link to="/radio">Bloomberg Radio</Link> |{" "}
//         <Link to="/watchlist">Watchlist</Link>
//       </nav>
//     </main>
//   );
// }

class Data extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nyse_word: "",
      nasdaq_word: "",
      nyse_stuff: [],
      nyse_counter: 0,
      nasdaq_stuff: [],
      nasdaq_counter: 0,
      stuff: {},
      mq: null,
      dividends: null,
      marketCountDown: "",
      mode: "dark",
      modeEmojis: { dark: "&#x1F31B;", light: "&#x1F31E;" },
      searchMode: null,
      searchOptions: ["ticker", "name", "ticker/name"],
      source: null,
      sourceOptions: ["NYSE", "NASDAQ"],
      word: null,
      titleColorSwitch: 0
    };

    this.handleChangeWord = this.handleChangeWord.bind(this);
    this.handleSubmitWord = this.handleSubmitWord.bind(this);
    this.updateInputInstr = this.updateInputInstr.bind(this);
  }

  handleChangeWord(event) {
    this.setState({ word: event.target.value });
  }

  handleSubmitWord(event) {
    //alert("A name was submitted: " + this.state.word);
    //console.log(`value=${this.state.word}`);
    this.setState({ stuff: {} });
    this.setState({ mq: "" });
    this.setState({ dividends: "" });
    this.setState(
      { mq: "Requesting data from server...\nPlease Wait..." },
      function () {
        console.log("loading");
      }
    );
    let sourceInput = document.getElementById("source");
    let searchModeInput = document.getElementById("searchMode");
    //console.log("source is");
    //console.log(sourceInput.value);
    //this.get_nyse(this.state.word);
    //console.log("search mode....");
    //console.log(searchModeInput.value);
    let sourceVal = sourceInput.value;
    let searchVal = searchModeInput.value;
    if (sourceVal === "NYSE") {
      this.get_nyse(this.state.word, searchVal);
    } else if (sourceVal === "NASDAQ") {
      this.get_nasdaq(this.state.word, searchVal);
    }
    event.preventDefault();
  }

  updateInputInstr(event) {
    console.log(event.target.value);
    let updateInstr = document.getElementById("updateInstr");
    updateInstr.innerText = `Enter ${event.target.value}`;
  }

  get_nyse(keyWord, searchMode) {
    var self1 = this;
    //console.log(`keyWord=${keyWord}`);
    //console.log(`searchMode=${searchMode}`);
    axios
      //.post("https://backend684.herokuapp.com/nyse", `keyWord=${keyWord}`)
      .post("https://backend684.herokuapp.com/nyse", {
        params: {
          keyWord: keyWord,
          mode: searchMode
        }
      })
      .then(function (response) {
        //console.log("------------------------");
        //console.log("post response");
        //console.log(response.data[1]);

        console.log(response.data[0]);
        console.log(response.data[1]);
        console.log(response.data[2]);

        if (response.data[0] != false) {
          self1.setState({ mq: response.data[0] });
          self1.setState({ dividends: response.data[1] });

          Object.keys(response.data[2]).forEach((key) => {
            //console.log(key, response.data[2][key]);
          });
          self1.setState({ stuff: response.data[2] });
        } else {
          self1.setState({ mq: "NO MATCH..." });
        }
      })
      .catch(function (err) {
        console.log(err);
        // let table_div = document.getElementById("table-div");
        // table_div.innerText = "Cannot retrieve NYSE data...";
        self1.setState({ stuff: false });
      });
  }

  get_nasdaq(keyWord, searchMode) {
    this.setState({ mq: "" });
    this.setState({ dividends: "" });
    var self1 = this;
    //console.log(`keyWord=${keyWord}`);
    axios
      .post("https://backend684.herokuapp.com/nasdaq", {
        params: {
          keyWord: keyWord,
          mode: searchMode
        }
      })
      .then(function (response) {
        let table_div = document.getElementById("table-div");

        if (keyWord === "help") {
          self1.setState({ mq: response.data });
        } else if (keyWord === "--all") {
          //console.log(typeof response.data);
          //console.log(response.data);
          //mq.innerHTML = response.data;
          let arr = [];
          Object.keys(response.data).forEach((key) => {
            arr.push(response.data[key]);
          });
          self1.setState({ nasdaq_stuff: arr });
        } else if (keyWord === "market-info" || keyWord === "--l") {
          if (keyWord === "--l") {
            //could display list in table...
            //console.log(response.data);
            let msgStr = "";
            for (let i = 0; i < response.data.length; i++) {
              Object.keys(response.data[i]).map((key, index) => {
                msgStr += `${response.data[i][key]}`;
                if (index == 0) {
                  msgStr += ": ";
                }
              });
              msgStr += "\n";
            }
            //table_div.innerText = "";
            self1.setState({ stuff: {} });
            self1.setState({ mq: msgStr });
            return false;
          }
          self1.setState({ stuff: response.data.data });
        } else {
          console.log("response.data");
          console.log(typeof response.data);
          console.log(response.data);
          if (response.data !== false) {
            //console.log(response.data[0]);
            self1.setState({ stuff: response.data[0] });
          } else {
            self1.setState({ stuff: false });
            self1.setState({ mq: "NO MATCH..." });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
        // let table_div = document.getElementById("table-div");
        // table_div.innerText = "Cannot retrieve NASDAQ data...";
        self1.setState({ stuff: false });
      });
  }

  get_marketCountdown(keyWord) {
    return new Promise(function (resolve, reject) {
      axios
        .post("https://backend684.herokuapp.com/nasdaq", {
          params: {
            keyWord: "market-info",
            mode: ""
          }
        })
        .then(function (response) {
          //console.log(response.data);
          //console.log(typeof response.data);
          if (
            typeof response.data.data["marketCountDown"] !== "undefined" ||
            response.data.data["marketCountDown"] !== null
          ) {
            resolve(response.data.data["marketCountDown"]);
          } else {
            return false;
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  }

  showCountdown() {
    var $mq = this.$el;
    let self2 = this;
    //let marketCountDown = this.state.marketCountDown;

    $mq
      .marquee({
        duration: 15000,
        delayBeforeStart: 0
      })
      .bind("finished", () => {
        $mq.marquee("destroy");
        //document.getElementById("marquee").innerHTML = new Date().toString();
        document.getElementById(
          "marquee"
        ).innerHTML = this.state.marketCountDown;
        self2.showCountdown();
      });
  }

  showNasdaq() {
    let $nasdaq = this.$nasdaq;
    let self = this;

    $nasdaq
      .marquee({
        duration: 15000,
        delayBeforeStart: 0
      })
      .bind("finished", () => {
        $nasdaq.marquee("destroy");
        //document.getElementById("marquee").innerHTML = new Date().toString();
        let nasdaq_arr = self.state.nasdaq_stuff;
        //console.log("nasdaq_arr.....");
        //console.log(nasdaq_arr);
        let counter = self.state.nasdaq_counter;
        let msg_str = "";
        let sliced_arr = nasdaq_arr.slice(counter, counter + 5);
        //console.log(sliced_arr);
        for (let a = 0; a < sliced_arr.length; a++) {
          msg_str += `${sliced_arr[a]["Symbol"]}: ${sliced_arr[a]["last"]}     `;
        }
        //console.log(msg_str);
        document.getElementById("nasdaq").innerHTML = msg_str;
        if (nasdaq_arr.length - counter < 5) {
          sliced_arr = nasdaq_arr.slice(
            counter,
            counter + (nasdaq_arr.length - counter)
          );
          self.setState({ nasdaq_counter: 0 });
        } else {
          self.setState({ nasdaq_counter: self.state.nasdaq_counter + 5 });
        }
        self.showNasdaq();
      });
  }

  showNyse() {
    let $nyse = this.$nyse;
    let self = this;

    $nyse
      .marquee({
        duration: 7000,
        delayBeforeStart: 0
      })
      .bind("finished", () => {
        $nyse.marquee("destroy");
        //document.getElementById("marquee").innerHTML = new Date().toString();
        let nyse_arr = self.state.nasdaq_stuff;
        //console.log("nyse_arr.....");
        //console.log(nasdaq_arr);
        let counter = self.state.nyse_counter;
        let msg_str = "";
        let sliced_arr = nyse_arr.slice(counter, counter + 5);
        //console.log(sliced_arr);
        for (let a = 0; a < sliced_arr.length; a++) {
          msg_str += `${sliced_arr[a]["Symbol"]}: ${sliced_arr[a]["last"]}     `;
        }
        //console.log(msg_str);
        document.getElementById("nyse").innerHTML = msg_str;
        if (nyse_arr.length - counter < 5) {
          sliced_arr = nyse_arr.slice(
            counter,
            counter + (nyse_arr.length - counter)
          );
          self.setState({ nyse_counter: 0 });
        } else {
          self.setState({ nyse_counter: self.state.nyse_counter + 5 });
        }

        self.showNyse();
      });
  }

  test() {
    axios
      .get("https://backend684.herokuapp.com/test")
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  updateCountdown(countdown) {
    this.setState({ marketCountDown: countdown });
  }

  componentDidMount() {
    //let main=document.getElementById("main");
    //main.style.height=window.innerHeight;
    document.body.style.backgroundImage="none";

    document.body.style.backgroundImage="none";
    let local_mode=localStorage.getItem("mode");
    console.log(`mode=${localStorage.getItem("mode")}`);
    if(local_mode !== null){
      this.changeColor(local_mode);
    }
    else{
      this.changeColor(this.state.mode);
    }

    let self1 = this;
    this.showCountdown();
    this.showNasdaq();
    this.test();

    this.get_marketCountdown().then(function (countdown) {
      //console.log(countdown);
      let split_str = countdown.split(" ");
      //console.log(split_str);
      if (split_str[split_str.length - 1].search("S") !== -1) {
        countdown = countdown.split(" ").slice(0, -1).join(" ");
      }
      self1.updateCountdown(`${countdown}`);
    });

    this.interval = setInterval(function () {
      self1.get_marketCountdown().then(function (countdown) {
        //console.log("................");
        let split_str = countdown.split(" ");
        if (split_str[split_str.length - 1].search("S") !== -1) {
          countdown = countdown.split(" ").slice(0, -1).join(" ");
        }
        self1.updateCountdown(`${countdown}`);
      });
    }, 60 * 1000);

    this.get_nasdaq("--all");

    this.interval1 = setInterval(function () {
      //create redirect function if data is not initially available
      self1.get_nasdaq("--all");
    }, 60 * 15 * 1000);

    //create function to retrieve nyse data in batches to display in marquee

    //console.log("props....");
    //console.log(this.state);
    // this.setState({ titleColorSwitch: 0 });
    // setInterval(function () {
    //   let title = document.getElementById("title");
    //   //console.log(title.style);
    //   if (self1.state.titleColorSwitch === 0) {
    //     title.style.color = "red";
    //     self1.setState({ titleColorSwitch: 1 });
    //   } else if (self1.state.titleColorSwitch === 1) {
    //     title.style.color = "white";
    //     self1.setState({ titleColorSwitch: 0 });
    //   }
    // }, 2000);

    let searchModeInput = document.getElementById("searchMode");
    let updateInstr = document.getElementById("updateInstr");
    updateInstr.innerText = `Enter ${searchModeInput.value}`;
  }

  handleSearchMode = (selectedSearchMode) => {
    this.setState({ searchMode: selectedSearchMode });
  };

  handleSource = (selectedSource) => {
    this.setState({ source: selectedSource });
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

  render() {
    let stuff = this.state.stuff;

    const dataAvailable = () => {
      let tableDiv = document.getElementById("table-div");

      //conditional rendering

      if (stuff !== false && typeof stuff === "object") {
        //console.log("stuff...");
        //console.log(stuff);
        //console.log(Object.keys(stuff).length);

        if (Object.keys(stuff).length !== 0) {
          if (tableDiv !== null) {
            tableDiv.style.display = "block";
          }
          let tableMake = Object.keys(stuff).map((key, index) => {
            return (
              <tr key={`${index}a`}>
                <td key={`${index}b`}>{key}</td>
                <td key={`${index}c`}>{stuff[key].toString()}</td>
              </tr>
            );
          });
          return tableMake;
        }
      } else {
        tableDiv.style.display = "none";
      }
    };

    const renderSearchOptions = () => {
      //console.log("searchOptions are below...");
      //console.log(this.state.searchOptions);
      if (this.state.searchOptions.length !== 0) {
        let options = this.state.searchOptions.map(function (el, i) {
          //console.log(i);
          //console.log(el);
          return <option value={`${el}`}>{`${el}`}</option>;
        });
        return options;
      } else {
        return <option>NO OPTIONS AVAILABLE</option>;
      }
    };

    const renderSourceOptions = () => {
      //console.log("searchOptions are below...");
      //console.log(this.state.searchOptions);
      if (this.state.sourceOptions.length !== 0) {
        let options = this.state.sourceOptions.map(function (el, i) {
          //console.log(i);
          //console.log(el);
          return <option value={`${el}`}>{`${el}`}</option>;
        });
        return options;
      } else {
        return <option>NO OPTIONS AVAILABLE</option>;
      }
    };

    //console.log(`mode=${this.state.mode}`);
    let mode = this.state.mode;

    return (
      <html>
        <div id="main">
          <div id="marquee" ref={(el) => (this.$el = $(el))}></div>
          <div id="nasdaq" ref={(nasdaq) => (this.$nasdaq = $(nasdaq))}></div>

          <div id="main">
            <main>
              <nav
                style={{
                  borderBottom: "solid 1px",
                  paddingBottom: "0.2rem",
                  display: "block",
                  backgroundColor: "yellow"
                }}
              >
                <h2 id="data-title">Stock Market</h2>
                <Link to="/">Home</Link> |{" "}
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

            </main>

            <div id="header">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto ",
                  padding: "10px"
                }}
              >
                <div class="grid1">
                  {" "}
                  <h4>Search mode</h4>
                  <select onChange={this.updateInputInstr} id="searchMode">
                    {renderSearchOptions()}
                  </select>
                </div>
                <div class="grid1">
                  {" "}
                  <h4>Source mode</h4>
                  <select id="source">{renderSourceOptions()}</select>
                </div>
              </div>
            </div>

            <div id="search" style={{ textAlign: "center" }}>
              <form onSubmit={this.handleSubmitWord}>
                <label>
                  <div id="updateInstr" style={{ paddingBottom: "1rem" }}>
                    {}
                  </div>
                  <div style={{ paddingBottom: "1rem" }}>
                    <input
                      type="text"
                      id="name"
                      value={this.state.word}
                      onChange={this.handleChangeWord}
                    />
                  </div>
                </label>
                <input type="submit" value="Submit" />
              </form>
            </div>

            <div id="dataDisp" style={{ paddingTop: "2rem" }}>
              <div id="table-div" style={{ display: "none" }}>
                <table>
                  <tbody>{dataAvailable()}</tbody>
                </table>
              </div>

              <div>
                <p id="mq" style={{ whiteSpace: "pre-wrap" }}>
                  {this.state.mq}
                </p>
              </div>
              <div>
                <p id="dividends">{this.state.dividends}</p>
              </div>
            </div>
          </div>
        </div>
      </html>
    );
  }
}

export default Data;
