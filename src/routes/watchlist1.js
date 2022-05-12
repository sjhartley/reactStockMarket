import { Link } from "react-router-dom";
import React from 'react';
import Switch from "react-input-switch";
const axios=require("axios");

// export default function watchlist() {
//   return (
//     <main>
//       <h2>Watchlist</h2>
//       <nav
//         style={{
//           borderBottom: "solid 1px",
//           paddingBottom: "1rem",
//         }}
//       >
//         <Link to="/">Home</Link> |{" "}
//         <Link to="/data">NYSE/NASDAQ data</Link> |{" "}
//         <Link to="/radio">Bloomberg Radio</Link>
//       </nav>
//
//
//
//     </main>
//   );
// }

function get_nyse(keyWord) {
  return new Promise(function (resolve, reject) {
    var self1 = this;
    console.log(`keyWord=${keyWord}`);
    axios
      .post(
        "https://vast-citadel-83110.herokuapp.com/nyse",
        `keyWord=${keyWord}`
      )
      .then(function (response) {
        //console.log("------------------------");
        //console.log("post response");
        //console.log(response.data[1]);

        // Object.keys(response.data[2]).forEach((key) => {
        //   console.log(key, response.data[2][key]);
        // });
        //console.log(response.data[2]["symbol"], response.data[2]["prev"]);
        console.log(response.data);
        resolve(response.data);
        //resolve(`${response.data[2]["symbol"]}: ${response.data[2]["prev"]}`);
      });
  });
}


export default class watchlist extends React.Component{
  constructor(props) {
   super(props);
   this.state = {
     ticker: "",
     text: "",
     mode: "dark",
     modeEmojis: { dark: "&#x1F31B;", light: "&#x1F31E;" }
   };

   this.handleChange_ticker = this.handleChange_ticker.bind(this);
   this.handleSubmit_ticker = this.handleSubmit_ticker.bind(this);
   this.showList = this.showList.bind(this);
 }

 handleChange_ticker(event) {
   this.setState({ ticker: event.target.value });
 }

 handleSubmit_ticker(event) {
   alert("A ticker was submitted: " + this.state.ticker);
   console.log(`value=${this.state.ticker}`);
   let submissionType = event.nativeEvent.submitter.value;
   console.log(submissionType);

   if (submissionType == "Add") {
     console.log(this.state.ticker);
     axios
       .post(
         "https://vast-citadel-83110.herokuapp.com/add",
         `keyWord=${this.state.ticker}`
       )
       .then(function (response) {
         console.log(response.data);
       });
   } else if (submissionType == "Delete") {
     console.log(this.state.ticker);
     axios
       .post(
         "https://vast-citadel-83110.herokuapp.com/delete",
         `keyWord=${this.state.ticker}`
       )
       .then(function (response) {
         console.log(response.data);
       });
   } else if (submissionType == "Search") {
     axios
       .post(
         "https://vast-citadel-83110.herokuapp.com/search",
         `keyWord=${this.state.ticker}`
       )
       .then(function (response) {
         console.log(response.data);
         let lists = document.getElementById("lists");
         //lists.innerText=response.data;
         let msg_str = "";

         for (let i = 0; i < response.data.length; i++) {
           console.log(response.data[i]);
           console.log(`${i}, ${response.data[i]}`);
           Object.keys(response.data[i]).forEach((key) => {
             msg_str += `${key}: ${response.data[i][key]} `;
           });
           msg_str += "\n\n";
         }
         console.log(msg_str);
         lists.innerText = msg_str;
       });
   }
   event.preventDefault();
 }



 searchList() {
   axios
     .get("https://vast-citadel-83110.herokuapp.com/search")
     .then(function (response) {
       console.log(response.data);
       let lists = document.getElementById("lists");
       //lists.innerText=response.data;
       let msg_str = "";
       //for (let i = 0; i < response.data.length; i++) {
       //console.log(response.data[i]);
       // console.log(`${i}, ${response.data[i]}`);
       // Object.keys(response.data[i]).forEach((key) => {
       //   msg_str += `${key}: ${response.data[i][key]} `;
       // });
       // msg_str += "\n\n";
       //}
       console.log(msg_str);
       lists.innerText = msg_str;
     });
 }

getOptionVal(){
  let option_val=document.getElementById("op").value;
  return option_val;
}

 showList() {
   var self=this;
   axios
     .get("https://vast-citadel-83110.herokuapp.com/list")
     .then(function (response) {
       console.log(response.data);
       //console.log(response.data[response.data.length - 1]);
       let lists = document.getElementById("lists");
       // lists.innerHTML = response.data;
       let msg_str = "";

       let body=response.data;
       if(self.getOptionVal() == "Z-A"){
         body=body.reverse();
       }

       response.data.forEach(function (el) {
         console.log(el.name);
         msg_str += `${el.name.toString()}, ${el.ticker.toString()}, ${el.url.toString()}\n`;
       });
       lists.innerText = msg_str;
     });
 }

