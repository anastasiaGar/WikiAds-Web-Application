document.addEventListener("DOMContentLoaded", function () {
  // Get the category ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("categoryId");

  // Fetch ads for the selected category
  fetch(`https://wiki-ads.onrender.com/ads?category=${categoryId}`)
    .then((response) => response.json())
    .then((ads) => displayAds(ads))
    .catch((error) => console.error("Error fetching ads:", error));

  // Function to display ads 
  function displayAds(ads) {
    const adsMain = document.getElementById("adverts-main");

    ads.forEach((ad) => {
      // Create HTML elements for each ad
      const adContainer = document.createElement("div");
      adContainer.classList.add("ad-container");

      const title = document.createElement("h2");
      title.textContent = ad.title;

      const description = document.createElement("p");
      description.textContent = ad.description;

      const price = document.createElement("p");
      price.textContent = `Price: ${ad.cost} EUR`;

      const image = document.createElement("img");
      if (ad.images.length > 0) {
        image.src = `https://wiki-ads.onrender.com/${ad.images[0]}`;
        image.alt = ad.title;
      }

      const favoriteButton = document.createElement("button");
      favoriteButton.textContent = "Προσθήκη στα Αγαπημένα";
      favoriteButton.onclick = function () {
        addToFavorites(ad.title, ad.description, ad.cost, ad.images[0]);
      };
      // Append elements to the ad container
      adContainer.appendChild(title);
      adContainer.appendChild(description);
      adContainer.appendChild(price);
      adContainer.appendChild(image);
      adContainer.appendChild(favoriteButton);
      // Append the ad container 
      adsMain.appendChild(adContainer);
    });
  }


  // Function to handle user login
  window.login = function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Make a fetch request to your server's login endpoint
    fetch("http://localhost:8083/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response status is not OK (e.g., 400), handle the error
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Login failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        // Check if the server response indicates a successful login
        if (data && data.sessionId) {
          // Successful login, you can now use the session ID
          const sessionId = data.sessionId;
          // Store the session ID in localStorage for future use
          localStorage.setItem("sessionId", sessionId);
          // Store the username in localStorage for future use
          localStorage.setItem("username", username);

          console.log("Login successful. Session ID: ", sessionId);
          // Display a success message
          displayMessage("Login successful!", "green");
        } else {
          // Handle cases where the server response doesn't indicate a successful login
          throw new Error("Login failed. Invalid server response.");
        }
      })
      .catch((error) => {
        // Handle errors, e.g., display an error message to the user
        console.error("Login failed: ", error.message);
        // Display an error message
        displayMessage(error.message, "red");
      });
  };

  // Function to display messages on the screen
  function displayMessage(message, color) {
    const messageElement = document.getElementById("loginMessage");
    messageElement.textContent = message;
    messageElement.style.color = color;
  }


  //Function to add to favorites
  function addToFavorites(adId, title, description, cost, image) {
    const sessionId = localStorage.getItem("sessionId");
    const username = localStorage.getItem("username");
  
    if (!sessionId || !username) {
      displayMessage("Please login to add to favorites.", "red");
      return;
    }
  
    const data = {
      adId: adId,
      title: title,
      description: description,
      cost: cost,
      image: image,
      username: username,
      sessionId: sessionId,
    };
  
    fetch("http://localhost:8083/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          displayMessage("Ad added to favorites successfully!", "green");
        } else {
          displayMessage(result.message, "red");
        }
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error.message);
        displayMessage("Error adding to favorites. Please try again.", "red");
      });
  }
  
});


