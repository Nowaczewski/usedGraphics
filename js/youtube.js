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

  return `${build.name} YouTube gaming PC build video featuring ${gpu} and ${cpu} from usedGraphics`;
}

function createYoutubeBuildTile(build) {
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

        <div class="button-row" style="margin-top: 12px;">
          <a class="btn btn-secondary" href="${detailLink}">View Full Build</a>
        </div>
      </div>
    </article>
  `;
}

async function initYoutubeBuilds() {
  const youtubeContainer = document.getElementById("youtube-builds-container");

  if (!youtubeContainer) {
    console.error("youtube-builds-container not found");
    return;
  }

  try {
    const builds = await loadBuilds();

    const latestThreeBuilds = builds.slice(-3).reverse();

    if (!latestThreeBuilds.length) {
      youtubeContainer.innerHTML = `
        <div class="info-card">
          <h2 class="panel-title">No builds found</h2>
          <p>Check back soon for builds in progress.</p>
        </div>
      `;
      return;
    }

    youtubeContainer.innerHTML = latestThreeBuilds
      .map((build) => createYoutubeBuildTile(build))
      .join("");
  } catch (error) {
    console.error(error);

    youtubeContainer.innerHTML = `
      <div class="info-card">
        <h2 class="panel-title">Unable to load builds</h2>
        <p>Please check back soon.</p>
      </div>
    `;
  }
}

initYoutubeBuilds();
