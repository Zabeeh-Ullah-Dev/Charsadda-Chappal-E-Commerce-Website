(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     Product Catalog Data
     Authentic Charsadda & Peshawari Footwear Collections
     -------------------------------------------------------------------------- */
  const products = [
    {
      id: 'charsadda-royal-black',
      name: 'The Charsadda Royal',
      color: 'Jet Black',
      subtitle: 'Double vegetable-tanned cowhide with signature Charsadda point.',
      price: 5990,
      category: 'classic',
      tag: 'KHURO FLAGSHIP',
      image: 'assets/chappal-black-charsadda.png'
    },
    {
      id: 'peshawar-vintage-earth',
      name: 'The Peshawar Earth',
      color: 'Dark Tan',
      subtitle: 'Rich walnut patina finish with hand-burnished edges.',
      price: 8500,
      category: 'classic',
      tag: 'HERITAGE CUT',
      image: 'assets/chappal-black-norozi.png'
    },
    {
      id: 'mandani-honey-tan',
      name: 'The Mandani Tan',
      color: 'Honey Tan',
      subtitle: 'Supple golden undertones with traditional twin-needle saddle stitch.',
      price: 6990,
      category: 'classic',
      tag: 'EVERYDAY CLASSIC',
      image: 'assets/chappal-black-norozi-single.png'
    },
    {
      id: 'zalmi-mahogany-deep',
      name: 'The Zalmi Double-Sole',
      color: 'Deep Mahogany',
      subtitle: 'Reinforced dual-tier tyre sole for imposing stance and durability.',
      price: 6500,
      category: 'classic',
      tag: 'CRAFT MASTERPIECE',
      image: 'assets/chappal-zalmi-camel.jpg'
    },
    {
      id: 'modern-saddle-cross',
      name: 'The Saddle Nomad',
      color: 'Burnished Tan',
      subtitle: 'Lightweight contemporary cut with cushioned ergonomic arch.',
      price: 5990,
      category: 'modern',
      tag: 'CONTEMPORARY',
      image: 'assets/chappal-mustard-charsadda.png'
    },
    {
      id: 'norozi-golden-ochre',
      name: 'The Norozi Ochre',
      color: 'Sunlit Ochre',
      subtitle: 'Distinctive curved buckle closure crafted with brass rivets.',
      price: 7500,
      category: 'modern',
      tag: 'MODERN FORM',
      image: 'assets/chappal-brown-vibram.png'
    },
    {
      id: 'urban-traveller-noir',
      name: 'The Urban Traveller',
      color: 'Matte Charcoal',
      subtitle: 'Supple milled leather upper tailored for modern wardrobe versatility.',
      price: 8500,
      category: 'modern',
      tag: 'URBAN SERIES',
      image: 'assets/chappal-mustard-norozi.jpg'
    },
    {
      id: 'kaptaan-signature-walnut',
      name: 'The Kaptaan Executive',
      color: 'Polished Walnut',
      subtitle: 'Formal high-shine toe profile designed for ceremonial wear.',
      price: 7500,
      category: 'modern',
      tag: 'LIMITED BESPOKE',
      image: 'assets/chappal-black-patent.jpg'
    }
  ];

  const SIZES = ['39', '40', '41', '42', '43', '44', '45'];

  /* --------------------------------------------------------------------------
     DOM References & Utilities
     -------------------------------------------------------------------------- */
  const byId = id => document.getElementById(id);
  const productGrid = byId('product-grid');
  const searchInput = byId('product-search');
  const sortSelect = byId('product-sort');
  const cartDrawer = byId('cart-drawer');
  const quickViewModal = byId('quick-view');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let activeCategory = 'all';
  let modalActiveProduct = null;
  let spotlightQuantity = 1;
  let toastTimer = null;

  // LocalStorage Helpers
  function getStored(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Gracefully handle privacy modes */
    }
  }

  let cart = getStored('khuro_cart').filter(item => 
    item && products.some(p => p.id === item.id) && SIZES.includes(String(item.size))
  );

  let wishlist = new Set(getStored('khuro_wishlist').filter(id => 
    products.some(p => p.id === id)
  ));

  function formatMoney(amount) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function createSizeOptions(selected = '') {
    return `
      <option value="">Size (EU)</option>
      ${SIZES.map(s => `<option value="${s}" ${String(s) === String(selected) ? 'selected' : ''}>EU ${s}</option>`).join('')}
    `;
  }

  /* --------------------------------------------------------------------------
     Product Catalog Rendering
     -------------------------------------------------------------------------- */
  function renderProductCard(product, index) {
    const isWished = wishlist.has(product.id);
    return `
      <article class="product-card" style="--item-idx: ${index}" data-id="${product.id}">
        <div class="card-media-box">
          <img src="${product.image}" alt="${escapeHTML(product.name)} in ${escapeHTML(product.color)}" loading="lazy" width="340" height="340">
          <span class="card-tag-badge">${escapeHTML(product.tag)}</span>
          <button class="card-wishlist-btn ${isWished ? 'is-active' : ''}" type="button" data-wish="${product.id}" aria-label="${isWished ? 'Remove from wishlist' : 'Save to wishlist'}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="card-quickview-btn" type="button" data-quick="${product.id}">Quick View</button>
        </div>
        <div class="card-details-box">
          <div class="card-title-row">
            <h3 class="card-product-name">${escapeHTML(product.name)}</h3>
            <span class="card-product-price">${formatMoney(product.price)}</span>
          </div>
          <p class="card-product-sub">${escapeHTML(product.subtitle)}</p>
          <div class="card-action-row">
            <select class="card-size-select" aria-label="Select size for ${escapeHTML(product.name)}">
              ${createSizeOptions()}
            </select>
            <button class="card-add-btn" type="button" data-add="${product.id}">
              Add to Bag
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function getFilteredProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let list = products.filter(product => {
      const matchesCategory = 
        activeCategory === 'all' || 
        (activeCategory === 'featured' ? product.id === 'charsadda-royal-black' : product.category === activeCategory);

      const matchesSearch = !query || 
        `${product.name} ${product.color} ${product.subtitle} ${product.tag}`.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortSelect.value === 'low') list.sort((a, b) => a.price - b.price);
    if (sortSelect.value === 'high') list.sort((a, b) => b.price - a.price);
    if (sortSelect.value === 'newest') list.reverse();

    return list;
  }

  function updateCatalog() {
    const filtered = getFilteredProducts();
    productGrid.innerHTML = filtered.map(renderProductCard).join('');
    byId('results-count').textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'pair' : 'pairs'}`;

    const isEmpty = filtered.length === 0;
    byId('empty-results').hidden = !isEmpty;
    productGrid.hidden = isEmpty;

    const hasFiltersActive = activeCategory !== 'all' || searchInput.value.trim() !== '' || sortSelect.value !== 'featured';
    byId('clear-filters').hidden = !hasFiltersActive;
  }

  /* --------------------------------------------------------------------------
     Cart Management & Drawer
     -------------------------------------------------------------------------- */
  function getCartItemCount() {
    return cart.reduce((total, item) => total + (item.qty || 1), 0);
  }

  function renderCartDrawer() {
    const count = getCartItemCount();
    byId('cart-count').textContent = count;
    byId('drawer-count').textContent = `(${count})`;

    const cartEmpty = count === 0;
    byId('cart-empty').hidden = !cartEmpty;
    byId('drawer-foot').hidden = cartEmpty;

    const itemsContainer = byId('cart-items');
    itemsContainer.innerHTML = cart.map(line => {
      const product = products.find(p => p.id === line.id);
      if (!product) return '';
      const lineSubtotal = product.price * line.qty;

      return `
        <article class="cart-line-item">
          <div class="cart-line-thumb">
            <img src="${product.image}" alt="${escapeHTML(product.name)}" width="70" height="70" loading="lazy">
          </div>
          <div class="cart-line-info">
            <h4>${escapeHTML(product.name)}</h4>
            <div class="cart-line-meta">${escapeHTML(product.color)} • Size: EU ${line.size}</div>
            <div class="cart-line-controls">
              <button class="line-qty-btn" type="button" data-qty-change="-1" data-id="${line.id}" data-size="${line.size}" aria-label="Decrease quantity">−</button>
              <span class="line-qty-val">${line.qty}</span>
              <button class="line-qty-btn" type="button" data-qty-change="1" data-id="${line.id}" data-size="${line.size}" aria-label="Increase quantity">+</button>
              <button class="line-remove-btn" type="button" data-remove-line="${line.id}|${line.size}">Remove</button>
            </div>
          </div>
          <div class="cart-line-price">${formatMoney(lineSubtotal)}</div>
        </article>
      `;
    }).join('');

    const grandTotal = cart.reduce((sum, line) => {
      const p = products.find(item => item.id === line.id);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);

    byId('cart-subtotal').textContent = formatMoney(grandTotal);
    setStored('khuro_cart', cart);
  }

  function openCartDrawer() {
    document.body.classList.add('cart-open');
    cartDrawer.inert = false;
    cartDrawer.setAttribute('aria-hidden', 'false');
    byId('cart-close').focus();
  }

  function closeCartDrawer() {
    document.body.classList.remove('cart-open');
    cartDrawer.inert = true;
    cartDrawer.setAttribute('aria-hidden', 'true');
    byId('cart-open').focus();
  }

  function showToast(title, message) {
    const toast = byId('cart-toast');
    byId('cart-toast-title').textContent = title;
    byId('cart-toast-message').textContent = message;

    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     Cart Animations: Fly-to-Cart, Sparkles, & Button Success Morph
     -------------------------------------------------------------------------- */
  function triggerSparkles(btn) {
    if (!btn || prefersReducedMotion.matches) return;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('span');
      particle.className = 'cart-sparkle-particle';
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 28;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  }

  function triggerButtonSuccess(btn) {
    if (!btn) return;
    const originalContent = btn.innerHTML;
    btn.classList.add('btn-added-success');
    btn.innerHTML = '<span class="btn-check-icon">✓</span> Added!';

    setTimeout(() => {
      btn.classList.remove('btn-added-success');
      btn.innerHTML = originalContent;
    }, 1400);
  }

  function triggerCartImpact() {
    const triggerBtn = byId('cart-open');
    if (!triggerBtn) return;
    triggerBtn.classList.remove('has-impact');
    void triggerBtn.offsetWidth; // Force reflow
    triggerBtn.classList.add('has-impact');
    setTimeout(() => triggerBtn.classList.remove('has-impact'), 650);
  }

  function triggerFlyToCartAnimation(sourceImg, triggerBtn, onComplete) {
    const cartBtn = byId('cart-open');
    if (prefersReducedMotion.matches || !cartBtn) {
      if (onComplete) onComplete();
      return;
    }

    const startElem = sourceImg || triggerBtn;
    if (!startElem) {
      if (onComplete) onComplete();
      return;
    }

    const startRect = startElem.getBoundingClientRect();
    const destRect = cartBtn.getBoundingClientRect();

    if (startRect.width === 0 || destRect.width === 0) {
      if (onComplete) onComplete();
      return;
    }

    // Determine initial image source
    let imgSrc = '';
    if (sourceImg && sourceImg.tagName === 'IMG') {
      imgSrc = sourceImg.src;
    } else if (sourceImg && sourceImg.querySelector('img')) {
      imgSrc = sourceImg.querySelector('img').src;
    }

    const clone = document.createElement('div');
    clone.className = 'fly-to-cart-clone';

    const startSize = Math.min(startRect.width, 110);
    const startX = startRect.left + (startRect.width - startSize) / 2;
    const startY = startRect.top + (startRect.height - startSize) / 2;

    clone.style.left = `${startX}px`;
    clone.style.top = `${startY}px`;
    clone.style.width = `${startSize}px`;
    clone.style.height = `${startSize}px`;

    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = '';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.padding = '8px';
      clone.appendChild(img);
    }

    document.body.appendChild(clone);

    const targetX = destRect.left + destRect.width / 2 - startSize / 2;
    const targetY = destRect.top + destRect.height / 2 - startSize / 2;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.14) rotate(15deg)`;
        clone.style.opacity = '0.3';
      });
    });

    setTimeout(() => {
      clone.remove();
      triggerCartImpact();
      if (onComplete) onComplete();
    }, 720);
  }

  function addItemToCart(productId, size, quantity = 1, triggerBtn = null, sourceImg = null) {
    if (!SIZES.includes(String(size))) return false;

    const existingIndex = cart.findIndex(item => item.id === productId && String(item.size) === String(size));
    if (existingIndex > -1) {
      cart[existingIndex].qty += quantity;
    } else {
      cart.push({ id: productId, size: String(size), qty: quantity });
    }

    // Trigger visual button animations
    triggerButtonSuccess(triggerBtn);
    triggerSparkles(triggerBtn);

    const product = products.find(p => p.id === productId);

    // Launch flying item animation
    triggerFlyToCartAnimation(sourceImg, triggerBtn, () => {
      renderCartDrawer();
      showToast(`${product.name} (EU ${size})`, `Added ${quantity} pair to your bag`);
    });

    return true;
  }

  /* --------------------------------------------------------------------------
     Quick View Modal
     -------------------------------------------------------------------------- */
  function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalActiveProduct = product;
    const modalContent = byId('quick-view-content');

    modalContent.innerHTML = `
      <div class="quick-modal-grid">
        <div class="quick-modal-media">
          <img src="${product.image}" alt="${escapeHTML(product.name)}" width="360" height="360">
        </div>
        <div class="quick-modal-body">
          <span class="modal-tag">${escapeHTML(product.tag)}</span>
          <h2 id="quick-title" class="modal-title">${escapeHTML(product.name)}</h2>
          <div class="modal-price">${formatMoney(product.price)}</div>
          <p class="modal-desc">${escapeHTML(product.subtitle)} Handcrafted in Charsadda with vegetable-tanned genuine leather and rugged tyre-rubber sole.</p>
          
          <div class="modal-size-select-wrap">
            <label for="modal-size-picker">Select Your Size</label>
            <select id="modal-size-picker">
              ${createSizeOptions()}
            </select>
            <span class="field-error-hint" id="modal-size-error"></span>
          </div>

          <button class="btn btn-primary" id="modal-add-btn" type="button">
            Add to Shopping Bag
          </button>
        </div>
      </div>
    `;

    if (!quickViewModal.open) {
      quickViewModal.showModal();
    }
  }

  function closeQuickView() {
    if (quickViewModal.open) {
      quickViewModal.close();
    }
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */
  function setupEventListeners() {
    // Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-pressed', 'true');

        activeCategory = pill.dataset.filter;
        updateCatalog();
      });
    });

    // Category Card Triggers
    document.querySelectorAll('.filter-pill-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const filterVal = trigger.dataset.filter;
        const matchingPill = document.querySelector(`.filter-pill[data-filter="${filterVal}"]`);
        if (matchingPill) matchingPill.click();

        byId('collection').scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    // Search & Sort Inputs
    searchInput.addEventListener('input', updateCatalog);
    sortSelect.addEventListener('change', updateCatalog);

    function resetFilters() {
      activeCategory = 'all';
      searchInput.value = '';
      sortSelect.value = 'featured';
      const allPill = document.querySelector('.filter-pill[data-filter="all"]');
      if (allPill) allPill.click();
    }

    byId('clear-filters').addEventListener('click', resetFilters);
    byId('empty-clear').addEventListener('click', resetFilters);

    // Search Toggle in Header
    document.querySelectorAll('.search-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        byId('collection').scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
        setTimeout(() => searchInput.focus(), 400);
      });
    });

    // Product Grid Delegate (Wishlist, Quick View, Add to Bag)
    productGrid.addEventListener('click', event => {
      // Wishlist toggle
      const wishBtn = event.target.closest('[data-wish]');
      if (wishBtn) {
        const pid = wishBtn.dataset.wish;
        if (wishlist.has(pid)) {
          wishlist.delete(pid);
          wishBtn.classList.remove('is-active');
        } else {
          wishlist.add(pid);
          wishBtn.classList.add('is-active');
        }
        setStored('khuro_wishlist', [...wishlist]);
        return;
      }

      // Quick View
      const quickBtn = event.target.closest('[data-quick]');
      if (quickBtn) {
        openQuickView(quickBtn.dataset.quick);
        return;
      }

      // Add to Bag
      const addBtn = event.target.closest('[data-add]');
      if (addBtn) {
        const card = addBtn.closest('.product-card');
        const sizeSelect = card.querySelector('.card-size-select');
        const chosenSize = sizeSelect.value;

        if (!chosenSize) {
          sizeSelect.classList.add('has-error');
          sizeSelect.focus();
          setTimeout(() => sizeSelect.classList.remove('has-error'), 1200);
          return;
        }

        addItemToCart(addBtn.dataset.add, chosenSize, 1, addBtn, card.querySelector('.card-media-box img'));
      }
    });

    // Cart Drawer Controls
    byId('cart-open').addEventListener('click', openCartDrawer);
    byId('cart-close').addEventListener('click', closeCartDrawer);
    byId('drawer-scrim').addEventListener('click', closeCartDrawer);
    byId('continue-shopping').addEventListener('click', () => {
      closeCartDrawer();
      byId('collection').scrollIntoView({
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });

    // Cart Items Delegate (Quantity change & Remove)
    byId('cart-items').addEventListener('click', event => {
      const qtyBtn = event.target.closest('[data-qty-change]');
      if (qtyBtn) {
        const delta = parseInt(qtyBtn.dataset.qtyChange, 10);
        const { id, size } = qtyBtn.dataset;
        const line = cart.find(item => item.id === id && String(item.size) === String(size));
        if (line) {
          line.qty += delta;
          if (line.qty <= 0) {
            cart = cart.filter(item => item !== line);
          }
          renderCartDrawer();
        }
        return;
      }

      const removeBtn = event.target.closest('[data-remove-line]');
      if (removeBtn) {
        const [id, size] = removeBtn.dataset.removeLine.split('|');
        cart = cart.filter(item => !(item.id === id && String(item.size) === String(size)));
        renderCartDrawer();
      }
    });

    // Checkout demo button
    byId('checkout-btn').addEventListener('click', () => {
      alert('Thank you for choosing KHURO! This concept checkout preserves your cart in local storage. For orders, contact us directly via WhatsApp at +92 307 0509981.');
    });

    // Quick View Modal Delegate
    quickViewModal.querySelector('.modal-close-btn').addEventListener('click', closeQuickView);
    quickViewModal.addEventListener('click', event => {
      if (event.target === quickViewModal) closeQuickView();
    });

    byId('quick-view-content').addEventListener('click', event => {
      const modalAdd = event.target.closest('#modal-add-btn');
      if (modalAdd && modalActiveProduct) {
        const sizePicker = byId('modal-size-picker');
        const errHint = byId('modal-size-error');
        if (!sizePicker.value) {
          errHint.textContent = 'Please choose a size to proceed.';
          sizePicker.focus();
          return;
        }
        errHint.textContent = '';
        const modalImg = byId('quick-view-content').querySelector('.quick-modal-media img');
        addItemToCart(modalActiveProduct.id, sizePicker.value, 1, modalAdd, modalImg);
        setTimeout(closeQuickView, 400);
      }
    });

    // Signature Spotlight Section Controls
    document.querySelectorAll('[data-quantity]').forEach(btn => {
      btn.addEventListener('click', () => {
        const isPlus = btn.dataset.quantity === 'plus';
        spotlightQuantity = Math.max(1, Math.min(10, spotlightQuantity + (isPlus ? 1 : -1)));
        byId('spotlight-quantity').value = spotlightQuantity;
        byId('spotlight-quantity').textContent = spotlightQuantity;
      });
    });

    byId('spotlight-add').addEventListener('click', () => {
      const sizeSelect = byId('spotlight-size');
      const errHint = byId('spotlight-size-message');

      if (!sizeSelect.value) {
        errHint.textContent = 'Please choose your EU shoe size.';
        sizeSelect.focus();
        return;
      }

      errHint.textContent = '';
      const spotlightBtn = byId('spotlight-add');
      const spotlightImg = document.querySelector('.spotlight-img-card img');
      addItemToCart('charsadda-royal-black', sizeSelect.value, spotlightQuantity, spotlightBtn, spotlightImg);
    });

    byId('spotlight-size').addEventListener('change', () => {
      byId('spotlight-size-message').textContent = '';
    });

    byId('size-guide-open').addEventListener('click', () => {
      alert('KHURO Size Guide:\nEU 39 = UK 6 / US 7 (24.5 cm)\nEU 40 = UK 7 / US 8 (25.5 cm)\nEU 41 = UK 7.5 / US 8.5 (26.0 cm)\nEU 42 = UK 8 / US 9 (26.5 cm)\nEU 43 = UK 9 / US 10 (27.5 cm)\nEU 44 = UK 9.5 / US 10.5 (28.0 cm)\nEU 45 = UK 10.5 / US 11.5 (29.0 cm)');
    });

    // Mobile Navigation Toggle
    const menuBtn = byId('menu-toggle');
    const primaryNav = byId('primary-nav');

    function toggleMenu(forceClose = false) {
      const isOpen = forceClose ? false : menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      primaryNav.classList.toggle('is-open', isOpen);
    }

    menuBtn.addEventListener('click', () => toggleMenu());
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Newsletter Submission
    byId('newsletter-form').addEventListener('submit', event => {
      event.preventDefault();
      const emailInput = byId('newsletter-email');
      const msg = byId('newsletter-message');

      msg.classList.remove('is-error');
      if (!emailInput.validity.valid || !emailInput.value.trim()) {
        msg.textContent = 'Please enter a valid email address.';
        msg.classList.add('is-error');
        emailInput.focus();
        return;
      }

      msg.textContent = 'Thank you for subscribing! Welcome to the KHURO Circle.';
      emailInput.value = '';
    });

    // Floating Back to Top Button
    const bttBtn = byId('back-to-top');
    bttBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });

    // Header Scroll State & Back-to-Top Visibility
    let scrollScheduled = false;
    window.addEventListener('scroll', () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          byId('top').classList.toggle('is-scrolled', scrollY > 20);
          bttBtn.classList.toggle('is-visible', scrollY > 500);
          scrollScheduled = false;
        });
      }
    }, { passive: true });

    // Escape Key Handler for Overlays
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (document.body.classList.contains('cart-open')) closeCartDrawer();
        if (quickViewModal.open) closeQuickView();
        toggleMenu(true);
      }
    });
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  function init() {
    updateCatalog();
    renderCartDrawer();
    setupEventListeners();

    const yearSpan = byId('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // Execute on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
