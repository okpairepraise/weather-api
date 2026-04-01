"use strict";

const dates = document.querySelector(".date");
const hrss = document.querySelector(".hrs");
const mins = document.querySelector(".min");
const secs = document.querySelector(".sec");
const sup = document.querySelector("sup");
const sub = document.querySelector("sub");

function updateTime() {
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDay();
  const sec = today.getSeconds();
  const date = today.getDate();
  const month = today.getMonth();
  const min = today.getMinutes();
  const millsec = today.getMilliseconds();
  let hrs = today.getHours();

  if (hrs >= 12) {
    sub.textContent = "pm";
  } else {
    sub.textContent = "Am";
  }

  let dayText;
  switch (day) {
    case 0:
      dayText = "Sunday";
      break;
    case 1:
      dayText = "Monday";
      break;
    case 2:
      dayText = "Tueday";
      break;
    case 3:
      dayText = "Wednesday";
      break;
    case 4:
      dayText = "Thursday";
      break;
    case 5:
      dayText = "Friday";
      break;
    case 6:
      dayText = "saturday";
      break;

    default:
      dayText = "invalid day";
  }

  if (hrs > 12) {
    hrs -= 12;
  } else {
    hrs;
  }

  function addLeadingZero(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  let monthText;
  switch (month) {
    case 0:
      monthText = "January";
      break;
    case 1:
      monthText = "Febuary";
      break;
    case 2:
      monthText = "March";
      break;
    case 3:
      monthText = "April";
      break;
    case 4:
      monthText = "May";
      break;
    case 5:
      monthText = "June";
      break;
    case 6:
      monthText = "july";
      break;
    case 7:
      monthText = "August";
      break;
    case 8:
      monthText = "September";
      break;
    case 9:
      monthText = "October";
      break;
    case 10:
      monthText = "November";
      break;
    case 11:
      monthText = "Decemberly";
      break;

    default:
      monthText = "invalid day";
  }

  mins.textContent = addLeadingZero(min) + " " + ":";
  hrss.textContent = addLeadingZero(hrs) + " " + ":";
  secs.textContent = addLeadingZero(sec);
  dates.textContent =
    dayText + " " + date + "th" + " " + monthText + " " + year;
}

setInterval(updateTime, 10);

const input = document.querySelector("#input1");
const video = document.querySelector("#myvideo");
const form = document.querySelector("form");
const button = document.querySelector("button");
const text2 = document.querySelector(".text2");
const text = document.querySelector(".text");
const wind = document.querySelector(".text10");
const winds = document.querySelector(".text11");
const see = document.querySelector(".text12");
const generals4 = document.querySelector(".generals44");
const sees = document.querySelector(".text99");
const humidity = document.querySelector(".text15");
const population = document.querySelector(".population2");
const weatherCode = document.querySelector("img");
const another1 = document.querySelector(".another1");
console.log(text);

let mykey = `3380e100b9816885586981a7d02f6349`;
// console.log(weatherCode);

const apiUrl =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&q={city name}&limit=5&appid={mykey}";

const getWeather = function (city) {
  another1.classList.add("active");

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&limit=5&appid=${mykey}&units=metric`
  )
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        throw new Error("Error while fetching weather data");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      text.textContent = data.city.name;
      text2.textContent = data.list[0].main.temp;
      humidity.textContent = data.list[0].main.humidity + " " + "kg";
      population.textContent = data.city.population + " " + "people";
      winds.textContent = data.list[0].wind.speed + " " + "mph";
      wind.textContent = data.list[0].weather[0].description;
      see.textContent = data.list[0].main.temp_max + " " + "℃";
      weatherCode.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
      console.log(see);
      input.value = "";
      generals4.classList.add("active");
    })
    .catch((err) => {
      console.error("Error:", err);
      alert(err);
    })
    .finally(() => {
      another1.classList.remove("active");
    });
};

button.addEventListener("click", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  getWeather(value);
  sees.classList.add("active");
});
