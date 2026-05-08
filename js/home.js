async function loadBuilds() {
  const response = await fetch(`data/builds.json?v=${Date.now()}`);

  if (!response.ok) {
    throw new Error("Could not load builds.json");
  }

  const data = await response.json();
  return data.builds || [];
}

function getBuildImageAltText(build) {
  const gpu = build.specs && build.specs.gpu ? build.specs.gpu : "gaming PC";
  const cpu = build.specs && build.specs.cpu ? build.specs.cpu : "custom PC";

  return `${build.name} used gaming PC build with ${gpu} and ${cpu} from usedGraphics`;
}

function createHomeBuildTile(build) {
  const detailLink = `build-detail.html?id=${build.id}`;

  return `
    <article class="card">
      <a href="${detailLink}">
        <img
          class="build-image"
          src="${build.image}"
          alt="${getBuildImageAltText(build)}"
        >
      </a>

      <div class="card-body">
        <div class="eyebrow">${build.tier}</div>

        <h3>
          <a href="${detailLink}">${build.name}</a>
        </h3>

        <ul class="feature-list">
          ${
            build.specs && build.specs.cpu
              ? `<li><strong>CPU:</strong> ${build.specs.cpu}</li>`
              : ""
          }
          ${
            build.specs && build.specs.gpu
              ? `<li><strong>GPU:</strong> ${build.specs.gpu}</li>`
              : ""
          }
          ${
            build.specs && build.specs.motherboard
              ? `<li><strong>Motherboard:</strong> ${build.specs.motherboard}</li>`
              : ""
          }
          ${
            build.specs && build.specs.memory
              ? `<li><strong>Memory:</strong> ${build.specs.memory}</li>`
              : ""
          }
        </ul>

        <p><strong>Performance:</strong> ${build.fps || "Contact for details"}</p>
        <p><strong>Price:</strong> ${build.price || "Contact for price"}</p>
      </div>
    </article>
  `;
}

async function initHomeBuilds() {
  const homeContainer = document.getElementById("home-builds-container");

  if (!homeContainer) {
    console.error("home-builds-container not found");
    return;
  }

  try {
    const builds = await loadBuilds();
    const latestThreeBuilds = builds.slice(-3).reverse();

    homeContainer.innerHTML = latestThreeBuilds
      .map((build) => createHomeBuildTile(build))
      .join("");
  } catch (error) {
    console.error(error);

    homeContainer.innerHTML = `
      <div class="info-card">
        <h2 class="panel-title">Unable to load featured builds</h2>
        <p>Please check back soon.</p>
      </div>
    `;
  }
}

initHomeBuilds();
