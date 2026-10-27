// Suman Raj J Portfolio — interactions and Java backend integration

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });
        nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }));
    }

    // Smooth scroll for in-page navigation
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
            }
        });
    });

    // Reveal content as it enters the viewport
    const revealItems = document.querySelectorAll(".skill-card, .education-card, .project-card, .contact-card, .about-content");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show", "is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => { item.classList.add("reveal-on-scroll"); revealObserver.observe(item); });
    } else {
        revealItems.forEach(item => item.classList.add("is-visible", "show"));
    }

    // Highlight the navigation item for the current section
    const sections = document.querySelectorAll("section[id]");
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll(".navbar a").forEach(link => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                    });
                }
            });
        }, { rootMargin: "-35% 0px -55% 0px" });
        sections.forEach(section => sectionObserver.observe(section));
    }

    // Current year in footer without duplicating the existing copyright
    const copyright = document.querySelector(".copyright");
    if (copyright) copyright.textContent = `© ${new Date().getFullYear()} Suman Raj J. All Rights Reserved.`;

    // Submit contact form to the Java Spring Boot API
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const submitButton = document.getElementById("sendMessageBtn");
    if (form && status && submitButton) {
        form.addEventListener("submit", async event => {
            event.preventDefault();
            status.textContent = "Sending your message…";
            status.classList.remove("error");
            submitButton.disabled = true;
            try {
                const data = Object.fromEntries(new FormData(form).entries());
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(result.message || "Could not send the message. Please check the fields and try again.");
                status.textContent = result.message || "Message sent successfully. Thank you!";
                form.reset();
            } catch (error) {
                status.textContent = error.message || "Could not connect to the server. Make sure the Java backend is running.";
                status.classList.add("error");
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});
