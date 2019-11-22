let dURL = "http://localhost:3000/pups"
let goodOnly = false; 
let container = document.querySelector("#dog-summary-container");
let dogBar = document.querySelector("#dog-bar");

function render(goodOnly){
    while (dogBar.firstChild){
        dogBar.removeChild(dogBar.firstChild);
    }
    fetch(dURL)
            .then(rep => rep.json())
            .then(json=>json.forEach(function(e){ 
                
                createElement(e,goodOnly);
                
            }))
    }

    render(goodOnly);

document.addEventListener('click', function(e){
    if (e.target.id === "good-dog-filter"){
        e.target.innerText = goodOnly ? "Filter good dogs: OFF" : "Filter good dogs: ON";
        goodOnly = !goodOnly;
        render(goodOnly)
        console.log('clicked');
    }
    else if (e.target.className === "goodD"){
        let id = e.target.parentElement.dataset.id
        // debugger;
        goodBad(id);
    }
});

//return json element of dog
function goodBad(idOfDog){
    let good = document.querySelector(".goodD").innerText === "Bad Dog!" ? true : false; 
    // debugger;
    fetch(`${dURL}/${idOfDog}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify({
            isGoodDog: good
        })
    }).then(resp => resp.json())
    .then(json => {
        updateGood(json)
        
        render(goodOnly);
    });

}

function updateGood(dog){
    // debugger;
    let good = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
    container.innerHTML = `<div data-id=${dog.id}>
        <img src="${dog.image}">
        <h2>${dog.name}</h2>
        <button class="goodD">${good}</button>
    </div>`;
}



function createElement(jsonElement, goodOnly){
    if (goodOnly && !jsonElement.isGoodDog) {
        return;
    }
    let sp = document.createElement('span');
    sp.id = `${jsonElement.name}-button`;
    sp.innerText = jsonElement.name;
    let good = jsonElement.isGoodDog ? "Good Dog!" : "Bad Dog!";
    sp.addEventListener('click', function(e){
        container.innerHTML = `<div data-id=${jsonElement.id}>
            <img src="${jsonElement.image}">
            <h2>${jsonElement.name}</h2>
            <button class="goodD">${good}</button>
        </div>`;
    });
    
    document.querySelector("#dog-bar").appendChild(sp);
}

