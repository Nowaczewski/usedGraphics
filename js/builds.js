let builds = [];

async function loadBuilds() {
  const response = await fetch(`data/builds.json?v=${Date.now()}`);

  if (!response.ok) {
    throw new Error("Could not load builds.json");
  }

  const data = await response.json();
  return data.builds || [];
}

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

function normalizeTier(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getBuildImageAltText(build) {
  const gpu = build.specs && build.specs.gpu ? build.specs.gpu : "gaming PC";
  const cpu = build.specs && build.specs.cpu ? build.specs.cpu : "custom PC";

  return `${build.name} used gaming PC build with ${gpu} and ${cpu} from usedGraphics`;
}

function createBuildTile(build) {
  const specOrder = [
    ["CPU", "cpu"],
    ["GPU", "gpu"],
    ["Memory", "memory"],
    ["Storage", "storage"],
  ];

  const specsList = specOrder
    .map(([label, key]) => {
      if (!build.specs || !build.specs[key]) return "";
      return `<li><strong>${label}:</strong> ${build.specs[key]}</li>`;
    })
    .join("");

  const detailLink = `build-detail.html?id=${build.id}`;

  const buildStatus = normalizeValue(build.status || "in-stock");
  const statusText = buildStatus === "sold" ? "Sold" : "In Stock";
  const statusClass =
    buildStatus === "sold" ? "status-sold" : "status-in-stock";

  return `
    <article class="card build-card ${buildStatus === "sold" ? "sold" : ""}">
      <a href="${detailLink}" class="build-image-wrap">
        <img
          class="build-image"
          src="${build.image}"
          alt="${getBuildImageAltText(build)}"
        >
        <span class="status-badge ${statusClass}">
          ${statusText}
        </span>
      </a>

      <div class="card-body">
        <div class="eyebrow">${build.tier}</div>

        <h3>
          <a href="${detailLink}">${build.name}</a>
        </h3>

        <p><strong>Availability:</strong> ${statusText}</p>
        <p><strong>Price:</strong> ${build.price}</p>
        <p><strong>Performance:</strong> ${build.fps}</p>

        <p><strong>Specs:</strong></p>
        <ul class="feature-list">
          ${specsList}
        </ul>

        <div class="button-row" style="margin-top: 12px;">
          <a class="btn btn-secondary" href="${detailLink}">View Full Build</a>
          <a class="btn btn-primary" href="contact.html">Contact</a>
        </div>
      </div>
    </article>
  `;
}

const container = document.getElementById("pc-container");

const availabilityFilter = document.getElementById("availability-filter");
const tierFilter = document.getElementById("tier-filter");
const priceFilter = document.getElementById("price-filter");
const performanceFilter = document.getElementById("performance-filter");
const sortFilter = document.getElementById("sort-filter");
const resetFilters = document.getElementById("reset-filters");

function getNumericPrice(price) {
  if (typeof price === "number") return price;
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function getNumericFps(fps) {
  if (typeof fps === "number") return fps;
  const match = String(fps).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function renderBuilds(buildList) {
  if (!container) {
    console.error("pc-container not found");
    return;
  }

  if (!buildList.length) {
    container.innerHTML = `
      <div class="info-card">
        <h2 class="panel-title">No builds found</h2>
        <p>Try changing your filters or check back when more systems are listed.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = buildList
    .map((build) => createBuildTile(build))
    .join("");
}

function filterBuilds() {
  let filteredBuilds = [...builds];

  const selectedAvailability = availabilityFilter
    ? normalizeValue(availabilityFilter.value)
    : "all";

  const selectedTier = tierFilter ? normalizeTier(tierFilter.value) : "all";
  const selectedPrice = priceFilter ? priceFilter.value : "all";
  const selectedPerformance = performanceFilter
    ? normalizeValue(performanceFilter.value)
    : "all";
  const selectedSort = sortFilter ? sortFilter.value : "default";

  if (selectedAvailability !== "all") {
    filteredBuilds = filteredBuilds.filter((build) => {
      const buildStatus = normalizeValue(build.status || "in-stock");
      return buildStatus === selectedAvailability;
    });
  }

  if (selectedTier !== "all") {
    filteredBuilds = filteredBuilds.filter(
      (build) => normalizeTier(build.tier) === selectedTier,
    );
  }

  if (selectedPrice !== "all") {
    filteredBuilds = filteredBuilds.filter((build) => {
      const price = getNumericPrice(build.price);

      if (selectedPrice === "under-500") return price < 500;
      if (selectedPrice === "500-750") return price >= 500 && price <= 750;
      if (selectedPrice === "750-1000") return price >= 750 && price <= 1000;
      if (selectedPrice === "over-1000") return price > 1000;

      return true;
    });
  }

  if (selectedPerformance !== "all") {
    filteredBuilds = filteredBuilds.filter((build) =>
      normalizeValue(build.fps).includes(selectedPerformance),
    );
  }

  if (selectedSort === "price-low") {
    filteredBuilds.sort(
      (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price),
    );
  }

  if (selectedSort === "price-high") {
    filteredBuilds.sort(
      (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price),
    );
  }

  if (selectedSort === "fps-high") {
    filteredBuilds.sort((a, b) => getNumericFps(b.fps) - getNumericFps(a.fps));
  }

  renderBuilds(filteredBuilds);
}

function applyFiltersFromUrl() {
  const pageParams = new URLSearchParams(window.location.search);
  const tierFromUrl = pageParams.get("tier");

  if (tierFromUrl && tierFilter) {
    tierFilter.value = tierFromUrl;
  }

  filterBuilds();
}

if (availabilityFilter)
  availabilityFilter.addEventListener("change", filterBuilds);
if (tierFilter) tierFilter.addEventListener("change", filterBuilds);
if (priceFilter) priceFilter.addEventListener("change", filterBuilds);
if (performanceFilter)
  performanceFilter.addEventListener("change", filterBuilds);
if (sortFilter) sortFilter.addEventListener("change", filterBuilds);

if (resetFilters) {
  resetFilters.addEventListener("click", () => {
    if (availabilityFilter) availabilityFilter.value = "all";
    if (tierFilter) tierFilter.value = "all";
    if (priceFilter) priceFilter.value = "all";
    if (performanceFilter) performanceFilter.value = "all";
    if (sortFilter) sortFilter.value = "default";

    window.history.replaceState({}, document.title, "builds.html");

    filterBuilds();
  });
}

async function initBuildsPage() {
  try {
    builds = await loadBuilds();
    applyFiltersFromUrl();
  } catch (error) {
    console.error(error);

    if (container) {
      container.innerHTML = `
        <div class="info-card">
          <h2 class="panel-title">Unable to load builds</h2>
          <p>Please check back soon.</p>
        </div>
      `;
    }
  }
}

initBuildsPage();
