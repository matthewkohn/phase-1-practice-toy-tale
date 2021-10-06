// Credit/guidance: https://www.youtube.com/watch?v=qHt4kUp_zFs

let addToy = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
let toyCollection = document.getElementById('toy-collection');

// Main function
function toyTale() {
  document.addEventListener("DOMContentLoaded", () => {
    fetchToys();
    createToys();
    increaseLikes();

    addBtn.addEventListener("click", () => {
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block";
      } else {
        toyFormContainer.style.display = "none";
      }
    });
  });
}
toyTale();

// Fetch Andy's Toys
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .catch(error => console.log(error))
    .then(toys => handleToyData(toys))
}

function handleToyData(toys) {
  // Take toys array and make HTML with them in order to add to the DOM
  let toysHTML = toys.map(function(toy) {
    return `
    <div class="card">
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like <3</button>
    </div>
    `
  })
  
  toyCollection.innerHTML = toysHTML.join('');
  console.log(toys)
}

// Add a New Toy
function createToys() {
  toyFormContainer.addEventListener('submit', e => {
    e.preventDefault();
    
    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    // Update Database
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
      .then(res => res.json())
      .catch(error => console.log(error))
      .then(newToy => {
        // Update DOM
        let newToyHTML = `
          <div class="card">
            <h2>${newToy.name}</h2>
            <img src="${newToy.image}" class="toy-avatar" />
            <p>${newToy.likes} Likes</p>
            <button class="like-btn" id="${newToy.id}">Like <3</button>
          </div>
        `
        toyCollection.innerHTML += newToyHTML

      })
  })
}

// Increase a Toy's Likes
function increaseLikes() {
  toyCollection.addEventListener('click', (e) => {
    if (e.target.className === "like-btn") {
      const currentID = e.target.id;

      let currentLikes = parseInt(e.target.previousElementSibling.innerText);
      let newLikes = currentLikes + 1;
      
      fetch(`http://localhost:3000/toys/${currentID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        "Accept": "application/json",
        },
        body: JSON.stringify({
          "likes": `${newLikes}`
          })
        })
        .then(res => res.json())
      e.target.previousElementSibling.innerText = newLikes + " Likes";
    }
  })
}
