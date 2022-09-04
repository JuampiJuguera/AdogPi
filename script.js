//URLS
"use strict";

const API_URL_RANDOM =
  "https://api.thedogapi.com/v1/images/search?mime_types=jpg,png&limit=11&api_key=live_ukD0zSpOkjUgTVM0Pq35ic3jSAGT0WdhETLfKLY55ODMpUfF8y26ER3qXWTOulvh";

const API_URL_FAVORITES = "https://api.thedogapi.com/v1/favourites?";

const API_URL_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}?&api_key=live_ukD0zSpOkjUgTVM0Pq35ic3jSAGT0WdhETLfKLY55ODMpUfF8y26ER3qXWTOulvh`;

const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload";

//Selectors

//Containers
const randomDogsContainer = document.querySelector("#random__dogs");
const favouriteDogsContainer = document.querySelector("#favourites__dogs");
const popupContainer = document.querySelector(".popup__container");
const aboutContainer = document.querySelector("#about-this");
//Buttons
const headerAbout = document.querySelector(".header__about");
const FooterAbout = document.querySelector(".footer__about");
const btnUpload = document.querySelector(".btn-upload");
const btnOtherDogs = document.querySelector(".btn-other");
const btnFav = [];
const btnDeleteFav = [];
const expand = [];
const imgFav = [];
const expandFav = [];
let urlsFavs = [];

const spanError = document.querySelector("#error");

//Normal functions

function createRandomDogsHTML(index, data) {
  //generate and insert new node
  let html = `
  <article class='container__random'>
  <div class='container__images'>  
  <img id="img${index}" class = 'random__images images' alt="Random dog picture" src="${data.url}"/>
  <span class='icon'><ion-icon name="expand-outline" class='expand${index} images-expand random-expand'></ion-icon></span> 
  </div>
  <button class = 'btn btn-add' id="btn-fav${index}">Adopt 💕</button>
  </article>`;

  randomDogsContainer.insertAdjacentHTML("beforeend", html);
  expand[index] = document.querySelector(`.expand${index}`);
  expand[index].onclick = () => seeFullSize(data.url, data.width, data.height);
  //Making functional save favourite button
  btnFav[index] = document.querySelector(`#btn-fav${index}`);
  btnFav[index].onclick = () => checkIfrepeated(data.id, index);
}

function createFavouriteDogsHTML(index, data) {
  let html = `  
  <article class='container__favourites'>
    <div class='container__images-fav'>
    <img class = 'favourite__images images' id="img${index}" alt="${data.id} dog" src="${data.image.url}"/>
    <ion-icon name="expand-outline" class = 'images-expand favourites-expand' id='expand${index}'></ion-icon>
    </div>
    <button class = 'btn btn-del' id="btn-del${index}">let go🦴</button>
  </article>
    
  `;

  favouriteDogsContainer.insertAdjacentHTML("beforeend", html);

  urlsFavs[index] = data.image.id;

  imgFav[index] = document.querySelector(`#img${index}`);

  const width = imgFav[index].naturalWidth;
  const height = imgFav[index].naturalHeight;

  expandFav[index] = document.querySelector(`#expand${index}`);
  expandFav[index].onclick = () => seeFullSize(data.image.url, width, height);

  btnDeleteFav[index] = document.querySelector(`#btn-del${index}`);
  btnDeleteFav[index].onclick = () =>
    deleteFavoriteDog(data.id, data.image.url);
}

function createAboutThisHtml() {
  let html = `
  <article class='about__container'>
  <div class='about__banner'><img class ='about__img' src="/images/doggopc.png" alt="good dogue"></div>
  <div class="about__card">
  <span class = "about__closure">&#x2715</span>
  <h3 class="about__title">What is this?</h3>
  <p class="about__text">
   This is a project I made to practice and improve my skills in Html Css and Javascript.<br>
   Currently the project is working but I plan to implement and improve different functionalities through updates over time.<br>
   If this is the first project of mine you see don't be afraid to take a look at my portfolio.<br>
   Thank you very much for your interest.
  </p>
  <div class='about__footer'>
  <div class='about__me'><img class ='about__img' src="/images/yo.png" alt="me"></div>
  <div class='about__name'>Juan Pablo Juguera<br><a href="https://juampijuguera.github.io/Portfolio/" target="_blank">Portfolio</a></div>
  </div>

  </div>
  </article>`;

  aboutContainer.insertAdjacentHTML("afterbegin", html);

  const btnClose = document.querySelector(".about__closure");

  aboutContainer.classList.add("popup-open");

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFullsize();
    }
  });
  btnClose.onclick = () => closeFullsize();
  btnClose.onclick = () => closeFullsize();
}

