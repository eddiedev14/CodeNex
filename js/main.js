//Definición de Variables

const subscribersNumber = document.querySelector("#subscribers");
const viewsNumber = document.querySelector("#views");
const videosNumber = document.querySelector("#videos");
const projectsNumber = document.querySelector("#projects");
const videosContainer = document.querySelector(".swiper-wrapper");
const filterBtn = document.querySelectorAll(".videos__list__filters__item")
const tmplVideo = document.querySelector("#tmplVideo");

const apiKey = "AIzaSyClQTZ3h0TGQgFM0pxTknNHmCzdqE7XGAs";
const userId = "UCc9i7-I_0pIQq8flnmqt1YQ";
const userGithub = "eddiedev14";
let filterSelected = "Latest";

document.addEventListener("DOMContentLoaded", loadStats);
filterBtn.forEach(btn => {
    btn.addEventListener("click", changeFilter)
});

function loadStats() {
    //Obtenemos información de las API con promesas (Promise)
    Promise.all([
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${userId}&key=${apiKey}`)
            .then(response => response.json()),
        fetch(`https://api.github.com/users/${userGithub}`)
            .then(response => response.json())
    ]).then(([youtubeData, githubData]) => {
        // Procesamos los datos de YouTube
        const { subscriberCount, viewCount, videoCount } = youtubeData.items[0].statistics;
        subscribersNumber.textContent = parseInt(subscriberCount).toLocaleString();
        viewsNumber.textContent = parseInt(viewCount).toLocaleString();
        videosNumber.textContent = videoCount;

        // Procesamos los datos de GitHub
        projectsNumber.textContent = githubData.public_repos;
    }).catch(error => {
        console.error('Hubo un error a la hora de recopilar las estadísticas');
    });

    //Cargamos los vídeos
    loadVideos(filterSelected);

    //Inicializamos el Swiper
    initializeSwiper();
}

function changeFilter(e) {
    //Alternamos clase y redefinimos variable
    document.querySelector(".videos__list__filters__item.active").classList.remove("active")
    e.target.classList.add("active");

    if (e.target.id === "recents") {
        filterSelected = "Latest";
    }else{
        filterSelected = "Popular";
    }

    //Cargamos los vídeos
    loadVideos(filterSelected);
}


function loadVideos(filter) {
    if (filter === "Latest") {
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${userId}&maxResults=5&order=date&type=video&key=${apiKey}`)
            .then(response => response.json())
            .then(data => cloneTemplate(data))
    }else{
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${userId}&maxResults=5&order=viewCount&type=video&key=${apiKey}`)
            .then(response => response.json())
            .then(data => cloneTemplate(data))
    }
}

function cloneTemplate(data ) {
    //Limpiamos el contenedor
    cleanVideos();

    //Recorremos Items
    const { items } = data;
    items.forEach(item => {
        //Destructuring
        const { videoId } = item.id;
        const { title, description, publishTime } = item.snippet;
        const { url } = item.snippet.thumbnails.high;

        //Mostramos en el DOM
        const thumbnailImg = tmplVideo.content.querySelector(".videos__list__cards__item__thumbnail__img");
        const titleElement = tmplVideo.content.querySelector(".videos__list__cards__item__content__title");
        const paragraphElement = tmplVideo.content.querySelector(".videos__list__cards__item__content__paragraph");
        const watchElement = tmplVideo.content.querySelector(".videos__list__cards__item__content__actions__watch");
        const dateElement = tmplVideo.content.querySelector(".videos__list__cards__item__content__actions__date__text");

        thumbnailImg.src = url;
        thumbnailImg.alt = title;
        titleElement.textContent = truncateText(title, 8);
        paragraphElement.textContent = truncateText(description, 24);
        watchElement.href = `https://www.youtube.com/watch?v=${videoId}`;
        dateElement.setAttribute("datetime", publishTime)
        dateElement.textContent = publishTime.slice(0, 10);

        const clone = tmplVideo.content.cloneNode(true);
        videosContainer.appendChild(clone)
    });
}

function truncateText(text, maxWords) {
    const words = text.split(' ');

    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
}

function cleanVideos() {
    while (videosContainer.firstElementChild) {
        videosContainer.firstElementChild.remove();
    }
}

function initializeSwiper() {
    const swiperVideos = new Swiper('.videos__list__cards.swiper', {
        // Optional parameters
        slidesPerView: 'auto',
        spaceBetween: 40,
        slidesPerGroup: 1,   
        // If we need pagination
        pagination: {
            el: '.videos__list__cards__pagination.swiper-pagination',
          },
        
          // Navigation arrows
          navigation: {
            nextEl: '.videos__list__cards__button.swiper-button-next',
            prevEl: '.videos__list__cards__button.swiper-button-prev',
          }
      });
}