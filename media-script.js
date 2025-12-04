"use strict";

// function for our list view
async function getAllRecords() {
  let getResultElement = document.getElementById("journalist");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patDNAGwtRJOI3ipa.69cc3be3d571e5d390a56783b32ecc586d1cb742242e5b07d3ecd961bb28afc2`,
    },
  };

  await fetch(
    `https://api.airtable.com/v0/appkTpCpn0RGf4pQE/table%201?maxRecords=3&view=Grid%20view`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // response is an object w/ .records array
      getResultElement.innerHTML = ""; // clear brews

      let newHtml = "";

      for (let i = 0; i < data.records.length; i++) {
        let Photo = data.records[i].fields["Photo"]; // here we are getting column values
        let Name = data.records[i].fields["Name"]; //here we are using the Field ID to fecth the name property
        let politicalLeanings = data.records[i].fields["politicalLeanings"];

        newHtml += `
        
         <div class="col-xl-4 cardImageText">
          <div class="card list move border-dark mb-5" style="width: 20rem;">
          <a href="index.html?id=${data.records[i].id}">${
          photo
            ? `<img class="card-img-top rounded" alt="${name}" src="${Photo[0].url}">`
            : ``
        }
          </a>
          <p hidden class="card-key">${politicalLeanings}</p>
          </div>
          </div>
        </div>
    
        
        `;
      }

      getResultElement.innerHTML = newHtml;
    });
}

// look up window.location.search and split, so this would take
// https://dmspr2021-airtable-app.glitch.me/index.html?id=receHhOzntTGZ44I5
// and look at the ?id=receHhOzntTGZ44I5 part, then split that into an array
// ["?id=", "receHhOzntTGZ44I5"] and then we only choose the second one
let idParams = window.location.search.split("?id=");
if (idParams.length >= 2) {
  getOneRecord(idParams[1]); // create detail view HTML w/ our id
} else {
  getAllRecords(); // no id given, fetch summaries
}
// function for our detail view
async function getOneRecord(id) {
  let jobsResultElement = document.getElementById("brews");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer pateG7pBF1CkfmcW7.2c666498dc7818660958fea1c0bb95e5e1d33bbdb4871fed8ee5696394e05ce5`,
    },
  };

  await fetch(
    `https://api.airtable.com/v0/app4d1fvvjII8WH8W/Breweries/${id}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // response is a single object

      let picture = data.fields["Picture"];
      let name = data.fields["Name"];
      let address = data.fields["Address"];
      let zip = data.fields["Zip"];
      let neighborhood = data.fields["Neighborhood"];
      let description = data.fields["Description"];
      let logo = data.fields["Logo"];
      let hours = data.fields["Hours"];
      let happy = data.fields["Happy"];
      

      let newHtml = `
        <div class="card list mb-3">
  <div class="row g-0">
    <div class="col-md-4 d-flex justify-content-center align-items-center">
     ${
       logo
         ? `<img class="img-fluid back ms-4" alt="${name}" src="${logo[0].url}">`
         : ``
     }
    </div>
    <div class="col-md-6 d-flex justify-content-center align-items-center desc">
      <div class="card-body">
        <h5 class="card-title bar">${name}</h5>
        <p class="card-text">${description}</p>
        <p class="card-text"><small>${stars(rating)} (${rating})</small></p>
        <p class="card-text"><small>${address} <br> SF, CA ${zip}</small></p>
        <a href="${map}" target="_blank"><button type="button" class="btn btn-primary btn-sm">Get Directions</button></a>
      </div>
    </div>
  </div>
</div>

<div class="card list mb-3">
  <div class="row g-0">
    <div class="col-md-4 d-flex justify-content-center ">
    ${
      picture
        ? `<img class="img-fluid front" alt="${name}" src="${picture[0].url}">`
        : ``
    }
       </div>
       <div class="col-md-6 d-flex justify-content-center align-items-center">
       <div class="card-body">
       <div class="card-group hours mx-auto">    
  <div class="card list hours shift">
    <div class="card-body">
      <h4 class="card-title">🕔 Hours</h4>
      <p class="card-text">${formattedString(hours)}</p>
      
    </div>
  </div>
  <div class="card list hours">
    <div class="card-body">
      <h4 class="card-title">😁 🕔 Happy Hours</h4>
      <p class="card-text">${formattedString(happy)}</p>
     
    </div>
  </div>
</div>
<div class="moves">

</div>
</div>
</div>
</div>
</div>
      `;

      jobsResultElement.innerHTML = newHtml;
    });
}