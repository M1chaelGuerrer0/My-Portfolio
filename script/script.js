const projectTrack = document.querySelector("#project-track");
const previousButton = document.querySelector("#previous-project");
const nextButton = document.querySelector("#next-project");
const projectItems = Array.from(projectTrack.querySelectorAll(".project-item"));
const projectDots = document.querySelector("#project-dots");
const currentProjectText = document.querySelector("#current-project");
const navToggle = document.querySelector("#nav-toggle");
const navLinks = document.querySelector("#nav-links");
const projectMedia = Array.from(
    document.querySelectorAll(".project-video, .project-item .column-wide img")
);

navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
    }
});

function toggleMediaZoom(media) {
    const isZoomed = !media.classList.contains("is-zoomed");

    projectMedia.forEach((projectMediaItem) => {
        projectMediaItem.classList.remove("is-zoomed");
        projectMediaItem.setAttribute("aria-pressed", "false");
    });

    if (isZoomed) {
        media.classList.add("is-zoomed");
        media.setAttribute("aria-pressed", "true");
    }

    document.body.classList.toggle("has-zoomed-media", isZoomed);
}

projectMedia.forEach((media) => {
    const mediaType = media instanceof HTMLVideoElement ? "video" : "image";

    media.tabIndex = 0;
    media.setAttribute("role", "button");
    media.setAttribute("aria-label", `Toggle zoom for project ${mediaType}`);
    media.setAttribute("aria-pressed", "false");
    media.addEventListener("click", () => toggleMediaZoom(media));
    media.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMediaZoom(media);
        }
    });
});

document.addEventListener("click", (event) => {
    const zoomedMedia = projectMedia.find((media) =>
        media.classList.contains("is-zoomed")
    );

    if (zoomedMedia && !zoomedMedia.contains(event.target)) {
        toggleMediaZoom(zoomedMedia);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const zoomedMedia = projectMedia.find((media) =>
            media.classList.contains("is-zoomed")
        );

        if (zoomedMedia) {
            toggleMediaZoom(zoomedMedia);
        }
    }
});

const dotButtons = projectItems.map((project, index) => {
    const button = document.createElement("button");
    const title = project.querySelector("h3").textContent.trim();

    button.className = "project-dot";
    button.type = "button";
    button.setAttribute("aria-label", `Show project ${index + 1}: ${title}`);
    button.addEventListener("click", () => {
        projectTrack.scrollTo({
            left: index * projectTrack.clientWidth,
            behavior: "smooth"
        });
    });
    projectDots.append(button);

    return button;
});

function updateProjectButtons() {
    const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
    const currentIndex = Math.min(
        Math.round(projectTrack.scrollLeft / projectTrack.clientWidth),
        projectItems.length - 1
    );

    previousButton.hidden = projectTrack.scrollLeft <= 1;
    nextButton.hidden = projectTrack.scrollLeft >= maxScroll - 1;
    currentProjectText.textContent = `${currentIndex + 1} of ${projectItems.length} projects`;

    dotButtons.forEach((button, index) => {
        const isCurrent = index === currentIndex;
        button.classList.toggle("is-current", isCurrent);
        button.setAttribute("aria-pressed", String(isCurrent));
    });
}

nextButton.addEventListener("click", () => {
    projectTrack.scrollBy({
        left: projectTrack.clientWidth,
        behavior: "smooth"
    });
});

previousButton.addEventListener("click", () => {
    projectTrack.scrollBy({
        left: -projectTrack.clientWidth,
        behavior: "smooth"
    });
});

projectTrack.addEventListener("scroll", updateProjectButtons);
window.addEventListener("resize", updateProjectButtons);

updateProjectButtons();