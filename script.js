//TMDB 
//https://www.youtube.com/watch?v=_KzimS9fcM0
//Here we are using DISCOVER API based on the with-genre query selector 
//DOCUMENTATION for our API :https://developers.themoviedb.org/3/discover/movie-discover
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
// shows popular movies 
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
//for searching
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

//To get GENREs URL is : base_url/genre/movie/list?api_key
//URL:https://api.themoviedb.org/3/genre/movie/list?api_key=1cf50e6248dc270629e802686245c2c8
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
];

//getting main id
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
// Pagination
const prev = document.getElementById('prev');
const current = document.getElementById('current');
const next = document.getElementById('next');

let current_page=1;
let next_page=2;
let prev_page=0;
let lastUrl=' ';
let totalPages = 100;

//Seeting tags Dynamically from genres
//we have to load movies on to the screen based on this selected genre Array.
let selectedGenre = [];
//calling function first as we need data to display onload of page
setGenre();
function setGenre(){
    tagsEl.innerHTML = '';
    genres.forEach(genre =>{
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.id = genre.id;
        tag.innerText = genre.name;
       
        tag.addEventListener('click',() =>{
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            // console.log(selectedGenre)
            //now here we call API for only selectedgenre
            //kept all these steps as we need to follow from given in website, and kept encode-URI AS IT IS GET REQUEST METHOD;
            getMovies(API_URL+'&with_genres='+encodeURI(selectedGenre.join(',')));
            highlightSelected();
            //disabling button after clicking two times on same genre, as clear shows up after clicking genre
            if(selectedGenre.length == 0){
              clearButton.innerHTML='';
            }
        })
        tagsEl.appendChild(tag);
    })
};

//function hightlight selected genre
function highlightSelected(){
    //when we click again,all the tags will be removed from orange and that tag will be removed from array...
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>{
        tag.classList.remove('highlight');
        // console.log("Removed...")
    })
    clearBtn();
    //Again here colour will be given to tag present in array...
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id =>{
            const higlightedTag = document.getElementById(id);
            higlightedTag.classList.add('highlight');
            // console.log("Added...")
        })
    }
};

// Clear Button
let clearButton = document.getElementById('clearBtn')
function clearBtn(){
  let clearBtn = document.getElementById('clear');
  if(clearBtn){
      return;
  }
  else{
      let clear = document.createElement('div');
      clear.classList.add('clear');
      clear.id = 'clear';
      clear.innerText = ' Clear ';
      //click is an event and ()=> creating function
      clear.addEventListener('click', () => {
          selectedGenre = [];
          setGenre();            
          getMovies(API_URL);
          clearButton.innerHTML='';
      })
    clearButton.append(clear);
  }   
};

//calling function first
getMovies(API_URL)
function getMovies(url){
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        // console.log(data.results);
        if(data.results.length !==0){
            showMovies(data.results);
                current_page = data.page;
                next_page = current_page + 1;
                prev_page = current_page - 1;
                totalPages = data.total_pages;
                //making to visible page numbers
                current.innerText = current_page;

                if(current_page <= 1){
                  prev.classList.add('disabled');
                  next.classList.remove('disabled')
                }else if(current_page>= totalPages){
                  prev.classList.remove('disabled');
                  next.classList.add('disabled')
                }else{
                  prev.classList.remove('disabled');
                  next.classList.remove('disabled')
                }

                search.scrollIntoView({behavior : "smooth"})
        }else{
            main.innerHTML = `<h1>No Results Found..!</h1>`
        } 
    })
};

//for showing movies on page
function showMovies(data){
    //making main div empty to put data in here which is called
    main.innerHTML='';
    data.forEach(movie => {
        //Getting all these data from the movie object
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        //for broken image,if present show placeholder
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button
            </div>  
        `
    main.appendChild(movieEl);
    })
};

//getting color code
function getColor(vote){
    if(vote>=8){
        return "green";
    }else if(vote>=5){
        return "orange";
    }
    else{
        return "red";
    }
};

//Searching...
form.addEventListener('submit',(e)=>{
    //toprevent default submission
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    setGenre();
    clearButton.innerHTML = '';
    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm)
    }
    else{
        getMovies(API_URL);
    }
});

//next page event
next.addEventListener('click',()=>{
  if(next_page <= totalPages){
    pageCall(next_page);
  }
});

//page calling
function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  //making url to include page by splitting for first click
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    //joining url what we split after we included page we want to move
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    //passing desired url to show up the results
    getMovies(url);
  }
}
//previous page
prev.addEventListener('click', () => {
  if(prev_page > 0){
    pageCall(prev_page);
  }
});

