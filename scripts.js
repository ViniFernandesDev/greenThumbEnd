const loader = document.getElementById("loading");

let divLoadText = document.getElementById("textLoading");
let textLoad = "Demora no carregamento, tente recarregar a página";

function loadingActive(divLoadText, textLoad) {
    loader.classList.add("ativo");

    setTimeout(() => {
        divLoadText.textContent = textLoad;
    }, "10000")
}

function removeLoadingActive(textLoad) {
    loader.classList.remove("ativo");

    setTimeout(() => {
        divLoadText.textContent = "";
    }, "0")
}

function loadPlants() {
    const sun = document.getElementById('sun');
    const sunValue = sun.options[sun.selectedIndex].value;

    const water = document.getElementById('water');
    const waterValue = water.options[water.selectedIndex].value;

    const pets = document.getElementById('pets');
    const petsValue = pets.options[pets.selectedIndex].value;

    if (sunValue && waterValue && petsValue) {
        const url = `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sunValue}&water=${waterValue}&pets=${petsValue}`;
        const listPlants = document.getElementById('content_plants');
        const noResults = document.getElementById('no_results');

        loadingActive(divLoadText, textLoad);

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                if (jsonResponse.status != 404) {
                    removeLoadingActive(divLoadText);

                    listPlants.classList.add("ativo");
                    noResults.classList.remove("ativo");

                    document.querySelectorAll('.box').forEach(item => {
                        item.remove();
                    });

                    jsonResponse.forEach(showResults);
                    addFavoriteCard();
                } else {
                    listPlants.classList.remove("ativo");
                    noResults.classList.add("ativo");
                }
            });
    }
}

function showResults(response) {
    const mostraPlantas = document.getElementById('list_plants');
    const plant = JSON.stringify(response);

    mostraPlantas.innerHTML += `
        <div class='box ${response.staff_favorite}-staff'>
            <img src='${response.url}'/>

            <div class="txt">
                <h3>${response.name}</h3>
                <h4>$${response.price}</h4>
                <a class="favorited" id="${response.id}" onclick='favoritePlant(${plant})'></a>

                <div class="icons">
                    <div><img src="assets/images/icons/${response.sun}-sun.svg"></div>
                    <div><img src="assets/images/icons/${response.water}-water.svg"></div>
                    <div><img src="assets/images/icons/${response.toxicity}-toxic.svg"></div> 
                </div><!--icons-->
            </div><!--txt-->
        </div>
    `;
    validationFavorites(response.id);
}

/*LIST PLANTS*/
document.querySelectorAll('.request').forEach(item => {
    item.addEventListener('change', loadPlants);
});

/*SCROL TOP*/
function scrollWin() {
    window.scrollTo(0, 500);
}

// Function for add plant favorite
const favoritePlant = (favorite) => {
    const id = favorite.id;
    let favorites = [];

    favorites.push(favorite);
    favorites = getLocalStorage(favorites, id);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    validationFavorites(id);
    addFavoriteCard();
}

// Get all plans save in local storage
const getLocalStorage = (favorites, id) => {
    const saveLocal = JSON.parse(localStorage.getItem('favorites'));

    if (saveLocal) {
        saveLocal.forEach(plant => {
            validationDelete(favorites, plant, id);
            addFavoriteCard();
        })
    }
    return favorites;
}

// Validation for delete duplicates
const validationDelete = (favorites, plant, id) => {
    if (id == plant.id) {
        favorites.splice(plant, 1);
        selectFavorite(id, 'remove');
        return;
    }
    favorites.push(plant);
}

// Validation itens favoriteds
const validationFavorites = (id) => {
    const favorites = JSON.parse(localStorage.getItem('favorites'));

    if (favorites) {
        favorites.forEach(plant => {
            if (id == plant.id) {
                selectFavorite(id);
            }
        })
    }
}

// Select this favorite
const selectFavorite = (id, type) => {
    const e = document.querySelectorAll('a.favorited');

    e.forEach(item => {
        if (id == item.id) {
            if (type) {
                item.classList.remove('--active');
                return;
            }
            item.classList.add('--active');
        }
    })
}

// Add favorites in the cards
const addFavoriteCard = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    let html = document.getElementById('list_plants_favorite');
    html.innerHTML = '';

    favorites.forEach(plant => {
        htmlCardFavorite(plant);
    })

    html.innerHTML += `<a onclick="closeCart();event.stopPropagation()">X</a>`;
}

// Create html of the cards favorites
const htmlCardFavorite = (plant) => {
    let htmlAllFavorites = document.getElementById('list_plants_favorite');

    htmlAllFavorites.innerHTML += `
        <div class="favorite">
            <img src="${plant.url}" alt="">

            <div class="txt">
                <h5>${plant.name}</h5>
                <h6>${plant.price}</h6>
                <a class="favorited --active" id="${plant.id}" onclick='favoritePlant(${JSON.stringify(plant)})'></a>

                <div class="icons">
                    <div><img src="assets/images/icons/${plant.sun}-sun.svg"></div>
                    <div><img src="assets/images/icons/${plant.water}-water.svg"></div>
                    <div><img src="assets/images/icons/${plant.toxicity}-toxic.svg"></div>
                </div><!--icons-->
            </div><!--txt-->
        </div>
    `;
};

// Active or Close informations of favorites
const openCart = () => {
    const list = document.getElementById('list_plants_favorite');

    if (!list.classList.contains("--active")) {
        list.classList.add('--active');
        return;
    }
}

// Close informations of favorites
const closeCart = () => {
    const list = document.getElementById('list_plants_favorite');

    list.classList.remove('--active');
}


// Initialized cart favorites
addFavoriteCard();