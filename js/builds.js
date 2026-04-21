function createBuildTile(build) {
  const specOrder = [
    ["CPU", "cpu"],
    ["GPU", "gpu"],
    ["Motherboard", "motherboard"],
    ["Memory", "memory"],
    ["Storage", "storage"],
    ["Cooling", "cooling"],
    ["PSU", "psu"],
    ["Case", "case"]
  ];

  const specsList = specOrder.map(([label, key]) => {
    if (!build.specs[key]) return "";
    return `<li><strong>${label}:</strong> ${build.specs[key]}</li>`;
  }).join("");

  const gamesList = build.games.map(game => `<li>${game}</li>`).join("");

  return `
    <article class="card">
      <div class="card-body">
        <div class="eyebrow">${build.tier}</div>
        <h3>${build.name}</h3>
        <img class="build-image" src="${build.image}" alt="${build.name}">
        <p><strong>Price:</strong> ${build.price}</p>
        <p><strong>Performance:</strong> ${build.fps}</p>

        <p><strong>Specs:</strong></p>
        <ul class="feature-list">
          ${specsList}
        </ul>

        <p><strong>Games Tested:</strong></p>
        <ul class="feature-list">
          ${gamesList}
        </ul>
      </div>
    </article>
  `;
}

const container = document.getElementById("pc-container");

if (container) {
  container.innerHTML = builds.map(build => createBuildTile(build)).join("");
} else {
  console.error("pc-container not found");
}
