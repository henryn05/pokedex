let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // Function to add a Pokémon to the list
  function add(pokemon) {
    if (typeof pokemon === "object") {
      pokemonList.push(pokemon);
    } else {
      console.error("Error: Invalid data type. Only objects allowed");
    }
  }

  // Function to get all Pokémon
  function getAll() {
    return pokemonList;
  }

  // Function to create a list item for a Pokémon
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemonList");
    let listItem = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("nameButtons", "list-group-item");
    button.classList.add("btn", "btn-primary");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");

    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
  }

  // Function to show a loading message
  function showLoadingMessage() {
    let loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "block";
  }

  // Function to hide the loading message
  function hideLoadingMessage() {
    let loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "none";
  }

  // Function to load details for a Pokémon
  function loadDetails(item) {
    showLoadingMessage();
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        hideLoadingMessage();
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types.map(function (typeData) {
          return typeData.type.name;
        });
      })
      .catch(function (e) {
        hideLoadingMessage();
        console.error(e);
      });
  }

  // Function to load a list of Pokémon
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        hideLoadingMessage();
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name.charAt(0).toUpperCase() + item.name.slice(1), // Capitalize the first letter
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadingMessage();
        console.error(e);
      });
  }

  // Function to show details of a Pokémon
  function showDetails(pokemon) {
    if (typeof pokemon.height === "undefined") {
      loadDetails(pokemon).then(function () {
        displayPokemonDetails(pokemon);
      });
    } else {
      displayPokemonDetails(pokemon);
    }
  }

  // Function to display Pokémon details in a modal
  function displayPokemonDetails(pokemon) {
    let modalTitle = document.querySelector(".modal-title");
    let modalBody = document.querySelector(".modal-body");

    let types = pokemon.types.map(function (type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    });

    modalTitle.innerHTML = `<p>${pokemon.name}</p>`;
    modalBody.innerHTML = `<p class="height">Height: ${
      pokemon.height
    }m</p><p class="type">Type: ${types.join(", ")}</p> <img src="${
      pokemon.imageUrl
    }" alt="${pokemon.name} class="image">`;

  }

  // Function to set up the search functionality
  function setupSearch() {
    let searchInput = document.getElementById("searchInput");
    let pokemonList = document.querySelectorAll(".list-group-item");

    searchInput.addEventListener("input", function () {
      let searchQuery = searchInput.value.toLowerCase();

      pokemonList.forEach(function (pokemonItem) {
        let pokemonName = pokemonItem.innerText.toLowerCase();

        if (pokemonName.startsWith(searchQuery)) {
          pokemonItem.style.display = "block";
        } else {
          pokemonItem.style.display = "none";
        }
      });
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showLoadingMessage: showLoadingMessage,
    hideLoadingMessage: hideLoadingMessage,
    setupSearch: setupSearch,
  };
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
  pokemonRepository.setupSearch();
});
