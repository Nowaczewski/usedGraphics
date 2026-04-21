const builds = [
  {
    tier: "Performance Tier",
    name: "RTX 3060 Ti Gaming Build",
    image: "images/build-1.jpg",
    price: "$850",
    fps: "120 FPS @ 1080p",
    specs: {
      cpu: "i7-9700K",
      gpu: "RTX 3060 Ti",
      motherboard: "MSI Z390 Gaming Plus",
      memory: "16GB DDR4",
      storage: "1TB NVMe SSD",
      cooling: "Corsair AIO",
      psu: "Thermaltake 650W PSU",
      case: "SAMA V40"
    },
    games: [
      "Fortnite at 85 FPS Performance Mode",
      "Battlefield 6 at 80 FPS Performance Mode"
    ]
  }
];

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
