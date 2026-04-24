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

  detailContainer.innerHTML = `
    <div class="info-card">
      <img
        class="build-image"
        src="${build.image}"
        alt="${build.name}"
        style="height: 360px; margin-bottom: 20px;"
      >

      <div class="eyebrow">${build.tier}</div>
      <h1>${build.name}</h1>

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
        <a class="btn btn-primary" href="contact.html">Contact About This Build</a>
        <a class="btn btn-secondary" href="builds.html">Back to Builds</a>
      </div>
    </div>
  `;
}
