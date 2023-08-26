const homePage = document.querySelector('.home-page');
const mealsPage = document.querySelector('.meals-page');
const recipePage = document.querySelector('.recipe-page');
const recipeVideo = document.querySelector('.recipe-video');



function getAreas() {
    const fetchPromise =fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
      
    fetchPromise
      .then((response) => response.json())
      .then((data) => {
            return data.meals;})
        .then((countriesArray) => {
            
            let countryCards = '';
            let homePageLayout = '';
            let imgUrls = [];
            let finalObject ={};

            homePageLayout = `
            <div class="home-page-container">
            </div>`;  
            homePage.innerHTML =  homePageLayout;
            let homeContainer = document.querySelector('.home-page-container');
            countriesArray.forEach(country => {
            
                fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country.strArea}`)
                .then(response => response.json())
                .then(response => {
                    console.log(response.meals[0].strMealThumb);
                    let card = document.createElement('div');
                    card.classList.add('country-card');
                    let countryCardHtml = `
                        <div class = "areas" onclick="getMeals('${country.strArea}')"  >
                        
                        <img src="${response.meals[0].strMealThumb}" class ="country-img" />
        
                        <div class = "country-name" id= "${country.strArea}"> ${country.strArea} </div>
                        
                        </div>
                    `;
                    card.innerHTML = countryCardHtml;
                    homeContainer.appendChild(card);
                    return response.meals[0].strMealThumb;
                });
                

            });
        });
            

    };


getAreas ();

function getMeals (country) {
  
  
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`)
  .then(response => response.json())
  .then(response => {
      console.log(response.meals[0]);
      homePage.style.display = 'none';

      mealsPage.style.display="flex";

      let mealsPageLayout = '';
      let mealCard = "";

      response.meals.forEach( (meal) => {
         mealCard +=`
         <div class ="meal-card" onclick = "getRecipe('${meal.idMeal}')">

         <img src="${meal.strMealThumb}" class ="meal-img" />
        
         <div class = "meal-name" id= "${meal.idMeal}"> ${meal.strMeal} </div>
         
         </div>
         `
      });
     

      mealsPageLayout = `
      <div class="meals-page-container">
        <div id="arrow-back">
            <span class="material-symbols-outlined">
                arrow_back
            </span>
        </div>

        ${mealCard}
      </div>`;  


      mealsPage.innerHTML =  mealsPageLayout;
      document.getElementById('arrow-back').addEventListener('click', function () {
        
        mealsPage.style.display = 'none';
        homePage.style.display = "flex";
      });


  })    
}

function getRecipe (recipe) {
    homePage.style.display = 'none';

    mealsPage.style.display="none";

    recipePage.style.display="flex";

    

    const fetchRecipe = fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`);
                            
    fetchRecipe
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        
        let ingredientArr = [];
        let measureArr = [];
        
        response.meals.forEach((item) => {

            for(let key in item) {
                if(key.includes('Ingredient') &&  item[key] !== '' ){
                    ingredientArr.push(item[key]);
                }
                if (key.includes('Measure') && item[key] !== ''){
                    measureArr.push(item[key]);
                }

            }

            const mealInstructions = item.strInstructions.split('. ');

            let instructionObj = '';
            mealInstructions.forEach((item) => {
                instructionObj += `
                <div class = "instructions"> ${item} </div>

            `;
            });
            let ingredientObj ='';
            ingredientArr.forEach ((item) => {
                
                if (item !== null){
                    ingredientObj +=`
                <div class = "ingredient">${item}</div>
                `;
                }

            });
            let measureObj = '';
            measureArr.forEach((item) =>{
             
             if (item !== null){
                measureObj +=`
             <div class = "measurements">${item}</div>
             `;
             }
            });
    

        let pageLayout =`
        <div id="recipe-back">
        <span class="material-symbols-outlined">
            arrow_back
        </span>
    </div>
        <div  class="recipe-page-container"> 
              
                <img src = "${item.strMealThumb}" style= "width:70%; height:70%; flex-basis:50%;
                box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.66); object-fit:cover; padding:8px 4px;
                "/>
                
                <div class ="recipe-layout">
                <h1>${item.strMeal} </h1>
                <h2>Ingredients  </h2>
                ${ingredientObj}
                <h2>Measurements</h2>
                ${ measureObj}
                <h2>Instructions</h2>
                ${ instructionObj} 
            <div class="youtube-link" id = "youtube-link">
            <a href="${item.strYoutube}">
            <h2>YoutubeLink</h2>
            </a>
                </div>
                  
                </div>
            
                   
                   
        </div>
        `;

            recipePage.innerHTML = pageLayout;
            document.getElementById('recipe-back').addEventListener('click', function () {
                recipePage.style.display = 'none';
                mealsPage.style.display = 'flex';
            })

           

        });
    });
}
