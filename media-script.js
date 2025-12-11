"use strict";

// --- CONFIGURATION ---

// 1. YOUR API KEY
const API_KEY =
  "patDNAGwtRJOI3ipa.69cc3be3d571e5d390a56783b32ecc586d1cb742242e5b07d3ecd961bb28afc2";

// 2. YOUR BASE ID
const BASE_ID = "appkTpCpn0RGf4pQE";

// 3. YOUR TABLE NAME
const TABLE_NAME = "table%201";

// 1. MAIN FUNCTION: Fetch and Create List View
async function getAllRecords() {
  let container = document.getElementById("profiles-container");

  // Safety check
  if (!container) {
    console.error(
      "ERROR: Cannot find <div id='profiles-container'> in your HTML."
    );
    return;
  }

  const options = {
    method: "GET",
    headers: {
      // FIX: Use the variable, do not hardcode the string here
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=Grid%20view`,
      options
    );

    if (!response.ok) throw new Error(`Airtable Error: ${response.status}`);

    const data = await response.json();
    console.log("Records Found:", data.records.length);

    container.innerHTML = "";
    let newHtml = "";

    for (let i = 0; i < data.records.length; i++) {
      let record = data.records[i];
      let fields = record.fields;

      // Defensive Data Pulling
      let name = fields["name"] || fields["Name"] || "No Name";
      let leaning =
        fields["politicalLeanings"] ||
        fields["Political Leanings"] ||
        "Unspecified";
      let mediumTitle = fields["mediumTitle"] || fields["Medium Title"] || "";

      let photoField =
        fields["photo"] || fields["Photo"] || fields["Attachments"];
      let photoUrl = photoField
        ? photoField[0].url
        : "https://via.placeholder.com/400x300?text=No+Image";

      newHtml += `
      <div class="col-12 col-md-6 col-lg-4 mb-4 cardImageText">
          <div class="card h-100 shadow-sm border-0">
              <div style="height: 240px; overflow: hidden;">
                 <a href="index.html?id=${record.id}">
                  <img src="${photoUrl}" class="card-img-top w-100 h-100" style="object-fit: cover;" alt="${name}">
                 </a>
              </div>
              
              <div class="card-body d-flex flex-column">
                  <span class="badge bg-secondary mb-2 align-self-start">${leaning}</span>
                  <h5 class="card-title fw-bold text-dark">${name}</h5>
                  <p class="card-text text-muted fst-italic">${mediumTitle}</p>
                  
                  <a href="index.html?id=${record.id}" class="btn btn-dark mt-auto stretched-link">View Full Profile</a>
                  
                  <p hidden class="card-key">${name} ${leaning} ${mediumTitle}</p>
              </div>
          </div>
      </div>
      `;
    }

    container.innerHTML = newHtml;
  } catch (error) {
    console.error(error);
  }
}

// 2. UTILITY FUNCTIONS

function formattedString(value) {
  if (!value) return "None listed";
  return value
    .split(",")
    .map((item) => `<li>${item.trim()}</li>`)
    .join("");
}

function myFunction() {
  let x = document.getElementById("myinput");
  if (x) {
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
}

function myNeighborhood(x) {
  let n = document.getElementById("myinput");
  if (n && x.matches) {
    n.style.display = "none";
  }
}

// Media Query Setup
var x = window.matchMedia("(max-width: 1100px)");
x.addEventListener("change", function () {
  myNeighborhood(x);
});

// 3. DROPDOWN MENU FUNCTION
async function dropdown() {
  let dropdownElement = document.getElementById("menu");
  if (!dropdownElement) return;

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${API_KEY}` },
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=Grid%20view`,
      options
    );
    const data = await response.json();

    dropdownElement.innerHTML = "";
    let otherHtml = "";

    for (let i = 0; i < data.records.length; i++) {
      let name =
        data.records[i].fields["name"] || data.records[i].fields["Name"];
      otherHtml += `<li><a class="dropdown-item" href="index.html?id=${data.records[i].id}">${name}</a></li>`;
    }
    dropdownElement.innerHTML = otherHtml;
  } catch (error) {
    console.error("Dropdown Error:", error);
  }
}

// 4. DETAIL VIEW FUNCTION
async function getOneRecord(id) {
  const landing = document.getElementById("landing-view");
  const detail = document.getElementById("detail-view");
  const detailContent = document.getElementById("detail-content");

  if (landing) landing.style.display = "none";
  if (detail) detail.style.display = "block";

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${API_KEY}` },
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${id}`,
      options
    );
    const data = await response.json();
    console.log("Detail Data:", data);

    let fields = data.fields;

    // Defensive Mapping
    let name = fields["name"] || fields["Name"] || "Unnamed";
    let photoField =
      fields["photo"] || fields["Photo"] || fields["Attachments"];
    let photoUrl = photoField
      ? photoField[0].url
      : "https://via.placeholder.com/400";
    let leaning =
      fields["politicalLeanings"] || fields["Political Leanings"] || "N/A";
    let description =
      fields["description"] ||
      fields["Description"] ||
      "No biography available.";
    let mediumTitle = fields["mediumTitle"] || fields["Medium Title"] || "";
    let primaryBeat =
      fields["primaryBeat"] || fields["Primary Beat"] || "General";
    let mediaForm = fields["mediaForm"] || fields["Media Form"] || "Journalism";
    let pastWork = fields["pastWorkExperience"] || fields["Past Work"] || "";
    let streaming = fields["streamingPlatforms"] || fields["Streaming"] || "";

    let newHtml = `
          <div class="card shadow-lg border-0 rounded-0 mt-5">
            <div class="row g-0">
              <div class="col-md-4 bg-light text-center p-4 border-end">
                  <img src="${photoUrl}" class="img-fluid rounded-circle border border-dark p-1 mb-4" style="width: 200px; height: 200px; object-fit: cover;" alt="${name}">
                  <ul class="list-group list-group-flush text-start">
                      <li class="list-group-item bg-light"><strong>Beat:</strong> ${primaryBeat}</li>
                      <li class="list-group-item bg-light"><strong>Format:</strong> ${mediaForm}</li>
                      <li class="list-group-item bg-light"><strong>Streaming:</strong> <ul>${formattedString(
                        streaming
                      )}</ul></li>
                  </ul>
              </div>
              <div class="col-md-8 p-5">
                  <span class="badge bg-dark rounded-0 mb-3 text-uppercase">${leaning}</span>
                  <h1 class="display-4 fw-bold mb-2">${name}</h1>
                  <h4 class="text-muted fst-italic mb-4">${mediumTitle}</h4>
                  <div class="fs-5 lh-lg mb-5">${description}</div>
                  
                  <div class="card bg-light border-0 p-3 mb-4">
                      <h5 class="fw-bold">Past Work Experience</h5>
                      <ul>${formattedString(pastWork)}</ul>
                  </div>
                  
                  <a href="index.html" class="btn btn-outline-dark">Back to List</a>
              </div>
            </div>
          </div>
    `;

    if (detailContent) detailContent.innerHTML = newHtml;
  } catch (error) {
    console.error("Detail Fetch Error:", error);
  }
}

// 5. SEARCH FUNCTION
function searchFunction() {
  let input, filter, cardimagetext, i, key;

  input = document.getElementById("myinput");
  if (!input) return;

  filter = input.value.toUpperCase();
  cardimagetext = document.getElementsByClassName("cardImageText");

  for (let x = 0; x < cardimagetext.length; x++) {
    key = cardimagetext[x].querySelector(".card-key");
    if (key) {
      if (key.innerHTML.toUpperCase().indexOf(filter) > -1) {
        cardimagetext[x].style.display = "";
      } else {
        cardimagetext[x].style.display = "none";
      }
    }
  }
}

// 6. ROUTER
let idParams = window.location.search.split("?id=");

if (idParams.length >= 2) {
  myFunction(); // Hide search bar on detail view
  dropdown();
  getOneRecord(idParams[1]);
} else {
  myNeighborhood(x); // Check mobile state
  dropdown();
  getAllRecords();
}
