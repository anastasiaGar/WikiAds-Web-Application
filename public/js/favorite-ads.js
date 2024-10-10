document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const sessionId = urlParams.get("sessionId");

  fetch(
    `http://localhost:8083/favorites?username=${encodeURIComponent(
      username
    )}&sessionId=${encodeURIComponent(sessionId)}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Πρόβλημα στη λήψη αγαπημένων αγγελιών");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        displayFavorites(data.favorites);
      } else {
        console.error("Σφάλμα:", data.message);
      }
    })
    .catch((error) => {
      console.error("Σφάλμα:", error);
    });

  function displayFavorites(favorites) {
    const container = document.getElementById("favorites-container");
    container.innerHTML = "";

    favorites.forEach((fav) => {
      const div = document.createElement("div");
      div.className = "favorite-item";
      div.innerHTML = `
      <h3>${fav.title}</h3>
      <p>${fav.description}</p>
      <p>Price: ${fav.cost}</p>  
      <div class="ad-images">
      ${fav.images
        .map(
          (image) =>
            `<img src="https://wiki-ads.onrender.com/${image}" alt="Ad Image">`
        )
        .join("")}
  </div>
            `;
      container.appendChild(div);
    });
  }
});