 showWatchlist() {
   axios
     .get("https://vast-citadel-83110.herokuapp.com/watchlist")
     .then(function (response) {
       //console.log(response.data);
       //console.log(response.data[response.data.length - 1]);
       let lists = document.getElementById("lists");
       //lists.innerHTML = response.data;
       let msg_str = "";
       console.log(typeof response.data);
       console.log(response.data);
       console.log(response.data.length);

       if (typeof response.data === "object") {
         response.data.forEach(function (el) {
           //console.log(el.url);
           msg_str += `${el.name.toString()}, ${el.ticker.toString()}, ${el.url.toString()}\n`;
         });
         if (response.data.length === 0) {
           lists.innerText = "WATCHLIST IS EMPTY...";
         } else {
           lists.innerText = msg_str;
         }
       }
     });
 }

 collectWatchlistData() {
   let promises = [];
   var self2 = this;
   axios
     .get("https://vast-citadel-83110.herokuapp.com/watchlist")
     .then(function (response) {
       response.data.forEach((el) => {
         console.log(el.ticker);
         promises.push(get_nyse(el.ticker));
       });
       // Promise.all(promises).then(function (result) {
       //   console.log(result);
       //   let lists = document.getElementById("lists");
       //   lists.innerText = `TICKER/PREV\n${result.join("\n")}`;
       // });
       let lists = document.getElementById("lists");
       let msg_str = "";
       let headers = "<tr><th>Name</th><th>Ticker</th><th>Prev</th></tr>";

       for (let i = 0; i < promises.length; i++) {
         promises[i].then(function (response) {
           console.log("response");
           console.log(response);
           //msg_str += `${response.desc} (${response.symbol}): ${response.prev}\n`;
           msg_str += `<tr><td>${response.desc}</td><td>${response.symbol}</td><td>${response.prev}</td></tr>`;
           lists.innerHTML = `<table style="margin-left: auto; margin-right: auto;">${headers}${msg_str}</table>`;
           //lists.innerText = msg_str;
         });
       }
     });
 }

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

 componentDidMount() {

 document.body.style.backgroundImage="none";
 let local_mode=localStorage.getItem("mode");
 console.log(`mode=${localStorage.getItem("mode")}`);
 if(local_mode !== null){
   this.changeColor(local_mode);
 }
 else{
   this.changeColor(this.state.mode);
 }

   axios
     .get("https://vast-citadel-83110.herokuapp.com/ping")
     .then(function (response) {
       console.log(response);
     });
 }

 render() {
   //add dropdown menu for search -> exact, includes

   const renderOptions = () => {
     let filters=["A-Z", "Z-A"];
     //include more filter options
     //filter between letters for example G-K
     let options = filters.map(function(el, i){
       console.log(el);
       return <option value={`${el}`}>{`${el}`}</option>;
     });
     return options;
   };

   return (
     <div className="watchlist">
       <h2>Watchlist</h2>
       <nav
         style={{
           borderBottom: "solid 1px",
           paddingBottom: "1rem",
           backgroundColor: "yellow"
         }}
       >
         <Link to="/">Home</Link> |{" "}
         <Link to="/data">NYSE/NASDAQ data</Link> |{" "}
         <Link to="/radio">Bloomberg Radio</Link>
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

       <div style={{paddingTop: "2rem"}}>
        <span>
         <button onClick={this.showList}>show list</button>
        </span>
        <span style={{paddingLeft: "1rem"}}>
        <select id="op">
         {renderOptions()}
        </select>
        </span>
       </div>
       <div>
          <span>
         <button onClick={this.showWatchlist}>show watchlist</button>
         </span>

       </div>
       <div>
         <button onClick={this.collectWatchlistData}>
           show watchlist stock data
         </button>
       </div>
       <div>
         <form onSubmit={this.handleSubmit_ticker}>
           <label>
             ticker
             <br />
             <br />
             <input
               type="text"
               id="ticker"
               value={this.state.ticker}
               onChange={this.handleChange_ticker}
             />
             <br /> <br />
           </label>

           <div>
             <input type="submit" value="Add" />
           </div>
           <div>
             <input type="submit" value="Delete" />
           </div>
           <div>
             <input type="submit" value="Search" />
           </div>
         </form>
       </div>
       <div id="lists">hi</div>
     </div>
   );
 }
};
