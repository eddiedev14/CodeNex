const subscribersNumber=document.querySelector("#subscribers"),viewsNumber=document.querySelector("#views"),videosNumber=document.querySelector("#videos"),projectsNumber=document.querySelector("#projects"),videosContainer=document.querySelector(".swiper-wrapper"),filterBtn=document.querySelectorAll(".videos__list__filters__item"),tmplVideo=document.querySelector("#tmplVideo"),newsletterForm=document.querySelector("#newsletter"),header=document.querySelector(".header"),hero=document.querySelector(".hero"),apiKey="AIzaSyClQTZ3h0TGQgFM0pxTknNHmCzdqE7XGAs",userId="UCc9i7-I_0pIQq8flnmqt1YQ",userGithub="eddiedev14";let filterSelected="Latest";function navigationDisplay(){if(window.innerWidth<=1e3){let e=document.querySelectorAll(".nav__mobile__list__item__link");e.forEach(e=>{e.addEventListener("click",toggleActive)})}}function toggleActive(e){document.querySelector(".nav__mobile__list__item__link.active")&&document.querySelector(".nav__mobile__list__item__link.active").classList.remove("active"),e.target.classList.add("active")}function loadStats(){Promise.all([fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${userId}&key=${apiKey}`).then(e=>e.json()),fetch("https://api.github.com/users/eddiedev14").then(e=>e.json())]).then(([e,t])=>{let{subscriberCount:i,viewCount:o,videoCount:r}=e.items[0].statistics;subscribersNumber.textContent=parseInt(i).toLocaleString(),viewsNumber.textContent=parseInt(o).toLocaleString(),videosNumber.textContent=r,projectsNumber.textContent=t.public_repos}).catch(e=>{console.error("Hubo un error a la hora de recopilar las estad\xedsticas")}),loadVideos(filterSelected),initializeSwiper()}function changeFilter(e){document.querySelector(".videos__list__filters__item.active").classList.remove("active"),e.target.classList.add("active"),loadVideos(filterSelected="recents"===e.target.id?"Latest":"Popular")}function loadVideos(e){"Latest"===e?fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${userId}&maxResults=5&order=date&type=video&key=${apiKey}`).then(e=>e.json()).then(e=>cloneTemplate(e)):fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${userId}&maxResults=5&order=viewCount&type=video&key=${apiKey}`).then(e=>e.json()).then(e=>cloneTemplate(e))}function cloneTemplate(e){cleanVideos();let{items:t}=e;t.forEach(e=>{let{videoId:t}=e.id,{title:i,description:o,publishTime:r}=e.snippet,{url:s}=e.snippet.thumbnails.high,n=tmplVideo.content.querySelector(".videos__list__cards__item__thumbnail__img"),a=tmplVideo.content.querySelector(".videos__list__cards__item__content__title"),l=tmplVideo.content.querySelector(".videos__list__cards__item__content__paragraph"),c=tmplVideo.content.querySelector(".videos__list__cards__item__content__actions__watch"),d=tmplVideo.content.querySelector(".videos__list__cards__item__content__actions__date__text");n.src=s,n.alt=i,a.textContent=truncateText(i,8),l.textContent=truncateText(o,24),c.href=`https://www.youtube.com/watch?v=${t}`,d.setAttribute("datetime",r),d.textContent=r.slice(0,10);let u=tmplVideo.content.cloneNode(!0);videosContainer.appendChild(u)})}function truncateText(e,t){let i=e.split(" ");return i.length>t?i.slice(0,t).join(" ")+"...":e}function cleanVideos(){for(;videosContainer.firstElementChild;)videosContainer.firstElementChild.remove()}function initializeSwiper(){new Swiper(".videos__list__cards.swiper",{slidesPerView:"auto",spaceBetween:40,slidesPerGroup:1,pagination:{el:".videos__list__cards__pagination.swiper-pagination"},navigation:{nextEl:".videos__list__cards__button.swiper-button-next",prevEl:".videos__list__cards__button.swiper-button-prev"}})}function newsletterSubscription(e){e.preventDefault();try{fetch("https://sheet.best/api/sheets/cc9a87cd-f8a3-4a6d-b86f-7b3e06c9f25c",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({"Correo Electronico":newsletterForm.emailNewsletter.value})}),Swal.fire({title:"\xa1Felicitaciones!",text:"Te has suscrito a la lista de correos afiliados para Todo C\xf3digo \xa1Recibir\xe1s notificaciones cada vez que haya nuevo contenido!",icon:"success"})}catch(t){Swal.fire({title:"\xa1Ops!",text:"Ha ocurrido un error a la hora de afiliarte. Intenta m\xe1s tarde",icon:"error"})}}document.addEventListener("DOMContentLoaded",e=>{loadStats(),navigationDisplay()}),window.addEventListener("resize",navigationDisplay),filterBtn.forEach(e=>{e.addEventListener("click",changeFilter)}),newsletterForm.addEventListener("submit",newsletterSubscription);