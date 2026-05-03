document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Navbar Scroll Behavior ---
    const navbar = document.querySelector('.navbar');
    // Check if the navbar initially had the transparent class
    const isInitiallyTransparent = navbar ? navbar.classList.contains('transparent') : false;

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('transparent');
            } else {
                navbar.classList.remove('scrolled');
                // Only add the transparent class back if it was there originally
                if (isInitiallyTransparent) {
                    navbar.classList.add('transparent');
                }
            }
        });
        // trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }

    // --- 2. Scroll Animations (IntersectionObserver) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });

    // --- 3. Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Init theme from localStorage or default to light/dark
        const savedTheme = localStorage.getItem('bmw-theme') || (document.body.getAttribute('data-theme') || 'dark');
        document.body.setAttribute('data-theme', savedTheme);
        
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('bmw-theme', newTheme);
            
            // update icon if needed
            const icon = themeToggleBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        });
    }

    // --- 4. Models Catalog Filters ---
    const filterPills = document.querySelectorAll('.filter-pill');
    const modelCards = document.querySelectorAll('.model-card');
    if (filterPills.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const filterValue = pill.getAttribute('data-filter');
                modelCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 5. Comparison Tray Logic ---
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const compareTray = document.getElementById('compare-tray');
    const compareCount = document.getElementById('compare-count');
    stateCompareList = [];

    if (compareCheckboxes.length > 0 && compareTray) {
        compareCheckboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                const modelId = e.target.getAttribute('data-model');
                if (e.target.checked) {
                    stateCompareList.push(modelId);
                } else {
                    stateCompareList = stateCompareList.filter(id => id !== modelId);
                }

                if (stateCompareList.length >= 2) {
                    compareTray.classList.add('visible');
                    if (compareCount) compareCount.textContent = stateCompareList.length;
                } else {
                    compareTray.classList.remove('visible');
                }
            });
        });
    }

    // --- 6. Specification Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    }

    // --- 7. Image Gallery Switching & Color Configurator ---
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    const heroImg = document.getElementById('hero-img');
    if (thumbnails.length > 0 && heroImg) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newSrc = thumb.getAttribute('data-src');
                heroImg.src = newSrc;
                
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    const colorSwatches = document.querySelectorAll('.color-swatch');
    if (colorSwatches.length > 0 && heroImg) {
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const newSrc = swatch.getAttribute('data-image');
                if(newSrc) heroImg.src = newSrc;
                
                colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
        });
    }

    // --- 8. Dynamic Configuration Logic ---
    const catalogCards = document.querySelectorAll('.model-card');
    if (catalogCards.length > 0) {
        catalogCards.forEach(card => {
            const modelName = card.getAttribute('data-name');
            if (modelName) {
                const configUrl = `bmw_model_specifications.html?model=${encodeURIComponent(modelName)}`;
                
                // Update all existing links inside the card
                const links = card.querySelectorAll('a');
                links.forEach(link => link.href = configUrl);
                
                // Make the entire card clickable
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    // Don't trigger if they clicked an existing link (to allow middle-click, etc)
                    // or the wishlist button
                    if (!e.target.closest('a') && !e.target.closest('.wishlist-btn')) {
                        window.location.href = configUrl;
                    }
                });
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const modelParam = urlParams.get('model');
    if (modelParam && window.location.pathname.includes('bmw_model_specifications.html')) {
        const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23777">Image Coming Soon</text></svg>';
        
        const carData = {
            'bmw i7': {
                name: 'BMW i7 M70', tagline: '100% Electric Performance', price: '₹2.50 Cr', hp: '660', zero_sixty: '3.1s', range: '295 MI', img: 'front-I7.avif',
                gallery: { front: 'front-I7.avif', side: 'side-I7.avif', rear: 'rear-I7.avif', interior: 'interior-I7.avif' }
            },
            'bmw m4 competition': {
                name: 'BMW M4 Competition', tagline: 'High Performance Coupe', price: '₹1.85 Cr', hp: '503', zero_sixty: '3.4s', range: 'N/A', img: 'front-M4.avif',
                gallery: { front: 'front-M4.avif', side: 'side-M4.avif', rear: 'rear-M4.avif', interior: 'interior-M4.avif' }
            },
            'bmw x5 m': {
                name: 'BMW X5 M', tagline: 'Sports Activity Vehicle', price: '₹2.12 Cr', hp: '617', zero_sixty: '3.7s', range: 'N/A', img: 'front-X5.avif',
                gallery: { front: 'front-X5.avif', side: 'side-X5.avif', rear: 'rear-X5.avif', interior: 'interior-X5.avif' }
            },
            'bmw 3 series': {
                name: 'BMW 3 Series', tagline: 'Iconic Sports Sedan', price: '₹57.00 L', hp: '255', zero_sixty: '5.4s', range: 'N/A', img: 'front-3.avif',
                gallery: { front: 'front-3.avif', side: 'side-3.avif', rear: 'rear-3.avif', interior: 'interior-3.avif' }
            },
            'bmw i4 m50': {
                name: 'BMW i4 M50', tagline: 'Electric Performance', price: '₹1.19 Cr', hp: '536', zero_sixty: '3.7s', range: '271 MI', img: 'front-I4.avif',
                gallery: { front: 'front-I4.avif', side: 'side-I4.avif', rear: 'rear-I4.avif', interior: 'interior-I4.avif' }
            },
            'bmw ix': {
                name: 'BMW iX', tagline: 'Electric Vision', price: '₹1.39 Cr', hp: '516', zero_sixty: '4.4s', range: '311 MI', img: 'front-IX.avif',
                gallery: { front: 'front-IX.avif', side: 'side-IX.avif', rear: 'rear-IX.avif', interior: 'interior-IX.avif' }
            },
            'bmw x7': {
                name: 'BMW X7', tagline: 'Luxury SAV', price: '₹1.22 Cr', hp: '375', zero_sixty: '5.6s', range: 'N/A', img: 'front-X7.avif',
                gallery: { front: 'front-X7.avif', side: 'side-X7.avif', rear: 'rear-X7.avif', interior: 'interior-X7.avif' }
            },
            'bmw m8 gran coupe': {
                name: 'BMW M8 Gran Coupe', tagline: 'Ultimate Luxury Performance', price: '₹2.97 Cr', hp: '617', zero_sixty: '3.0s', range: 'N/A', img: 'front-M8.avif',
                gallery: { front: 'front-M8.avif', side: 'side-M8.jpg', rear: 'rear-M8.avif', interior: 'interior-M8.avif' }
            }
        };

        const data = carData[modelParam.toLowerCase()];
        if (data) {
            const h1 = document.querySelector('.product-info h1');
            if(h1) h1.textContent = data.name;
            const tagline = document.querySelector('.product-tagline');
            if(tagline) tagline.textContent = data.tagline;
            const price = document.querySelector('.product-price');
            if(price) price.textContent = `From ${data.price}`;
            
            const badges = document.querySelectorAll('.badge-val');
            if (badges.length >= 3) {
                badges[0].textContent = data.hp;
                badges[1].textContent = data.zero_sixty;
                badges[2].textContent = data.range.replace(' MI Range', '').replace(' MI', '');
            }

            const heroImg = document.getElementById('hero-img');
            if (heroImg) {
                heroImg.src = data.img;
            }

            // Update gallery thumbnails dynamically
            const galleryThumbs = document.querySelectorAll('.gallery-thumb');
            if (galleryThumbs.length === 4) {
                const views = ['front', 'side', 'rear', 'interior'];
                galleryThumbs.forEach((thumb, idx) => {
                    const view = views[idx];
                    const imgUrl = data.gallery[view] ? data.gallery[view] : PLACEHOLDER_IMG;
                    thumb.setAttribute('data-src', imgUrl);
                    thumb.src = imgUrl; 
                });
            }

            const purchModel = document.querySelector('.purchase-model');
            if(purchModel) purchModel.textContent = data.name;
            const purchPrice = document.querySelector('.purchase-price');
            if(purchPrice) purchPrice.textContent = `As shown: ${data.price}`;
            
            document.title = `${data.name} | Specifications`;
        }
    }
});

// --- 9. Landbot Livechat Integration ---
(function() {
    var script = document.createElement('script');
    script.type = 'module';
    script.async = true;
    script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';
    script.onload = function() {
        var myLandbot = new Landbot.Livechat({
            configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3416992-VME48XZQIRD8EJFD/index.json',
        });
    };
    document.head.appendChild(script);
})();
