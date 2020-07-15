//SELECTORS
//Location search functionality
let loc = $(".location");
let icon = $(".icon");
let city_input = $(".city");
let city_err = $(".city_err");
let city_form = $(".city_form");
let match_list = $(".match-list");
let match_cont = $(".match-container");
let location_cont = $(".location_search");
let city_item = $(".city_item");

//locatin display
let location_name = $(".location_name");
let temp = $(".temperature");
let weather_icon = $("#weather_icon");


//GlOBAL Variables
let lat;
let long;
let cities;

//functions
let get_weather = async function(id) {
  //getting the weather data
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=255f04d48c792a5f2d72971cb0f5d0c0`);
  let weather_data = await response.json();

  return weather_data;

}

let find_matches = async function(letter){
  let matches = cities.filter(city => {
    const regx = new RegExp(`^${letter}`, 'gi');
    return city.name.match(regx);
  });

  if(letter.length === 0){
    matches = [];
    match_list.html("");
  }
  else {
    display_matches(matches);
    return matches;
  }
}

let display_matches = function(matches){
  clear_matches();
  if(matches.length > 0){
    if(matches.length < 10){
      matches.forEach((match) => {
        let item = document.createElement("li");
        item.classList = "list-group-item text-primary city_item";
        item.id = match.id;
        item.textContent = match.name;
        match_list.append(item);
      });
    }
    else {
      for(let i = 0; i < 10; i++){
        let item = document.createElement("li");
        item.classList = "list-group-item text-primary city_item";
        item.id = matches[i].id;
        item.textContent = matches[i].name;
        match_list.append(item);
      }
    }
  }
}

let clear_matches = function(){
    let match_children = match_list.children();
    for(let i = 0; i < match_children.length; i++){
      match_children[i].remove();
    }
}

//load event listener
$(document).ready(() => {
  //init

  //Extracing the latitude and longitude values
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
    });
  }

  //hide element
  city_err.hide();

  //Getting city id json data
  fetch("data/city.list.json").then((response) => {
    return response.json();
  }).then((json_data) => {
    cities = json_data;
  }).catch((err) => {
    console.log(err);
  });

});

//city click event w/ event bubbling
//FIXME: only double click triggers this
//FIXME: when clicking on an element --> the changes = permanent, need a toggle feature
match_cont.click(async (e) => {
  if(e.target.classList == "list-group-item text-primary city_item"){
    e.target.classList = "list-group-item bg-primary text-white city_item";

    //Clears the matches once a location has been selected
    setTimeout(clear_matches, 800);

    //dipslay location name
    location_name.text(e.target.textContent);

    let location_id = e.target.id;
    let weather_data = await get_weather(location_id);
    console.log(weather_data);
    let kelvin = weather_data.main.temp;
    let farenheit = Math.floor(((kelvin- 273.15) * (9/5)) + 32);

    let icon_code = weather_data.weather[0].icon;
    let icon_url = "http://openweathermap.org/img/w/" + icon_code + ".png";

    weather_icon.attr("src", icon_url);

    temp.text(farenheit);
  }
  else {
    console.log("not working");
  }
});

//input event listener
city_input.on("change keyup paste ", (e) => {
  let letter = e.target.value;
  find_matches(letter);
});
