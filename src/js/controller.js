'use strict';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// import icons from '../img/icons.svg'; // parcel v1
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//parcel - zatrzymuje wyniki API po odświeżeniu strony
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    //pobieramy hash id przepisu
    const id = window.location.hash.slice(1);

    //guard jeżeli id jest puste nie rób nic
    if (!id) return;
    recipeView.renderSpinner();

    //result view zaznaczamy wybrany przepis
    resultsView.update(model.getSearchResultsPage());
    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    // render results
    resultsView.render(model.getSearchResultsPage());
    //render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    // throw err;
  }
};

const controlPagination = function (goToPage) {
  // console.log('goToPage:', goToPage);
  // render results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render pagination buttons
  paginationView.render(model.state.search);
};
//zmiana ilości osób dla dania
const controlServings = function (newServings) {
  //update recipe servings
  model.updateServings(newServings);

  //update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//dodajemy zakłądkę do przepisu
const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmakrs = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show spinner
    addRecipeView.renderSpinner();
    //upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe in the view
    recipeView.render(model.state.recipe);

    //succes message
    addRecipeView.renderMessage();
    const mes = document.querySelector('.message');
    mes.style.width = '500px';

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.removeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmakrs);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome!!');
};
init();
