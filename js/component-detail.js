const componentDetailContainer = document.getElementById("component-detail");
const params = new URLSearchParams(window.location.search);
const componentId = params.get("id");

async function loadComponents() {
  const response = await fetch(`data/components.json?v=${Date.now()}`);

  if (!response.ok) {
    throw new Error("Could not load components.json");
  }

  const data = await response.json();
  return data.components || [];
}

function getComponentImageAltText(component, imageNumber = null) {
  const brand = component.brand ? component.brand : "used";
  const type = component.type ? component.type : "PC component";
  const condition = component.condition ? component.condition : "tested";
  const imageLabel = imageNumber ? ` photo ${imageNumber}` : "";

  return `${brand} ${component.name}${imageLabel} ${condition} ${type} from usedGraphics`;
}

function renderComponentNotFound() {
  componentDetailContainer.innerHTML = `
    <div class="info-card">
      <h1>Component not found</h1>
      <p>This component may no longer be available.</p>
      <a class="btn btn-primary" href="components.html">Back to Components</a>
    </div>
  `;
}

function renderComponentDetail(component) {
  const componentStatus = component.status || "in-stock";
  const statusText = componentStatus === "sold" ? "Sold" : "In Stock";
  const statusClass =
    componentStatus === "sold" ? "status-sold" : "status-in-stock";

  const imageGallery =
    component.images && component.images.length
      ? component.images
      : [component.image];

  const details = component.details
    ? Object.entries(component.details)
        .map(([key, value]) => {
          if (!value) return "";

          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          return `<li><strong>${label}:</strong> ${value}</li>`;
        })
        .join("")
    : "";

  const thumbnails = imageGallery
    .map(
      (image, index) => `
        <button
          class="thumbnail-button ${index === 0 ? "active" : ""}"
          data-image="${image}"
          data-alt="${getComponentImageAltText(component, index + 1)}"
          type="button"
        >
          <img
            src="${image}"
            alt="${getComponentImageAltText(component, index + 1)} thumbnail"
          >
        </button>
      `,
    )
    .join("");

  componentDetailContainer.innerHTML = `
    <div class="info-card build-card ${
      componentStatus === "sold" ? "sold" : ""
    }">
      <img
        id="main-component-image"
        class="build-image build-detail-main-image"
        src="${imageGallery[0]}"
        alt="${getComponentImageAltText(component, 1)}"
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

      <div class="eyebrow">${component.type}</div>
      <h1>${component.name}</h1>

      <span class="detail-status ${statusClass}">
        ${statusText}
      </span>

      <h2>Component Information</h2>
      <p><strong>Availability:</strong> ${statusText}</p>
      <p><strong>Brand:</strong> ${component.brand}</p>
      <p><strong>Condition:</strong> ${component.condition}</p>
      <p><strong>Price:</strong> ${component.price}</p>
      <p>${component.description || ""}</p>

      ${
        details
          ? `
            <h2>Component Details</h2>
            <ul class="feature-list">${details}</ul>
          `
          : ""
      }

      <div class="button-row" style="margin-top: 20px;">
        <a class="btn btn-primary" href="contact.html">Contact About This Component</a>
        <a class="btn btn-secondary" href="components.html">Back to Components</a>
      </div>
    </div>
  `;

  const mainImage = document.getElementById("main-component-image");
  const thumbnailButtons = document.querySelectorAll(".thumbnail-button");

  thumbnailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainImage.src = button.dataset.image;
      mainImage.alt = button.dataset.alt;

      thumbnailButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

async function initComponentDetailPage() {
  if (!componentDetailContainer) {
    console.error("component-detail container not found");
    return;
  }

  try {
    const components = await loadComponents();
    const component = components.find((item) => item.id === componentId);

    if (!component) {
      renderComponentNotFound();
      return;
    }

    document.title = `${component.name} | usedGraphics`;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `View details for the ${component.name} from usedGraphics, including price, condition, availability, photos, specs, and tested PC hardware information.`,
      );

    renderComponentDetail(component);
  } catch (error) {
    console.error(error);
    renderComponentNotFound();
  }
}

initComponentDetailPage();
