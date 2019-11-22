
//globals
let dURL = "http://localhost:3000/pups"
let goodOnly = false; 
let container = document.querySelector("#dog-summary-container");
let dogBar = document.querySelector("#dog-bar");


/* Initial Render of dogs elements on load */
render(goodOnly);

/** 
* Renders elements for all dogs. Takes boolean flag goodOnly as argument,
* which renders specifically dogs with isGoodDog attribute true 
*/
function render(goodOnly){
    //Remove all elements from dogBar, to prevent duplication
    while (dogBar.firstChild){
        dogBar.removeChild(dogBar.firstChild);
    }
    //Fetch request to db.json 
    fetch(dURL)
            .then(rep => rep.json())
            .then(json=>json.forEach(function(e){ 
                createElement(e,goodOnly); 
            }))
    }

/**
 * Helper method used by render, which takes a json object and the goodOnly flag
 * as arguments and renders span elements containing the dog name which
 * also are given an event listener to display dog's expanded information
 * on the container 
 */
function createElement(jsonElement, goodOnly){
    if (goodOnly && !jsonElement.isGoodDog) {
        return;
    }
    let sp = document.createElement('span');
    sp.id = `${jsonElement.name}-button`;
    sp.innerText = jsonElement.name;
    let good = jsonElement.isGoodDog ? "Good Dog!" : "Bad Dog!";
    sp.addEventListener('click', function(e){
        container.innerHTML = `<div id="dog-info" data-id=${jsonElement.id}>
            <img src="${jsonElement.image}">
            <h2>${jsonElement.name}</h2>
            <button class="goodD">${good}</button>
        </div>`;
    });
    
    document.querySelector("#dog-bar").appendChild(sp);
}


/**
 * Event delegation for Filter Good Dogs and Good Dog/Bad Dog button toggles  
 */
document.addEventListener('click', function(e){
    //updates DOM text and toggles goodOnly flag and rerenders dog elements
    if (e.target.id === "good-dog-filter"){
        e.target.innerText = goodOnly ? "Filter good dogs: OFF" : "Filter good dogs: ON";
        goodOnly = !goodOnly;
        render(goodOnly)
        // console.log('clicked');
    }
    //Sends a Patch request using the ID of the target dog 
    else if (e.target.className === "goodD"){
        let id = e.target.parentElement.dataset.id
        // debugger;
        goodBad(id);
    }
});

/**
 * Patch request which takes argument of a dog ID, and updates the isGoodDog
 * attribute of corresponding dog object 
 * and rerenders dogs if Good Dog filter is ON 
 *(rerendering is unnecessary when filter is not on)
 */
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
        if (goodOnly){
            render(goodOnly);
        }
    });

}

/**
 * DOM Update method for the above Patch request, takes a json object as an argument
 * and updates the DOM button toggle to reflect dog object's current isGoodDog value
 */
function updateGood(dog){
    // debugger;
    let good = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
    document.querySelector(".goodD").innerText = good;
}




