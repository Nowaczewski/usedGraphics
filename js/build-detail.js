const detailContainer = document.getElementById("build-detail");
const params = new URLSearchParams(window.location.search);
const buildId = params.get("id");

const siteUrl = "https://usedgraphics.com";

async function loadBuilds() {
  const response = await fetch(`data/builds.json?v=${Date.now()}`);

  if (!response.ok) {
    throw new Error("Could not load builds.json");
  }

  const data = await response.json();
  return data.builds || [];
}

function getBuildImageAltText(build, imageNumber = null) {
  const gpu = build.specs && build.specs.gpu ? build.specs.gpu : "gaming PC";
  const cpu = build.specs && build.specs.cpu ? build.specs.cpu : "custom PC";
  const imageLabel = imageNumber ? ` photo ${imageNumber}` : "";

  return `${build.name}${imageLabel} showing a used gaming PC build with ${gpu} and ${cpu} from usedGraphics`;
}

function getAbsoluteUrl(path) {
  if (!path) return siteUrl;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}/${path.replace(/^\/+/, "")}`;
}

function getNumericPrice(price) {
  if (typeof price === "number") return price;

  const numericPrice = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : undefined;
}

function getAvailabilitySchema(status) {
  return status === "sold"
    ? "https://schema.org/SoldOut"
    : "https://schema.org/InStock";
}

function addBuildSchema(build) {
  const buildStatus = build.status || "in-stock";
  const imageGallery =
    build.images && build.images.length ? build.images : [build.image];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}/build-detail.html?id=${build.id}#product`,
    name: build.name,
    description:
      build.description ||
      `${build.name} used gaming PC build from usedGraphics with tested hardware, pricing, and gaming performance information.`,
    image: imageGallery.filter(Boolean).map((image) => getAbsoluteUrl(image)),
    brand: {
      "@type": "Brand",
      name: "usedGraphics",
    },
    category: "Used Gaming PC",
    url: `${siteUrl}/build-detail.html?id=${build.id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: getNumericPrice(build.price),
      availability: getAvailabilitySchema(buildStatus),
      itemCondition: "https://schema.org/UsedCondition",
      url: `${siteUrl}/build-detail.html?id=${build.id}`,
      seller: {
        "@type": "Organization",
        name: "usedGraphics",
        url: siteUrl,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Tier",
        value: build.tier || "",
      },
      {
        "@type": "PropertyValue",
        name: "Performance",
        value: build.fps || "",
      },
      {
        "@type": "PropertyValue",
        name: "CPU",
        value: build.specs && build.specs.cpu ? build.specs.cpu : "",
      },
      {
        "@type": "PropertyValue",
        name: "GPU",
        value: build.specs && build.specs.gpu ? build.specs.gpu : "",
      },
      {
        "@type": "PropertyValue",
        name: "Motherboard",
        value:
          build.specs && build.specs.motherboard ? build.specs.motherboard : "",
      },
      {
        "@type": "PropertyValue",
        name: "Memory",
        value: build.specs && build.specs.memory ? build.specs.memory : "",
      },
      {
        "@type": "PropertyValue",
        name: "Storage",
        value: build.specs && build.specs.storage ? build.specs.storage : "",
      },
      {
        "@type": "PropertyValue",
        name: "Cooling",
        value: build.specs && build.specs.cooling ? build.specs.cooling : "",
      },
      {
        "@type": "PropertyValue",
        name: "Power Supply",
        value: build.specs && build.specs.psu ? build.specs.psu : "",
      },
      {
        "@type": "PropertyValue",
        name: "Case",
        value: build.specs && build.specs.case ? build.specs.case : "",
      },
    ].filter((property) => property.value),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Builds",
        item: `${siteUrl}/builds.html`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: build.name,
        item: `${siteUrl}/build-detail.html?id=${build.id}`,
      },
    ],
  };

  const existingSchema = document.getElementById("build-product-schema");

  if (existingSchema) {
    existingSchema.remove();
  }

  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  schemaScript.id = "build-product-schema";
  schemaScript.textContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [productSchema, breadcrumbSchema],
    },
    null,
    2,
  );

  document.head.appendChild(schemaScript);
}

function renderBuildNotFound() {
  detailContainer.innerHTML = `
    <div class="info-card">
      <h1>Build not found</h1>
      <p>This build may no longer be available.</p>
      <a class="btn btn-primary" href="builds.html">Back to Builds</a>
    </div>
  `;
}

function renderBuildDetail(build) {
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

  const specs = build.specs
    ? Object.entries(build.specs)
        .map(([key, value]) => {
          if (!value) return "";
          const label = specLabels[key] || key;
          return `<li><strong>${label}:</strong> ${value}</li>`;
        })
        .join("")
    : "";

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
          data-alt="${getBuildImageAltText(build, index + 1)}"
          type="button"
        >
          <img
            src="${image}"
            alt="${getBuildImageAltText(build, index + 1)} thumbnail"
          >
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
        alt="${getBuildImageAltText(build, 1)}"
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

      <h2>Build Information</h2>
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
      mainImage.alt = button.dataset.alt;

      thumbnailButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

async function initBuildDetailPage() {
  if (!detailContainer) {
    console.error("build-detail container not found");
    return;
  }

  try {
    const builds = await loadBuilds();
    const build = builds.find((item) => item.id === buildId);

    if (!build) {
      renderBuildNotFound();
      return;
    }

    document.title = `${build.name} Gaming PC Build | usedGraphics`;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `View details for the ${build.name} from usedGraphics, including price, availability, full specs, gaming performance, photos, and tested hardware information.`,
      );

    addBuildSchema(build);
    renderBuildDetail(build);
  } catch (error) {
    console.error(error);
    renderBuildNotFound();
  }
}

initBuildDetailPage();
