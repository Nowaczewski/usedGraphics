function createComponentTile(component) {
  const detailLink = `component-detail.html?id=${component.id}`;

  const componentStatus = component.status || "in-stock";
  const statusText = componentStatus === "sold" ? "Sold" : "In Stock";
  const statusClass =
    componentStatus === "sold" ? "status-sold" : "status-in-stock";

  const detailsList = component.details
    ? Object.entries(component.details)
        .map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          return `<li><strong>${label}:</strong> ${value}</li>`;
        })
        .join("")
    : "";

  return `
    <article class="card build-card ${componentStatus === "sold" ? "sold" : ""}">
      <a href="${detailLink}" class="build-image-wrap">
        <img class="build-image" src="${component.image}" alt="${component.name}">
        <span class="status-badge ${statusClass}">
          ${statusText}
        </span>
      </a>

      <div class="card-body">
        <div class="eyebrow">${component.type}</div>

        <h3>
          <a href="${detailLink}">${component.name}</a>
        </h3>

        <p><strong>Availability:</strong> ${statusText}</p>
        <p><strong>Brand:</strong> ${component.brand}</p>
        <p><strong>Condition:</strong> ${component.condition}</p>
        <p><strong>Price:</strong> ${component.price}</p>

        ${
          detailsList
            ? `
              <p><strong>Details:</strong></p>
              <ul class="feature-list">
                ${detailsList}
              </ul>
            `
            : ""
        }

        <div class="button-row" style="margin-top: 12px;">
          <a class="btn btn-secondary" href="${detailLink}">View Component</a>
          <a class="btn btn-primary" href="contact.html">Contact</a>
        </div>
      </div>
    </article>
  `;
}

const componentContainer = document.getElementById("component-container");

const availabilityFilter = document.getElementById("availability-filter");
const typeFilter = document.getElementById("type-filter");
const conditionFilter = document.getElementById("condition-filter");
const priceFilter = document.getElementById("price-filter");
const sortFilter = document.getElementById("sort-filter");
const resetFilters = document.getElementById("reset-filters");

function getNumericPrice(price) {
  if (typeof price === "number") return price;
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function renderComponents(componentList) {
  if (!componentContainer) {
    console.error("component-container not found");
    return;
  }

  if (!componentList.length) {
    componentContainer.innerHTML = `
      <div class="info-card">
        <h2 class="panel-title">No components found</h2>
        <p>Try changing your filters or check back when more parts are listed.</p>
      </div>
    `;
    return;
  }

  componentContainer.innerHTML = componentList
    .map((component) => createComponentTile(component))
    .join("");
}

function filterComponents() {
  let filteredComponents = [...components];

  const selectedAvailability = availabilityFilter
    ? availabilityFilter.value
    : "all";

  const selectedType = typeFilter ? typeFilter.value : "all";
  const selectedCondition = conditionFilter ? conditionFilter.value : "all";
  const selectedPrice = priceFilter ? priceFilter.value : "all";
  const selectedSort = sortFilter ? sortFilter.value : "default";

  if (selectedAvailability !== "all") {
    filteredComponents = filteredComponents.filter((component) => {
      const componentStatus = component.status || "in-stock";
      return componentStatus === selectedAvailability;
    });
  }

  if (selectedType !== "all") {
    filteredComponents = filteredComponents.filter(
      (component) => component.type === selectedType,
    );
  }

  if (selectedCondition !== "all") {
    filteredComponents = filteredComponents.filter(
      (component) => component.condition === selectedCondition,
    );
  }

  if (selectedPrice !== "all") {
    filteredComponents = filteredComponents.filter((component) => {
      const price = getNumericPrice(component.price);

      if (selectedPrice === "under-50") return price < 50;
      if (selectedPrice === "50-150") return price >= 50 && price <= 150;
      if (selectedPrice === "150-300") return price >= 150 && price <= 300;
      if (selectedPrice === "over-300") return price > 300;

      return true;
    });
  }

  if (selectedSort === "price-low") {
    filteredComponents.sort(
      (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price),
    );
  }

  if (selectedSort === "price-high") {
    filteredComponents.sort(
      (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price),
    );
  }

  renderComponents(filteredComponents);
}

function applyFiltersFromUrl() {
  const pageParams = new URLSearchParams(window.location.search);
  const typeFromUrl = pageParams.get("type");

  if (typeFromUrl && typeFilter) {
    typeFilter.value = typeFromUrl;
  }

  filterComponents();
}

if (availabilityFilter)
  availabilityFilter.addEventListener("change", filterComponents);
if (typeFilter) typeFilter.addEventListener("change", filterComponents);
if (conditionFilter)
  conditionFilter.addEventListener("change", filterComponents);
if (priceFilter) priceFilter.addEventListener("change", filterComponents);
if (sortFilter) sortFilter.addEventListener("change", filterComponents);

if (resetFilters) {
  resetFilters.addEventListener("click", () => {
    if (availabilityFilter) availabilityFilter.value = "all";
    if (typeFilter) typeFilter.value = "all";
    if (conditionFilter) conditionFilter.value = "all";
    if (priceFilter) priceFilter.value = "all";
    if (sortFilter) sortFilter.value = "default";

    window.history.replaceState({}, document.title, "components.html");

    renderComponents(components);
  });
}

applyFiltersFromUrl();
