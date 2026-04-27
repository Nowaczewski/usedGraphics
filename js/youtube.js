function createYoutubeBuildTile(build) {
  const detailLink = `build-detail.html?id=${build.id}`;

  return `
    <article class="card">
      <a href="${detailLink}">
        <img class="build-image" src="${build.image}" alt="${build.name}">
      </a>

      <div class="card-body">
        <div class="eyebrow">${build.tier}</div>

        <h3>
          <a href="${detailLink}">${build.name}</a>
        </h3>

        <ul class="feature-list">
          ${build.specs.cpu ? `<li><strong>CPU:</strong> ${build.specs.cpu}</li>` : ""}
          ${build.specs.gpu ? `<li><strong>GPU:</strong> ${build.specs.gpu}</li>` : ""}
          ${build.specs.motherboard ? `<li><strong>Motherboard:</strong> ${build.specs.motherboard}</li>` : ""}
          ${build.specs.memory ? `<li><strong>Memory:</strong> ${build.specs.memory}</li>` : ""}
        </ul>

        <p><strong>Performance:</strong> ${build.fps}</p>
        <p><strong>Price:</strong> ${build.price}</p>

        <div class="button-row" style="margin-top: 12px;">
          <a class="btn btn-secondary" href="${detailLink}">View Full Build</a>
        </div>
      </div>
    </article>
  `;
}

const youtubeContainer = document.getElementById("youtube-builds-container");

if (youtubeContainer) {
  const latestThreeBuilds = builds.slice(-3).reverse();
  youtubeContainer.innerHTML = latestThreeBuilds
    .map((build) => createYoutubeBuildTile(build))
    .join("");
} else {
  console.error("youtube-builds-container not found");
}
