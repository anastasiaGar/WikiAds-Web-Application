fetch("https://wiki-ads.onrender.com/categories")
  .then((response) => response.json())
  .then((data) => {
    let template = {};

    template.templateFunction = Handlebars.compile(`
          <section class="navigation-sidebar">
          </section>
          <div class="informationdata">
              <section id="info">
                  <h2>Κατηγορίες Προϊόντων</h2>
                  <ol id="category-list">
                      {{#each this}}
                      <li>
                          <section class="info">
                              <h3>{{title}}</h3>
                              <a href="category.html?categoryId={{id}}" >
                                <img src="https://wiki-ads.onrender.com/{{img_url}}" alt="{{title}}"/>
                              </a>
                              <div class="subcategories" id="subcategories-{{id}}">
                                  {{#each subcategories}}
                                    <a href="subcategory.html?subcategoryId={{id}}">
                                        <p>{{title}}</p>
                                    </a>
                                  {{/each}}
                              </div>
                          </section>
                      </li>
                      {{/each}}
                  </ol>
              </section>
          </div>
      `);

    let main = document.getElementById("info-main");
    main.innerHTML += template.templateFunction(data);

    // Fetch and append subcategories
    data.forEach((category) => {
      fetch(
        `https://wiki-ads.onrender.com/categories/${category.id}/subcategories`
      )
        .then((response) => response.json())
        .then((subcategories) => {
          let subcategoriesHtml = "";
          subcategories.forEach((subcategory) => {
            subcategoriesHtml += `
                          <a href="subcategory.html?subcategoryId=${subcategory.id}">
                              <p>${subcategory.title}</p>
                          </a>
                      `;
          });

          let subcategoriesContainer = document.getElementById(
            `subcategories-${category.id}`
          );
          subcategoriesContainer.innerHTML = subcategoriesHtml;
        })
        .catch((error) =>
          console.error(
            `Error fetching subcategories for category ${category.id}:`,
            error
          )
        );
    });
  });
