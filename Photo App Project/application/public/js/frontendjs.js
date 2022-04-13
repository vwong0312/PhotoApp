let flashElement = document.getElementById('flash-message');
function setFlashMessageFade(){
    setTimeout(() => {
        let currOpacity = 1.0;
        let timer = setInterval(() => {
            if(currOpacity < 0.05){
                clearInterval(timer);
                flashElement.remove();
            }
            currOpacity = currOpacity - .05;
            flashElement.style.opacity = opacity
        }, 50);
    },4000);
}

function addFlashFromFrontEnd(message, level){
    let flashMessageDiv = document.createElement("div");
    let innerFlashDiv = document.createElement("div");
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute("id", "flash-message");
    innerFlashDiv.setAttribute("class", `alert alert-${level}`);
    document.getElementsByName("body")[0].appendChild(flashMessageDiv);
    setFlashMessageFade(flashMessageDiv);
}

function createCard(postData){
    return `<div id="post-${postData.id}" class="card">
    <img class="card-image" src="${postData.thumbnail}" alt="Missing Image">
    <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p class="card-text">${postData.description}</p>
        <a href="/post/${postData.id}" class="anchor-buttons">Post Details</a>
    </div>
</div>`;
}

function executeSearch(){
    let searchTerm = document.getElementById('search-text').value;
    if(!searchTerm){
        location.replace('/');
        return;
    }
    let content = document.getElementById('container');
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
    .then((data) => {
        return data.json();
    })
    .then((data_json) => {
        let newMainContentHTML = '';
        data_json.results.forEach((row) => {
            newMainContentHTML += createCard(row);
        });
        content.innerHTML = newMainContentHTML;
        if(data_json.message){
            addFlashFromFrontEnd(data_json.message);
        }
    })
    .catch((err) => console.log(err));
}

if(flashElement){
    setFlashMessageFade();
}

let searchButton = document.getElementById('search-button');
if(searchButton){
    searchButton.onclick = executeSearch;
}