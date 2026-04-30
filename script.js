/**
 * ELIJAH GRAPHICS - Portfolio Logic
 */

// --- Pricing Modal Logic (Projects Page) ---
const pricingModal = document.getElementById("pricingModal");

const openPricingModal = () => {
    if (pricingModal) {
        pricingModal.style.display = "flex";
        pricingModal.style.opacity = "1";
        document.body.style.overflow = 'hidden';
    }
};

const closePricingModal = (event) => {
    if (!event || event.target.id === "pricingModal" || event.target.classList.contains("close-pricing")) {
        if (pricingModal) {
            pricingModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }
};

// --- Gallery Preview Logic (Projects Page) ---
const gallery = document.getElementById("gallery");
const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImg");
let allImages = [];
let currentImageIndex = 0;

/**
 * PERMANENT BRAND WORK
 * To make your work visible on Netlify:
 * 1. Put your images in your folder (e.g., a folder named 'assets').
 * 2. Add the paths to this array.
 */
const staticWork = [
    // 'assets/branding-1.jpg',
    // 'assets/logo-design.png',
];

const initGallery = () => {
    const savedImages = JSON.parse(localStorage.getItem("images")) || [];
    if (gallery) {
        gallery.innerHTML = "";
        allImages = [...staticWork, ...savedImages];
        allImages.forEach(src => {
            const container = document.createElement("div");
            const img = document.createElement("img");
            img.src = src;
            img.onclick = (e) => {
                e.stopPropagation();
                currentImageIndex = allImages.indexOf(src);
                if (preview) {
                    preview.style.display = "flex";
                    previewImg.src = src;
                }
            };
            container.appendChild(img);
            gallery.appendChild(container);
        });
    }
};

const closePreview = (event) => {
    if (!event || event.target.id === "preview" || event.target.classList.contains("close-btn")) {
        if (preview) preview.style.display = "none";
    }
};

const nextImage = (event) => {
    if (event) event.stopPropagation();
    if (allImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        previewImg.src = allImages[currentImageIndex];
    }
};

const previousImage = (event) => {
    if (event) event.stopPropagation();
    if (allImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        previewImg.src = allImages[currentImageIndex];
    }
};

// --- Contact Form Logic (Contact Page) ---
function submitComment(event) {
    event.preventDefault();
    const form = event.target;
    const status = document.getElementById("statusMessage");
    if (!form) return;

    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
        status.textContent = "Please complete all fields.";
        status.style.color = "#ffde17";
        return;
    }

    const whatsappMessage = encodeURIComponent(`Hello ELIJAH GRAPHICS,\n\nMy name is ${name} (${email}).\n\nProject Details:\n${message}`);
    const whatsappUrl = `https://wa.me/254729300816?text=${whatsappMessage}`;

    window.open(whatsappUrl, '_blank');
    status.textContent = "Redirecting to WhatsApp...";
    status.style.color = "#00f2ff";
}

// --- Scroll Reveal Logic ---
const initScrollReveal = () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appeared');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    initGallery();
    initScrollReveal();
    
    // Keyboard support for gallery
    document.addEventListener("keydown", (e) => {
        if (preview && preview.style.display === "flex") {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") previousImage();
            if (e.key === "Escape") closePreview();
        }
    });
});