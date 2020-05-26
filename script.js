const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsElement = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealElement = document.getElementById('single_meal');


  // search Meal and fetch API
  function searchMeal(e){
    e.preventDefault();

    // Clear single meal
    single_mealElement.innerHTML = '';
    const term = search.value;

    // Check empty
    if(term.trim()){
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
          //console.log(data);
          resultHeading.innerHTML = `<h2>Search result for '${term}':</h2>`;

          if(data.meals === null) {
            resultHeading.innerHTML = `<p>There are no search results. Try again! </p>`
          } else {
            mealsElement.innerHTML = data.meals.map(meal => `
              <div class="meal" onclick="location.href='#single_meal'">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
              `
            ).join('');
          }
        })
        // Clear search
    } else {
      alert('Please enter a search term');
    }
  }

  //Fecth meal by // ID
  function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
      });
  }

  //Fetch random meals
  function getRandomMeal(){
    //Clear meals and resultHeading
    mealsElement.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
      })
  }

  //Add meal to DOM
  function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
      if(meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }

    single_mealElement.innerHTML = `
      <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function getMeals(e) {

      if(e.target.getAttribute('data-mealid') === null) {
        const mealID = e.target.offsetParent.getAttribute('data-mealid');
        getMealById(mealID);
      } else {
        const mealID = e.target.getAttribute('data-mealid');
        getMealById(mealID);
      }

    }


  // Event Listeners
  submit.addEventListener('submit', searchMeal);
  random.addEventListener('click', getRandomMeal);

  mealsElement.addEventListener('click', getMeals);
