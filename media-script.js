"use strict";

// function for our list view
async function getAllRecords() {
  let getResultElement = document.getElementById("");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer patDNAGwtRJOI3ipa.65e03f8442dd5cf1eb199f39fdc72bdf66deb576bda9122b28789404e48daf0e`,
    },
  };

  await fetch(
    `https://api.airtable.com/v0/appIK32rbSA95DL2I/Table%201?maxRecords=3&view=Grid%20view`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // response is an object w/ .records array
    });
}

getAllRecords();
