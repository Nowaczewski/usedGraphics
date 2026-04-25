const detailContainer = document.getElementById("build-detail");
const params = new URLSearchParams(window.location.search);
const buildId = params.get("id");

const build = builds.find((item) => item.id === buildId);

if (!build) {
  detailContainer.innerHTML = `
    <div class="info-card">
      <h1>Build not found</h1>
      <p>This build may no longer be available.</p>
      <a class="btn btn-primary" href="builds.html">Back to Builds</a>
    </div>
  `;
} else {
  const buildStatus = build.status || "in-stock";
  const statusText = buildStatus === "sold" ? "Sold" : "In Stock";
  const statusClass =
    buildStatus === "sold" ? "status-sold" : "status-in-stock";

  const imageGallery =
    build.images && build.images.length ? build.images : [build.image];

  const specLabels = {
    cpu: "CPU",
    gpu: "GPU",
    motherboard: "Motherboard",
    memory: "Memory",
    storage: "Storage",
    cooling: "Cooling",
    psu: "PSU",
    case: "Case",
  };

  const specs = Object.entries(build.specs)
    .map(([key, value]) => {
      const label = specLabels[key] || key;
      return `<li><strong>${label}:</strong> ${value}</li>`;
    })
    .join("");

  const games = build.games
    ? build.games.map((game) => `<li>${game}</li>`).join("")
    : "";

  const youtubeButton =
    build.youtube && build.youtube.trim() !== ""
      ? `
      <a class="btn btn-secondary" href="${build.youtube}" target="_blank">
        Watch Build Video
      </a>
    `
      : "";

  const thumbnails = imageGallery
    .map(
      (image, index) => `
        <button
          class="thumbnail-button ${index === 0 ? "active" : ""}"
          data-image="${image}"
          type="button"
        >
          <img src="${image}" alt="${build.name} angle ${index + 1}">
        </button>
      `,
    )
    .join("");

  detailContainer.innerHTML = `
    <div class="info-card build-card ${buildStatus === "sold" ? "sold" : ""}">
      <img
        id="main-build-image"
        class="build-image build-detail-main-image"
        src="${imageGallery[0]}"
        alt="${build.name}"
      >

      ${
        imageGallery.length > 1
          ? `
            <div class="build-thumbnails">
              ${thumbnails}
            </div>
          `
          : ""
      }

      <div class="eyebrow">${build.tier}</div>
      <h1>${build.name}</h1>

      <span class="detail-status ${statusClass}">
        ${statusText}
      </span>

      <p><strong>Availability:</strong> ${statusText}</p>
      <p><strong>Price:</strong> ${build.price}</p>
      <p><strong>Performance:</strong> ${build.fps}</p>
      <p>${build.description || ""}</p>

      <h2>Full Specs</h2>
      <ul class="feature-list">${specs}</ul>

      ${
        games
          ? `
            <h2>Games Tested</h2>
            <ul class="feature-list">${games}</ul>
          `
          : ""
      }

      <div class="button-row" style="margin-top: 20px;">
        ${youtubeButton}
        <a class="btn btn-primary" href="contact.html">Contact About This Build</a>
        <a class="btn btn-secondary" href="builds.html">Back to Builds</a>
      </div>
    </div>
  `;

  const mainImage = document.getElementById("main-build-image");
  const thumbnailButtons = document.querySelectorAll(".thumbnail-button");

  function updateMainImageDisplay() {
    mainImage.classList.remove("portrait");

    if (mainImage.naturalHeight > mainImage.naturalWidth) {
      mainImage.classList.add("portrait");
    }
  }

  mainImage.addEventListener("load", updateMainImageDisplay);

  if (mainImage.complete) {
    updateMainImageDisplay();
  }

  thumbnailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainImage.src = button.dataset.image;

      thumbnailButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
}
