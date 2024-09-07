document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayCharacters();
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document
    .getElementById("favoritesButton")
    .addEventListener("click", displayFavorites);
  document
    .getElementById("searchInput")
    .addEventListener("input", searchCharacter);
});

function toggleTheme() {
  if (document.body.classList.contains("light-mode")) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  }
}

async function fetchAndDisplayCharacters() {
  const response = await fetch("https://rickandmortyapi.com/api/character/");
  const data = await response.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.results.forEach((character) => {
    const characterCard = `
            <div class="bg-gray-800 p-4 rounded-md shadow-md mb-4">
                <img src="${character.image}" alt="${character.name}" class="w-full h-64 object-cover rounded-md mb-4">
                <h3 class="text-xl font-bold text-white">${character.name}</h3>
                <p class="text-white">Species: ${character.species}</p>
                <p class="text-white">Status: ${character.status}</p>
                <button onclick="addToFavorites(${character.id}, '${character.name}', '${character.image}')" class="mt-4 bg-green-500 text-white p-2 rounded-md">Add to Favorites</button>
                <button onclick="showDetails(${character.id})" class="mt-2 bg-blue-500 text-white p-2 rounded-md">View Details</button>
            </div>
        `;
    results.innerHTML += characterCard;
  });
}

async function searchCharacter() {
  const query = document.getElementById("searchInput").value;
  if (!query) {
    fetchAndDisplayCharacters();
    return;
  }
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${query}`
  );
  const data = await response.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  if (data.results) {
    data.results.forEach((character) => {
      const characterCard = `
                <div class="bg-gray-800 p-4 rounded-md shadow-md mb-4">
                    <img src="${character.image}" alt="${character.name}" class="w-full h-64 object-cover rounded-md mb-4">
                    <h3 class="text-xl font-bold text-white">${character.name}</h3>
                    <p class="text-white">Species: ${character.species}</p>
                    <p class="text-white">Status: ${character.status}</p>
                    <button onclick="addToFavorites(${character.id}, '${character.name}', '${character.image}')" class="mt-4 bg-green-500 text-white p-2 rounded-md">Add to Favorites</button>
                    <button onclick="showDetails(${character.id})" class="mt-2 bg-blue-500 text-white p-2 rounded-md">View Details</button>
                </div>
            `;
      results.innerHTML += characterCard;
    });
  } else {
    results.innerHTML = `<p class="text-center text-red-500">No characters found.</p>`;
  }
}

function addToFavorites(id, name, image) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.some((fav) => fav.id === id)) {
    favorites.push({ id, name, image });
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } else {
    alert("This character is already in your favorites.");
  }
}

function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesSection = document.getElementById("favorites");
  const resultsSection = document.getElementById("results");

  resultsSection.classList.toggle("hidden");
  favoritesSection.classList.toggle("hidden");

  favoritesSection.innerHTML = ""; // Clear previous favorites

  if (favorites.length > 0) {
    favoritesSection.innerHTML +=
      '<button onclick="clearFavorites()" class="bg-red-500 text-white p-2 rounded-md mb-4">Clear Favorites</button>';
  }

  favorites.forEach((favorite) => {
    const favoriteCard = `
            <div class="bg-gray-800 p-4 rounded-md shadow-md mb-4 w-1/2 flex-col h-full">
                <img src="${favorite.image}" alt="${favorite.name}" class="w-full h-64 object-cover rounded-md mb-4">
                <h3 class="text-xl font-bold text-white">${favorite.name}</h3>
                <button onclick="removeFromFavorites(${favorite.id})" class="mt-4 bg-red-500 text-white p-2 rounded-md">Remove</button>
            </div>
        `;
    favoritesSection.innerHTML += favoriteCard;
  });
}

function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter((favorite) => favorite.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  displayFavorites();
}

function clearFavorites() {
  if (confirm("Are you sure you want to clear all favorites?")) {
    localStorage.removeItem("favorites");
    displayFavorites();
  }
}

async function showDetails(id) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`
  );
  const character = await response.json();

  const details = `
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
            <div class="bg-gray-800 p-6 rounded-md max-w-md w-full">
                <img src="${character.image}" alt="${character.name}" class="w-full h-64 object-cover rounded-md mb-4">
                <h3 class="text-2xl font-bold text-white">${character.name}</h3>
                <p class="text-white"><strong>Species:</strong> ${character.species}</p>
                <p class="text-white"><strong>Status:</strong> ${character.status}</p>
                <p class="text-white"><strong>Gender:</strong> ${character.gender}</p>
                <p class="text-white"><strong>Origin:</strong> ${character.origin.name}</p>
                <p class="text-white"><strong>Location:</strong> ${character.location.name}</p>
                <button onclick="closeDetails()" class="mt-4 bg-red-500 text-white p-2 rounded-md">Close</button>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", details);
}

function closeDetails() {
  const details = document.querySelector(".fixed");
  if (details) {
    details.remove();
  }
}
