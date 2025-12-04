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
