document.addEventListener("DOMContentLoaded", function () {
  // Get the subcategory_id from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const subcategoryId = urlParams.get("subcategoryId");

  // Fetch data for the selected subcategory
  fetch(
    `https://wiki-ads.onrender.com/categories/${subcategoryId}/subcategories`
  )
    .then((response) => response.json())
    .then((subcategoryData) => {
      // Process the subcategory data and generate HTML content
      const subcategoryTitle = subcategoryData.title;
      const adsContainer = document.getElementById("adverts-main");

      // Generate HTML for subcategory title
      const subcategoryTitleElement = document.createElement("h2");
      subcategoryTitleElement.textContent = subcategoryTitle;
      adsContainer.appendChild(subcategoryTitleElement);

      // Fetch ads for the selected subcategory
      fetch(`https://wiki-ads.onrender.com/ads?subcategory=${subcategoryId}`)
        .then((response) => response.json())
        .then((adsData) => {
          // Process ads data and generate HTML content
          adsData.forEach((ad) => {
            const adElement = document.createElement("div");
            adElement.classList.add("ad");

            // Generate HTML for ad details (title, description, price, images)
            adElement.innerHTML = `
                            <h3>${ad.title}</h3>
                            <p>${ad.description}</p>
                            <p>Price: ${ad.cost}</p>  
                            <div class="ad-images">
                                ${ad.images
                                  .map(
                                    (image) =>
                                      `<img src="https://wiki-ads.onrender.com/${image}" alt="Ad Image">`
                                  )
                                  .join("")}
                            </div>
                            `;

            // Generate HTML for ad features
            const featuresTable = document.createElement("table");
            featuresTable.classList.add("features-table");
            const features = ad.features.split(";");
            features.forEach((feature) => {
              const [featureName, featureValue] = feature.split(":");
              const row = featuresTable.insertRow();
              row.innerHTML = `<td>${featureName}</td><td>${featureValue}</td>`;
            });

            // Append features table to the ad element
            adElement.appendChild(featuresTable);

            // Append the ad element to the ads container
            adsContainer.appendChild(adElement);
          });
        })
        .catch((error) => console.error("Error fetching ads:", error));
    })
    .catch((error) => console.error("Error fetching subcategory:", error));
});
//
