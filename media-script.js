"use strict";

// --- CONFIGURATION ---
const API_KEY =
  "pateG7pBF1CkfmcW7.2c666498dc7818660958fea1c0bb95e5e1d33bbdb4871fed8ee5696394e05ce5";
const BASE_ID = "appkTpCpn0RGf4pQE";
const TABLE_NAME = "table%201";

// 1. MAIN FUNCTION: Fetch and Create Profile Cards
async function getAllRecords() {
  // CHANGED: Instead of 7 columns, we get one main container
  const container = document.getElementById("profiles-container");

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${API_KEY}` },
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=Grid%20view`,
      options
    );

    if (!response.ok) throw new Error("Airtable fetch failed");
    const data = await response.json();

    // Clear the container
    container.innerHTML = "";

    for (let i = 0; i < data.records.length; i++) {
      let record = data.records[i];
      let fields = record.fields;

      let name = fields["name"] || "Unnamed";
      let leaning = fields["politicalLeanings"] || "Center";
      let mediumTitle = fields["mediumTitle"] || "";
      let photoUrl = fields["photo"]
        ? fields["photo"][0].url
        : "https://via.placeholder.com/300"; // Increased placeholder size for cards

      // --- NEW PROFILE CARD LAYOUT ---
      // We removed the logic that sorted by 'targetIndex'.
      // Now we create a responsive card for every record.
      let cardHtml = `
        <div class="col-12 col-md-6 col-lg-4 mb-4 cardImageText">
            <div class="card h-100 shadow-sm">
                <img src="${photoUrl}" class="card-img-top" alt="${name}" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${name}</h5>
                    <p class="card-subtitle text-muted mb-2">${mediumTitle}</p>
                    <span class="badge bg-dark mb-3 align-self-start">${leaning}</span>
                    <a href="index.html?id=${record.id}" class="btn btn-outline-dark mt-auto stretched-link">View Profile</a>
                    
                    <p class="card-key d-none">${name} ${leaning} ${mediumTitle}</p>
                </div>
            </div>
        </div>
      `;

      // Append directly to the main container
      container.innerHTML += cardHtml;
    }
  } catch (error) {
    console.error(error);
  }
}

// 2. DROPDOWN MENU FUNCTION
async function dropdown() {
  let dropdownMenu = document.getElementById("menu");
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

    dropdownMenu.innerHTML = "";
    let menuHtml = "";

    for (let i = 0; i < data.records.length; i++) {
      let name = data.records[i].fields["name"];
      menuHtml += `<li><a class="dropdown-item" href="index.html?id=${data.records[i].id}">${name}</a></li>`;
    }
    dropdownMenu.innerHTML = menuHtml;
  } catch (error) {
    console.error(error);
  }
}

// 3. SEARCH FUNCTION
function searchFunction() {
  let input, filter, cards, i, key;
  input = document.getElementById("myinput");
  filter = input.value.toUpperCase();
  // targets the wrapper div created in getAllRecords
  cards = document.getElementsByClassName("cardImageText");

  for (i = 0; i < cards.length; i++) {
    key = cards[i].getElementsByClassName("card-key")[0];
    if (key) {
      if (key.innerHTML.toUpperCase().indexOf(filter) > -1) {
        // Revert to default behaviour (block/flex based on bootstrap)
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }
}

// 4. UTILITY
function formattedString(value) {
  if (!value) return "";
  return value
    .split(",")
    .map((item) => `<li>${item.trim()}</li>`)
    .join("");
}

// 5. DETAIL VIEW FUNCTION
async function getOneRecord(id) {
  // Hide Landing, Show Detail
  let landing = document.getElementById("landing-view");
  let detail = document.getElementById("detail-view");

  if (landing) landing.style.display = "none";
  if (detail) detail.style.display = "block";

  const detailContainer = document.getElementById("detail-content");

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${API_KEY}` },
  };

  await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${id}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      let fields = data.fields;
      let name = fields["name"];
      let photoUrl = fields["photo"]
        ? fields["photo"][0].url
        : "https://via.placeholder.com/300";
      let leaning = fields["politicalLeanings"];
      let description = fields["description"] || "No bio available.";
      let mediumTitle = fields["mediumTitle"] || "";
      let primaryBeat = fields["primaryBeat"] || "General";
      let mediaForm = fields["mediaForm"] || "Journalism";
      let pastWork = fields["pastWorkExperience"] || "";
      let streaming = fields["streamingPlatforms"] || "";

      let html = `
        <div class="card shadow-lg border-0 rounded-0">
          <div class="row g-0">
            <div class="col-md-4 bg-light text-center p-4 border-end">
                <img src="${photoUrl}" class="img-fluid rounded-circle border border-dark p-1 mb-4" alt="${name}">
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
                <h1 class="font-headline display-4 fw-bold mb-2">${name}</h1>
                <h4 class="font-body text-muted fst-italic mb-4">${mediumTitle}</h4>
                <div class="font-body fs-5 lh-lg mb-5">${description}</div>
                <div class="card bg-light border-0 p-3">
                    <h5 class="font-headline fw-bold">Past Work Experience</h5>
                    <ul>${formattedString(pastWork)}</ul>
                </div>
                <div class="mt-4">
                    <a href="index.html" class="btn btn-outline-dark">Back to List</a>
                </div>
            </div>
          </div>
        </div>
      `;
      detailContainer.innerHTML = html;
    });
}

// 6. ROUTER
let idParams = window.location.search.split("?id=");
if (idParams.length >= 2) {
  dropdown();
  getOneRecord(idParams[1]);
} else {
  dropdown();
  getAllRecords();
}
