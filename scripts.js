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

    if(sunValue && waterValue && petsValue) {
        const url = `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sunValue}&water=${waterValue}&pets=${petsValue}`;
        const listPlants = document.getElementById('content_plants');
        const noResults = document.getElementById('no_results');

        loadingActive(divLoadText, textLoad);

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                if(jsonResponse.status != 404) {
                    removeLoadingActive(divLoadText);

                    listPlants.classList.add("ativo");
                    noResults.classList.remove("ativo");
                    
                    document.querySelectorAll('.box').forEach(item => {
                        item.remove();
                    });

                    jsonResponse.forEach(showResults);
                } else {
                    listPlants.classList.remove("ativo");
                    noResults.classList.add("ativo");
                }
            });
    } 
}

function showResults(response) {
    const mostraPlantas = document.getElementById('list_plants');

    mostraPlantas.innerHTML += `
        <div class='box ${response.staff_favorite}-staff'>
            <img src='${response.url}'/>

            <div class="txt">
                <h3>${response.name}</h3>
                <h4>$${response.price}</h4>

                <div class="icons">
                    <div><img src="assets/images/icons/${response.sun}-sun.svg"></div>
                    <div><img src="assets/images/icons/${response.water}-water.svg"></div>
                    <div><img src="assets/images/icons/${response.toxicity}-toxic.svg"></div> 
                </div><!--icons-->
            </div><!--txt-->
        </div>
    `;
}

/*LIST PLANTS*/
document.querySelectorAll('.request').forEach(item => {
    item.addEventListener('change', loadPlants);
});

/*SCROL TOP*/
function scrollWin() {
    window.scrollTo(0, 500);
  }
  