function seeFullSize(url, width, height) {
  let html = `
          <div class='popup__container-end'>
              <img id="img-big" class ='img-big' alt="Random dog picture" src="${url}"/> 
              <span class = 'closure'>&#x2715</span>
          </div>`;

  popupContainer.insertAdjacentHTML("beforeend", html);

  const imgSelected = document.querySelector("#img-big");
  const btnClose = document.querySelector(".closure");

  popupContainer.classList.add("popup-open");

  sizeCalculation(width, height, imgSelected);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFullsize();
    }
  });
  btnClose.onclick = () => closeFullsize();
}

function sizeCalculation(width, height, imgSelected) {
  if (width === height) {
    imgSelected.style.width = "300px"; //300px
    imgSelected.style.height = "300px"; //300px
    return;
  }
  if (width > height) {
    imgSelected.style.width = "330px"; //450
    imgSelected.style.height = "280px"; //300
    return;
  }
  imgSelected.style.width = "300px"; //300
  imgSelected.style.height = "500px"; //500
}

function closeFullsize() {
  popupContainer.classList.remove("popup-open");
  popupContainer.innerHTML = "";
}

function checkIfrepeated(id, index) {
  btnFav[index].style.backgroundColor = "#326b47";
  btnFav[index].innerHTML = "Adopted💕";
  btnFav[index].style.paddingRight = "3.2em";
  if (urlsFavs.some((urlId) => urlId === id)) {
    alert("you have already adopted this dog");
    return;
  }
  saveFavouriteDog(id);
}

function InputMiniatureLoading() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);
  const reader = new FileReader();

  if (form.children.length === 3) {
    const preview = document.getElementById("preview");
    form.removeChild(preview);
  }
  reader.readAsDataURL(formData.get("file"));

  reader.onload = () => {
    const previewImage = `<img class='form__miniature'  id="preview" alt="Miniature Dog" onerror=this.src="images/miniature.png" src="${reader.result}"/>`;
    form.insertAdjacentHTML("afterbegin", previewImage);
  };
}

//Async Functions

async function loadRandomDogs() {
  try {
    const response = await fetch(API_URL_RANDOM); //1
    const data = await response.json(); //2

    //Clean old dogs pictures
    randomDogsContainer.innerHTML = "";

    //Iterate per dog picture
    for (const [index, dataValue] of data.entries()) {
      createRandomDogsHTML(index, dataValue);
    }
  } catch (error) {
    spanError.innerHTML = `Hubo un error ${error}`;
  }
}

async function loadFavouritesDogs() {
  try {
    const response = await fetch(API_URL_FAVORITES, {
      method: "GET",
      headers: {
        "X-API-KEY":
          "live_ukD0zSpOkjUgTVM0Pq35ic3jSAGT0WdhETLfKLY55ODMpUfF8y26ER3qXWTOulvh",
      },
    });
    const data = await response.json();

    favouriteDogsContainer.innerHTML = "";

    for (const [index, dataValue] of data.entries()) {
      createFavouriteDogsHTML(index, dataValue);
    }
  } catch (error) {
    spanError.innerHTML = `Hubo un error ${error}`;
  }
}

async function saveFavouriteDog(id, urlFav) {
  const response = await fetch(API_URL_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY":
        "live_ukD0zSpOkjUgTVM0Pq35ic3jSAGT0WdhETLfKLY55ODMpUfF8y26ER3qXWTOulvh",
    },
    body: JSON.stringify({
      image_id: `${id}`,
    }),
  });
  const data = await response.json();

  loadFavouritesDogs();
}

async function deleteFavoriteDog(id, url) {
  const response = await fetch(API_URL_DELETE(id), {
    method: "DELETE",
    headers: {
      "X-API-KEY":
        "live_ukD0zSpOkjUgTVM0Pq35ic3jSAGT0WdhETLfKLY55ODMpUfF8y26ER3qXWTOulvh",
    },
  });
  const data = await response.json();

  const index = urlsFavs.indexOf(url);

  if (index != -1) {
    urlsFavs.splice(index, 1);
  }

  loadFavouritesDogs();
}

async function uploadDogPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);

  console.log(formData.get("file"));

  const response = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: {
      "X-API-KEY":
        "live_ukD0zSpOkjUgTVM0Pq35ic3jSAGT0WdhETLfKLY55ODMpUfF8y26ER3qXWTOulvh",
    },
    body: formData,
  });
  const data = await response.json();
  saveFavouriteDog(data.id);
}

loadRandomDogs();
loadFavouritesDogs();

btnUpload.onclick = () => uploadDogPhoto();
btnOtherDogs.onclick = () => loadRandomDogs();

InputMiniatureLoading();

headerAbout.onclick = () => createAboutThisHtml();
FooterAbout.onclick = () => createAboutThisHtml();

//Listen to changes in input value
const input = document.querySelector("input");
input.addEventListener("change", (e) => {
  InputMiniatureLoading();
});
