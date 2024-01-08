//Definición de Variables

const subscribersNumber = document.querySelector("#subscribers");
const viewsNumber = document.querySelector("#views");
const videosNumber = document.querySelector("#videos");
const projectsNumber = document.querySelector("#projects");

const apiKey = "AIzaSyCGdTJmtuELY0UfNdzkVCuOalTBWkTo3KQ";
const userId = "UCc9i7-I_0pIQq8flnmqt1YQ";
const userGithub = "eddiedev14";

document.addEventListener("DOMContentLoaded", () => {
    //Cargamos las estadísticas
    loadStats();
})

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
}