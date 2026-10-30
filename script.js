/* ===================================================
   GreenBite — Vanilla JavaScript
   Interactive elements: cart, search, calorie calc,
   smooth scroll, scroll animations
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Shopping Cart System ────────────────────────────
  const cartBtn = document.getElementById('cart-btn');
  const cartCountEl = document.getElementById('cart-count');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawerClose = document.getElementById('cart-drawer-close');
  const cartDrawerBody = document.getElementById('cart-drawer-body');
  const cartDrawerFooter = document.getElementById('cart-drawer-footer');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

  // Load from localStorage or initialize
  let cart = [];
  try {
    const saved = localStorage.getItem('greenbite_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem('greenbite_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  function openCart() {
    renderCart();
    if (cartDrawer) {
      cartDrawer.classList.add('active');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
    if (cartOverlay) {
      cartOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('active');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
    if (cartOverlay) {
      cartOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  // Open / Close events
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function formatMoney(amount) {
    return amount.toLocaleString('vi-VN') + ' ₫';
  }

  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Header Badge
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
      cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
      cartCountEl.style.animation = 'none';
      cartCountEl.offsetHeight; // trigger reflow
      cartCountEl.style.animation = 'pulse 0.4s ease';
    }

    // Update Drawer Header Badge
    if (cartDrawerCount) {
      cartDrawerCount.textContent = `(${totalItems})`;
    }

    if (!cartDrawerBody) return;

    // Empty Cart View
    if (cart.length === 0) {
      cartDrawerBody.innerHTML = `
        <div class="cart-drawer__empty">
          <div class="cart-drawer__empty-icon">🛒</div>
          <h3 class="cart-drawer__empty-title">Giỏ hàng của bạn đang trống</h3>
          <p class="cart-drawer__empty-desc">
            Hãy khám phá các sản phẩm hạt dinh dưỡng, granola & biscotti tươi ngon từ GreenBite nhé!
          </p>
          <button class="cart-drawer__empty-btn" id="cart-continue-btn">
            Khám phá sản phẩm ngay ➔
          </button>
        </div>
      `;
      if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';

      const continueBtn = document.getElementById('cart-continue-btn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          closeCart();
          const target = document.querySelector('#products');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
      return;
    }

    // Cart with items
    if (cartDrawerFooter) cartDrawerFooter.style.display = 'flex';

    cartDrawerBody.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item__img" onerror="this.src='images/granola.jpg'">
        <div class="cart-item__info">
          <div>
            <h4 class="cart-item__title" title="${item.title}">${item.title}</h4>
            <div class="cart-item__price">${formatMoney(item.price)}</div>
          </div>
          <div class="cart-item__actions">
            <div class="cart-item__qty-ctrl">
              <button class="cart-item__qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Giảm số lượng">−</button>
              <span class="cart-item__qty-val">${item.quantity}</span>
              <button class="cart-item__qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Tăng số lượng">+</button>
            </div>
            <button class="cart-item__remove-btn btn-remove-item" data-id="${item.id}" aria-label="Xóa sản phẩm">
              🗑️ Xóa
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Update Totals
    if (cartSubtotal) cartSubtotal.textContent = formatMoney(totalPrice);
    if (cartTotal) cartTotal.textContent = formatMoney(totalPrice);

    // Bind item buttons
    cartDrawerBody.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        updateItemQuantity(id, -1);
      });
    });

    cartDrawerBody.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        updateItemQuantity(id, 1);
      });
    });

    cartDrawerBody.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        removeItem(id);
      });
    });
  }

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
    showToast(`Đã thêm "${product.title}" vào giỏ hàng! 🛒`);
  }

  function updateItemQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    if (item) {
      showToast(`Đã xóa "${item.title}" khỏi giỏ hàng!`);
    }
  }

  // ─── Add to Cart Buttons on Product Cards ──────────
  document.querySelectorAll('.product-card__add-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.product-card');
      if (!card) return;

      const titleEl = card.querySelector('.product-card__title');
      const priceEl = card.querySelector('.product-card__price-current');
      const imgEl = card.querySelector('.product-card__image img');

      const title = titleEl ? titleEl.textContent.trim() : 'Sản phẩm GreenBite';
      const priceText = priceEl ? priceEl.textContent.trim() : '0';
      const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
      const image = imgEl ? imgEl.getAttribute('src') : 'images/granola.jpg';
      const id = this.id || title.toLowerCase().replace(/[^\w]/g, '-');

      const originalText = this.innerHTML;
      this.classList.add('added');
      this.innerHTML = '✓ Đã thêm';

      addToCart({ id, title, price, image });

      setTimeout(() => {
        this.classList.remove('added');
        this.innerHTML = originalText;
      }, 1500);
    });
  });

  // ─── Checkout Button ────────────────────────────────
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Giỏ hàng đang trống! Vui lòng chọn sản phẩm.');
        return;
      }

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      showToast(`🎉 Đặt hàng thành công ${totalItems} món (${formatMoney(totalPrice)})! GreenBite sẽ giao trong 2H.`);
      cart = [];
      saveCart();
      renderCart();

      setTimeout(() => {
        closeCart();
      }, 1800);
    });
  }

  // ─── Toast Notification ─────────────────────────────
  const toast = document.getElementById('toast');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Expose Cart API globally for calo.html and other modules
  window.GreenBiteCart = {
    openCart,
    closeCart,
    addToCart,
    renderCart,
    updateItemQuantity,
    removeItem
  };
  window.showGreenBiteToast = showToast;

  // ─── Header Scroll Effect ──────────────────────────
  const header = document.querySelector('.header');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky header shadow
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top button
    if (scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // ─── Scroll to Top ─────────────────────────────────
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Smooth Scroll for Nav Links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });

        // Close mobile menu if open
        navList.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
      }
    });
  });

  // ─── Mobile Menu Toggle ────────────────────────────
  const mobileToggle = document.getElementById('mobile-toggle');
  const navList = document.getElementById('nav-list');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navList.classList.toggle('mobile-open');
  });

  // ─── Search Overlay ────────────────────────────────
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
  });

  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('active');
      closeCart();
    }
  });

  // ─── Calorie Calculator ────────────────────────────
  const calcForm = document.getElementById('calc-form');
  const calcResult = document.getElementById('calc-result');
  const calcNumber = document.getElementById('calc-number');
  const calcRecommendation = document.getElementById('calc-recommendation');

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const gender = document.getElementById('calc-gender').value;
    const age = parseInt(document.getElementById('calc-age').value);
    const weight = parseFloat(document.getElementById('calc-weight').value);
    const height = parseFloat(document.getElementById('calc-height').value);
    const activity = document.getElementById('calc-activity').value;

    if (!age || !weight || !height) {
      showToast('Vui lòng điền đầy đủ thông tin! ⚠️');
      return;
    }

    // Harris-Benedict formula for BMR
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = Math.round(bmr * (multipliers[activity] || 1.2));
    calcNumber.textContent = tdee.toLocaleString('vi-VN');

    // Product recommendations based on calorie needs
    let recommendations = [];
    if (tdee < 1800) {
      recommendations = [
        { icon: '🥣', text: 'Granola Siêu Hạt Mật Ong — 1 phần/ngày (320 kcal)' },
        { icon: '🍪', text: 'Bánh Biscotti Nguyên Cám — 2 miếng/ngày (180 kcal)' },
        { icon: '🥜', text: 'Hạt Macca Tây Nguyên — 5 hạt/ngày (100 kcal)' },
      ];
    } else if (tdee < 2400) {
      recommendations = [
        { icon: '🥣', text: 'Granola Siêu Hạt Mật Ong — 1.5 phần/ngày (480 kcal)' },
        { icon: '🍫', text: 'Energy Bar Dinh Dưỡng — 1 thanh/ngày (220 kcal)' },
        { icon: '🍯', text: 'Bơ Hạnh Nhân Thuần Chay — 1 muỗng/ngày (95 kcal)' },
        { icon: '🍪', text: 'Bánh Biscotti Nguyên Cám — 2 miếng/ngày (180 kcal)' },
      ];
    } else {
      recommendations = [
        { icon: '🥣', text: 'Yến Mạch Cán Dẹt + Granola — 1 bát bữa sáng (420 kcal)' },
        { icon: '🍫', text: 'Energy Bar Dinh Dưỡng — 2 thanh/ngày (440 kcal)' },
        { icon: '🥜', text: 'Hạt Macca Sấy Nứt Vỏ — 8 hạt/ngày (160 kcal)' },
        { icon: '🍯', text: 'Bơ Hạnh Nhân Thuần Chay — 2 muỗng/ngày (190 kcal)' },
      ];
    }

    calcRecommendation.innerHTML = `
      <h4>🌿 Gợi ý combo GreenBite cho bạn:</h4>
      ${recommendations.map(r => `
        <div class="calc-result__product">
          <span>${r.icon}</span>
          <span>${r.text}</span>
        </div>
      `).join('')}
    `;

    calcResult.classList.add('active');
    calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // ─── Scroll Animations (Intersection Observer) ─────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ─── Product Card Wishlist ─────────────────────────
  document.querySelectorAll('.product-card__wishlist').forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('hearted');
      if (this.classList.contains('hearted')) {
        this.innerHTML = '❤️';
        this.style.background = 'rgba(230, 57, 70, 0.1)';
        showToast('Đã thêm vào danh sách yêu thích! ❤️');
      } else {
        this.innerHTML = '🤍';
        this.style.background = 'rgba(255,255,255,0.9)';
      }
    });
  });

  // ─── Active Nav Link on Scroll ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveNav() {
    const scrollY = window.scrollY + 120;
    const caloSectionIds = ['calculator', 'tdee-calc', 'builder', 'nutrition-facts', 'meal-plans'];

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (caloSectionIds.includes(id) && link.getAttribute('href') === '#calculator') {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);
  setActiveNav();

  // ─── Initialize ────────────────────────────────────
  renderCart();
});
