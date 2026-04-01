document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("js-ready");

	const year = document.getElementById("year");
	if (year) {
		year.textContent = new Date().getFullYear();
	}

	const setCopyState = (button, text) => {
		if (!button.dataset.defaultLabel) {
			button.dataset.defaultLabel = button.textContent.trim();
		}

		button.textContent = text;
		button.classList.add("is-success");

		window.setTimeout(() => {
			button.textContent = button.dataset.defaultLabel;
			button.classList.remove("is-success");
		}, 1800);
	};

	const fallbackCopy = (value) => {
		const helper = document.createElement("textarea");
		helper.value = value;
		helper.setAttribute("readonly", "");
		helper.style.left = "-9999px";
		helper.style.position = "absolute";
		document.body.appendChild(helper);
		helper.select();
		document.execCommand("copy");
		document.body.removeChild(helper);
	};

	document.querySelectorAll("[data-copy-email]").forEach((button) => {
		button.addEventListener("click", async () => {
			const email = button.getAttribute("data-copy-email");
			if (!email) {
				return;
			}

			try {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(email);
				} else {
					fallbackCopy(email);
				}

				setCopyState(button, "Email copied");
			} catch (error) {
				setCopyState(button, "Copy failed");
			}
		});
	});

	const printButton = document.querySelector("[data-print-resume]");
	if (printButton) {
		printButton.addEventListener("click", () => window.print());
	}

	const filterButtons = document.querySelectorAll("[data-filter]");
	const projectCards = document.querySelectorAll(".project-card[data-tags]");

	if (filterButtons.length > 0 && projectCards.length > 0) {
		const applyFilter = (filterValue) => {
			projectCards.forEach((card) => {
				const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
				const visible = filterValue === "all" || tags.includes(filterValue);
				card.classList.toggle("is-hidden", !visible);
			});

			filterButtons.forEach((button) => {
				const isActive = button.getAttribute("data-filter") === filterValue;
				button.classList.toggle("is-active", isActive);
				button.setAttribute("aria-pressed", isActive ? "true" : "false");
			});
		};

		filterButtons.forEach((button) => {
			button.addEventListener("click", () => {
				applyFilter(button.getAttribute("data-filter") || "all");
			});
		});

		applyFilter("all");
	}

	const revealTargets = document.querySelectorAll(".reveal");
	if (revealTargets.length > 0) {
		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver(
				(entries, activeObserver) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							return;
						}

						entry.target.classList.add("is-visible");
						activeObserver.unobserve(entry.target);
					});
				},
				{ threshold: 0.16 }
			);

			revealTargets.forEach((target) => observer.observe(target));
		} else {
			revealTargets.forEach((target) => target.classList.add("is-visible"));
		}
	}

	const lightbox = document.querySelector("[data-lightbox]");
	if (lightbox) {
		const dialogImage = lightbox.querySelector("img");
		const closeButton = lightbox.querySelector("[data-lightbox-close]");
		const triggers = document.querySelectorAll(".lightbox-trigger");

		const closeLightbox = () => {
			lightbox.hidden = true;
			document.body.classList.remove("is-lightbox-open");

			if (dialogImage) {
				dialogImage.removeAttribute("src");
				dialogImage.removeAttribute("alt");
			}
		};

		const openLightbox = (src, alt) => {
			if (!dialogImage || !src) {
				return;
			}

			dialogImage.src = src;
			dialogImage.alt = alt || "";
			lightbox.hidden = false;
			document.body.classList.add("is-lightbox-open");
		};

		triggers.forEach((trigger) => {
			trigger.addEventListener("click", () => {
				openLightbox(
					trigger.getAttribute("data-lightbox-image"),
					trigger.getAttribute("data-lightbox-alt")
				);
			});
		});

		if (closeButton) {
			closeButton.addEventListener("click", closeLightbox);
		}

		lightbox.addEventListener("click", (event) => {
			if (event.target === lightbox) {
				closeLightbox();
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && !lightbox.hidden) {
				closeLightbox();
			}
		});
	}
});
