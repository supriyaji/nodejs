const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgval) => {
    let temprature = tempVal.replace( "{%tempval%}", (orgval.main.temp -273.15).toFixed(2));
    temprature = temprature.replace( "{%tempmin%}", (orgval.main.temp_min -273.15).toFixed(2));
    temprature = temprature.replace( "{%tempmax%}", (orgval.main.temp_max -273.15).toFixed(2));
    temprature = temprature.replace( "{%location%}", orgval.name);
    temprature = temprature.replace( "{%country%}", orgval.sys.country);
    temprature = temprature.replace( "{%tempstatus%}", orgval.weather[0].main);
    return temprature;
    };

const server = http.createServer((req, res) => {
    if(req.url =="/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=ddd055515cf1c4e4410ff84869d671f7")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
           // console.log(arrData[0].main.temp);
           const realTimeData = arrData.map((val) =>  replaceVal(homeFile, val)).join("");
           res.write(realTimeData);
          console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to error", err);
            res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");