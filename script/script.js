const projectTrack = document.querySelector("#project-track");
const previousButton = document.querySelector("#previous-project");
const nextButton = document.querySelector("#next-project");
const projectItems = Array.from(projectTrack.querySelectorAll(".project-item"));
const projectDots = document.querySelector("#project-dots");
const currentProjectText = document.querySelector("#current-project");

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
    currentProjectText.textContent = `${currentIndex + 1} of ${projectItems.length}`;

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