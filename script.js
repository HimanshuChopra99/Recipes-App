async function getRandomMeal(){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await response.json();
    const meal = respData.meals[0];
    addRandomMeal(meal);
}

const randomFood = document.querySelector(".randomFood-container");
const favFoodContainer = document.querySelector(".favouriteFood-wrapper");
const mealInfoEl = document.querySelector(".meal-info");

//create and add random meals
function addRandomMeal(meal){
    const randomMeal = document.createElement("div");
    randomMeal.classList.add("randomFood");
    randomMeal.id = meal.idMeal;
    randomMeal.innerHTML = `
    <div class="randomFoodImg">
        <img src="${meal.strMealThumb}" alt="" loading ="lazy">
    </div>
    <div class="foodInfo">
        <div class="name">${meal.strMeal}</div>
        <div class="likeBtn"><i class="fa-solid fa-heart"></i></div>
    </div>`;

    randomFood.appendChild(randomMeal);

    randomMeal.addEventListener("click", (e) => {
        if(!e.target.classList.contains("fa-solid")){
            showmealInfo(meal);
        }
    })

    const randomImgContainer = randomMeal.querySelector(".randomFoodImg");
    randomImgContainer.style.cssText = `-webkit-mask-image: url(${meal.strMealThumb}); mask-image: url(${meal.strMealThumb}); mask-repeat: no-repeat;`;

    const likeBtn = randomMeal.querySelector('.likeBtn');
    const foodName = meal.strMeal.length >= 10 ? meal.strMeal.substring(0, 10) + "...": meal.strMeal;

    likeBtn.addEventListener("click", ()=>{
        if(likeBtn.classList.contains("red")){
            likeBtn.classList.remove('red');
            removeFavouriteFood(foodName);
        }else{
            likeBtn.classList.add('red');
            createFavouriteFood(foodName, meal.strMealThumb, likeBtn);
        }
    });
}

//create or add meals to fav container
function createFavouriteFood(foodName, foodImgSrc, likeBtn) {
    const favouriteFood = document.createElement('div');
    favouriteFood.classList.add("favouriteFood");
    favouriteFood.innerHTML = `<img class="foodImg" src="${foodImgSrc}" alt="">
                               <span>${foodName}</span>
                               <i class="fa-solid fa-xmark removeBtn"></i>`;
    favFoodContainer.appendChild(favouriteFood);

    favouriteFood.querySelector('.removeBtn').addEventListener('click', () => {
        favFoodContainer.removeChild(favouriteFood);
        updateFavouriteContainer();
        likeBtn.classList.remove('red');
    });
    updateFavouriteContainer();
}

//remove meals from fav container
function removeFavouriteFood(foodName) {
    const favouriteFoods = favFoodContainer.querySelectorAll('.favouriteFood');
    favouriteFoods.forEach(favFood => {
        if (favFood.querySelector('span').innerText === foodName) {
            favFoodContainer.removeChild(favFood);
            updateFavouriteContainer();
        }
    });
}

//animation of fav container
function updateFavouriteContainer() {
    const favItemCount = favFoodContainer.querySelectorAll('.favouriteFood').length;
    if (favItemCount > 0) {
        favFoodContainer.classList.add('active');
    } else {
        favFoodContainer.classList.remove('active');
    }
}

//6 random meals 
for(let i= 1; i<=6; i++){
    getRandomMeal();
}

//meal by search
async function getMealBySearch(name){
    clearSearchResults();   
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();
    const meal = data.meals;

    if(meal){
        meal.forEach((meal) =>{
            addSearchMeal(meal)
        });
    }else{
        searchMeals.innerHTML = `
        <div class = "errorMsg">
            <span>No results found</span>
        </div>`
    }
}

const searchMeals = document.querySelector(".searchMeals");

// Remove all child elements from searchConainer except the searchRemoveBtn
function clearSearchResults() {
    searchMeals.innerHTML = ""
}

function showSearchResults() {
    searchConainer.style.display = "flex";
}

const searchConainer = document.querySelector(".search-container");
const searchIcon = document.querySelector("#search-icon");

//search meals
searchIcon.addEventListener("click", ()=> {
    const searchInput = document.querySelector(".searchBar");
    const data = searchInput.value
    if (data !== "") {
        showSearchResults()
        getMealBySearch(data)
    } else {
        console.log("Input is empty");
    }
    const searchRemoveBtn = document.querySelector(".searchRemoveBtn");
    searchRemoveBtn.addEventListener("click", ()=>{
        searchConainer.style.display = "none";
        clearSearchResults();
    })
})

//add meals on search
function addSearchMeal(meal){
    const randomMeal = document.createElement("div")
    randomMeal.classList.add("randomFood");
    randomMeal.id = meal.idMeal;
    randomMeal.innerHTML = `
    <div class="randomFoodImg">
        <img src="${meal.strMealThumb}" alt="" loading ="lazy">
    </div>
    <div class="foodInfo">
        <div class="name">${meal.strMeal}</div>
        <div class="likeBtn"><i class="fa-solid fa-heart"></i></div>
    </div>`;
    
    const randomImgContainer = randomMeal.querySelector(".randomFoodImg");
    randomImgContainer.style.cssText = `-webkit-mask-image: url(${meal.strMealThumb}); mask-image: url(${meal.strMealThumb}); mask-repeat: no-repeat;`;

    searchMeals.appendChild(randomMeal);

    randomMeal.addEventListener("click", (e) => {
        if(!e.target.classList.contains("fa-solid")){
            showmealInfo(meal);
        }
    })

    const likeBtn = randomMeal.querySelector(".likeBtn");
    const foodName = meal.strMeal.length >= 10 ? meal.strMeal.substring(0, 10) + "...": meal.strMeal;

    likeBtn.addEventListener("click", () => {
        if(likeBtn.classList.contains("red")){
            likeBtn.classList.remove('red');
            removeFavouriteFood(foodName);
        }else{
            likeBtn.classList.add('red');
            createFavouriteFood(foodName, meal.strMealThumb, likeBtn);
        }
    })
}

//show meal info
function showmealInfo(meal){
    const mealEl = document.createElement("div");

    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() && measure && measure.trim()) {
            ingredientsList.push(`<li>${ingredient} / ${measure}</li>`);
        }
    };

    mealEl.innerHTML =`
    <div>
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="">
    </div>
    <div>
        <p>${meal.strInstructions}</p>
        <ul>
            ${ingredientsList.join('')}
        </ul>
    </div>
    <div class = "mealInfo-links">
        <div class = "sourcesLink">
            <p>Source</p>
            <a href ="${meal.strSource}"><i class="fa-solid fa-link" style="color: #202020;"></i></a>
        </div>
        
        <div class = "ytLink">
            <p>YouTube</p>
            <a href = "${meal.strYoutube}"><i class="fa-brands fa-youtube" style="color: #ff0000;"></i></a>
        </div>
    </div>
    `;

    mealInfoEl.appendChild(mealEl);
    mealInfoContainer.style.display = "flex";
}


const mealInfoContainer = document.querySelector(".meal-info-container");
const mealInfoBtn = document.querySelector("#meal-info-btn");

mealInfoBtn.addEventListener("click", () => {
    mealInfoContainer.style.display = "none";
    mealInfoEl.innerHTML = "";
})