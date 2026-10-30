/* ===================================================
   GreenBite — Calorie & Nutrition Calculator Engine
   Interactive Meal Builder, Nutrition Facts, Macro Tracker
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Nutrition Database (per 100g) ────────────────
  const PRODUCTS_DB = [
    {
      id: 'granola',
      title: 'Granola Siêu Hạt Mật Ong',
      category: 'Granola',
      weightInfo: '350g',
      price: 120000,
      image: 'images/granola.jpg',
      isGreenBiteProduct: true,
      portionLabel: 'g',
      defaultPortion: 45,
      minPortion: 20,
      maxPortion: 120,
      step: 5,
      tags: ['eat-clean', 'high-protein'],
      per100g: {
        calories: 478,
        protein: 16.0,
        carbs: 48.9,
        fat: 25.6,
        fiber: 10.7
      },
      benefits: [
        'Hạt óc chó & hạnh nhân dồi dào Omega-3',
        'Yến mạch nguyên cám giàu chất xơ Beta-Glucan',
        'Vị ngọt thanh từ mật ong hoa nhãn nguyên chất'
      ]
    },
    {
      id: 'biscotti',
      title: 'Bánh Biscotti Nguyên Cám',
      category: 'Biscotti',
      weightInfo: '250g',
      price: 95000,
      image: 'images/biscotti.jpg',
      isGreenBiteProduct: true,
      portionLabel: 'g',
      defaultPortion: 30,
      minPortion: 15,
      maxPortion: 90,
      step: 5,
      tags: ['eat-clean'],
      per100g: {
        calories: 433,
        protein: 18.3,
        carbs: 60.0,
        fat: 14.0,
        fiber: 10.3
      },
      benefits: [
        '100% Bột mì nguyên cám, no lâu giảm cảm giác thèm ăn',
        'Hạnh nhân lát giòn rụm & quả nam việt quất',
        'Không bơ sữa công nghiệp, không đường tinh luyện'
      ]
    },
    {
      id: 'energy-bar',
      title: 'Thanh Hạt Dinh Dưỡng Energy Bar',
      category: 'Energy Bar',
      weightInfo: '10 thanh',
      price: 150000,
      image: 'images/energy_bar.jpg',
      isGreenBiteProduct: true,
      portionLabel: 'thanh (35g)',
      defaultPortion: 35,
      minPortion: 35,
      maxPortion: 140,
      step: 35,
      tags: ['high-protein', 'eat-clean'],
      per100g: {
        calories: 471,
        protein: 24.3,
        carbs: 42.8,
        fat: 23.4,
        fiber: 10.8
      },
      benefits: [
        'Nạp năng lượng cấp tốc trước & sau khi tập luyện',
        'Bổ sung Protein Isolate tự nhiên từ hạt hữu cơ',
        'Tiện lợi mang đi làm, đi tập, đi du lịch'
      ]
    },
    {
      id: 'macadamia',
      title: 'Hạt Macca Sấy Nứt Vỏ Tây Nguyên',
      category: 'Hạt Dinh Dưỡng',
      weightInfo: '500g',
      price: 185000,
      image: 'images/macadamia.jpg',
      isGreenBiteProduct: true,
      portionLabel: 'g',
      defaultPortion: 30,
      minPortion: 15,
      maxPortion: 90,
      step: 5,
      tags: ['vegan-keto', 'eat-clean'],
      per100g: {
        calories: 718,
        protein: 7.9,
        carbs: 13.8,
        fat: 75.8,
        fiber: 8.6
      },
      benefits: [
        'Giàu axit béo không bão hòa đơn tốt cho tim mạch',
        'Hương vị bùi béo tự nhiên, chuẩn ăn kiêng Keto',
        'Chứa nhiều chất chống oxy hóa và khoáng chất quý'
      ]
    },
    {
      id: 'almond-butter',
      title: 'Bơ Hạt Hạnh Nhân Thuần Chay',
      category: 'Bơ Hạt Organic',
      weightInfo: '250g',
      price: 135000,
      image: 'images/almond_butter.jpg',
      isGreenBiteProduct: true,
      portionLabel: 'g (thìa)',
      defaultPortion: 20,
      minPortion: 10,
      maxPortion: 60,
      step: 5,
      tags: ['vegan-keto', 'high-protein'],
      per100g: {
        calories: 610,
        protein: 24.0,
        carbs: 18.0,
        fat: 52.0,
        fiber: 11.0
      },
      benefits: [
        '100% Hạt hạnh nhân Mỹ xay mịn nguyên chất',
        'Không phụ gia, không chất bảo quản, không dầu cọ',
        'Hoàn hảo để phết bánh mì đen, trộn yến mạch & sinh tố'
      ]
    },
    {
      id: 'rolled-oats',
      title: 'Yến Mạch Cán Dẹt Tự Nhiên',
      category: 'Ngũ Cốc',
      weightInfo: '500g',
      price: 75000,
      image: 'images/rolled_oats.jpg',
      isGreenBiteProduct: true,
      portionLabel: 'g',
      defaultPortion: 40,
      minPortion: 20,
      maxPortion: 100,
      step: 5,
      tags: ['eat-clean', 'high-protein'],
      per100g: {
        calories: 380,
        protein: 13.5,
        carbs: 67.5,
        fat: 7.0,
        fiber: 10.5
      },
      benefits: [
        'Chỉ số đường huyết thấp (GI thấp), tạo cảm giác no lâu',
        'Hỗ trợ hệ tiêu hóa khỏe mạnh và kiểm soát cân nặng',
        'Dễ dàng nấu cháo, làm overnight oats hoặc nướng bánh'
      ]
    }
  ];

  // Healthy Add-on Toppings
  const TOPPINGS_DB = [
    {
      id: 'greek-yogurt',
      title: 'Sữa Chua Hy Lạp Không Đường',
      category: 'Ăn Kèm',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&auto=format&fit=crop&q=80',
      isGreenBiteProduct: false,
      portionLabel: 'g',
      defaultPortion: 100,
      minPortion: 50,
      maxPortion: 200,
      step: 25,
      per100g: {
        calories: 59,
        protein: 10.0,
        carbs: 3.6,
        fat: 0.4,
        fiber: 0.0
      }
    },
    {
      id: 'almond-milk',
      title: 'Sữa Hạt Hạnh Nhân Không Đường',
      category: 'Ăn Kèm',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80',
      isGreenBiteProduct: false,
      portionLabel: 'ml',
      defaultPortion: 150,
      minPortion: 100,
      maxPortion: 300,
      step: 50,
      per100g: {
        calories: 26,
        protein: 1.0,
        carbs: 0.8,
        fat: 2.0,
        fiber: 0.5
      }
    },
    {
      id: 'banana',
      title: 'Chuối Tiêu Tươi Cắt Lát',
      category: 'Trái Cây',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&auto=format&fit=crop&q=80',
      isGreenBiteProduct: false,
      portionLabel: 'g',
      defaultPortion: 60,
      minPortion: 30,
      maxPortion: 120,
      step: 10,
      per100g: {
        calories: 89,
        protein: 1.1,
        carbs: 22.8,
        fat: 0.3,
        fiber: 2.6
      }
    },
    {
      id: 'strawberries',
      title: 'Dâu Tây Tươi Đà Lạt',
      category: 'Trái Cây',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&auto=format&fit=crop&q=80',
      isGreenBiteProduct: false,
      portionLabel: 'g',
      defaultPortion: 50,
      minPortion: 25,
      maxPortion: 150,
      step: 25,
      per100g: {
        calories: 32,
        protein: 0.7,
        carbs: 7.7,
        fat: 0.3,
        fiber: 2.0
      }
    }
  ];

  // Combined DB
  const ALL_ITEMS = [...PRODUCTS_DB, ...TOPPINGS_DB];

  // ─── Builder State ──────────────────────────────────
  const builderState = {};
  ALL_ITEMS.forEach(item => {
    builderState[item.id] = {
      selected: item.id === 'granola' || item.id === 'greek-yogurt', // default selection
      portion: item.defaultPortion
    };
  });

  // ─── Render Builder Cards ───────────────────────────
  function renderBuilderCards() {
    const productsContainer = document.getElementById('builder-products-list');
    const toppingsContainer = document.getElementById('builder-toppings-list');

    if (productsContainer) {
      productsContainer.innerHTML = PRODUCTS_DB.map(product => createBuilderCardHTML(product)).join('');
    }

    if (toppingsContainer) {
      toppingsContainer.innerHTML = TOPPINGS_DB.map(topping => createBuilderCardHTML(topping)).join('');
    }

    bindBuilderEvents();
  }

  function createBuilderCardHTML(item) {
    const state = builderState[item.id] || { selected: false, portion: item.defaultPortion };
    const calPerPortion = Math.round((item.per100g.calories * state.portion) / 100);

    return `
      <div class="builder-card ${state.selected ? 'selected' : ''}" data-id="${item.id}">
        <div class="builder-card__header">
          <img src="${item.image}" alt="${item.title}" class="builder-card__img" onerror="this.src='images/granola.jpg'">
          <div class="builder-card__info">
            <label class="builder-card__check" for="check-${item.id}">
              <input type="checkbox" id="check-${item.id}" data-id="${item.id}" ${state.selected ? 'checked' : ''}>
              <span>${item.title}</span>
            </label>
            <div class="builder-card__unit-calo">
              <span id="card-cal-${item.id}">${calPerPortion}</span> kcal
            </div>
          </div>
        </div>

        <div class="builder-card__controls">
          <span class="builder-card__portion-label">Khẩu phần:</span>
          <div class="builder-card__stepper">
            <button type="button" class="builder-stepper-btn btn-stepper-minus" data-id="${item.id}">−</button>
            <span class="builder-stepper-val" id="card-portion-val-${item.id}">${state.portion} ${item.portionLabel}</span>
            <button type="button" class="builder-stepper-btn btn-stepper-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindBuilderEvents() {
    // Checkbox toggles
    document.querySelectorAll('.builder-card input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const card = document.querySelector(`.builder-card[data-id="${id}"]`);
        builderState[id].selected = e.target.checked;
        if (card) {
          card.classList.toggle('selected', e.target.checked);
        }
        recalculateMacros();
      });
    });

    // Clicking card toggles checkbox
    document.querySelectorAll('.builder-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking stepper controls, ignore card toggle
        if (e.target.closest('.builder-card__controls')) return;
        if (e.target.tagName === 'INPUT') return;

        const id = card.getAttribute('data-id');
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          builderState[id].selected = checkbox.checked;
          card.classList.toggle('selected', checkbox.checked);
          recalculateMacros();
        }
      });
    });

    // Stepper Minus
    document.querySelectorAll('.btn-stepper-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        const item = ALL_ITEMS.find(i => i.id === id);
        if (!item) return;

        let portion = builderState[id].portion - item.step;
        if (portion < item.minPortion) portion = item.minPortion;
        builderState[id].portion = portion;

        // Auto select if stepped
        if (!builderState[id].selected) {
          builderState[id].selected = true;
          const card = document.querySelector(`.builder-card[data-id="${id}"]`);
          const checkbox = document.getElementById(`check-${id}`);
          if (card) card.classList.add('selected');
          if (checkbox) checkbox.checked = true;
        }

        updateCardPortionDisplay(id, item);
        recalculateMacros();
      });
    });

    // Stepper Plus
    document.querySelectorAll('.btn-stepper-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        const item = ALL_ITEMS.find(i => i.id === id);
        if (!item) return;

        let portion = builderState[id].portion + item.step;
        if (portion > item.maxPortion) portion = item.maxPortion;
        builderState[id].portion = portion;

        // Auto select if stepped
        if (!builderState[id].selected) {
          builderState[id].selected = true;
          const card = document.querySelector(`.builder-card[data-id="${id}"]`);
          const checkbox = document.getElementById(`check-${id}`);
          if (card) card.classList.add('selected');
          if (checkbox) checkbox.checked = true;
        }

        updateCardPortionDisplay(id, item);
        recalculateMacros();
      });
    });
  }

  function updateCardPortionDisplay(id, item) {
    const state = builderState[id];
    const portionValEl = document.getElementById(`card-portion-val-${id}`);
    const cardCalEl = document.getElementById(`card-cal-${id}`);

    if (portionValEl) {
      portionValEl.textContent = `${state.portion} ${item.portionLabel}`;
    }
    if (cardCalEl) {
      const cal = Math.round((item.per100g.calories * state.portion) / 100);
      cardCalEl.textContent = cal;
    }
  }

  // ─── Recalculate Totals & Dashboard ─────────────────
  function recalculateMacros() {
    let totalCal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    ALL_ITEMS.forEach(item => {
      const state = builderState[item.id];
      if (state && state.selected) {
        const factor = state.portion / 100;
        totalCal += item.per100g.calories * factor;
        totalProtein += item.per100g.protein * factor;
        totalCarbs += item.per100g.carbs * factor;
        totalFat += item.per100g.fat * factor;
        totalFiber += item.per100g.fiber * factor;
      }
    });

    totalCal = Math.round(totalCal);
    totalProtein = parseFloat(totalProtein.toFixed(1));
    totalCarbs = parseFloat(totalCarbs.toFixed(1));
    totalFat = parseFloat(totalFat.toFixed(1));
    totalFiber = parseFloat(totalFiber.toFixed(1));

    // Update Dashboard DOM
    const caloriesEl = document.getElementById('macro-total-calories');
    const proteinEl = document.getElementById('macro-val-protein');
    const carbsEl = document.getElementById('macro-val-carbs');
    const fatEl = document.getElementById('macro-val-fat');
    const fiberEl = document.getElementById('macro-val-fiber');

    if (caloriesEl) caloriesEl.textContent = totalCal;
    if (proteinEl) proteinEl.textContent = `${totalProtein}g`;
    if (carbsEl) carbsEl.textContent = `${totalCarbs}g`;
    if (fatEl) fatEl.textContent = `${totalFat}g`;
    if (fiberEl) fiberEl.textContent = `${totalFiber}g`;

    // Percentage of Calories from Macros:
    // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
    const calFromProtein = totalProtein * 4;
    const calFromCarbs = totalCarbs * 4;
    const calFromFat = totalFat * 9;
    const macroSum = calFromProtein + calFromCarbs + calFromFat;

    let pPct = 0, cPct = 0, fPct = 0;
    if (macroSum > 0) {
      pPct = Math.round((calFromProtein / macroSum) * 100);
      cPct = Math.round((calFromCarbs / macroSum) * 100);
      fPct = 100 - pPct - cPct;
    }

    const pPctEl = document.getElementById('macro-pct-protein');
    const cPctEl = document.getElementById('macro-pct-carbs');
    const fPctEl = document.getElementById('macro-pct-fat');

    if (pPctEl) pPctEl.textContent = `${pPct}% calo`;
    if (cPctEl) cPctEl.textContent = `${cPct}% calo`;
    if (fPctEl) fPctEl.textContent = `${fPct}% calo`;

    // Segmented Ratio Bar
    const segP = document.getElementById('macro-seg-protein');
    const segC = document.getElementById('macro-seg-carbs');
    const segF = document.getElementById('macro-seg-fat');

    if (segP) segP.style.width = `${pPct}%`;
    if (segC) segC.style.width = `${cPct}%`;
    if (segF) segF.style.width = `${fPct}%`;

    // Goal Comparison
    const goalSelect = document.getElementById('macro-goal-select');
    const targetCal = goalSelect ? parseInt(goalSelect.value, 10) : 400;
    const goalBarFill = document.getElementById('macro-goal-fill');
    const goalStatusEl = document.getElementById('macro-goal-status');

    if (goalBarFill) {
      const pct = Math.min(Math.round((totalCal / targetCal) * 100), 100);
      goalBarFill.style.width = `${pct}%`;

      if (totalCal > targetCal + 60) {
        goalBarFill.style.background = '#E63946'; // Red warning
      } else if (totalCal >= targetCal - 40 && totalCal <= targetCal + 60) {
        goalBarFill.style.background = 'linear-gradient(90deg, #52B788, #2D6A4F)'; // Perfect green
      } else {
        goalBarFill.style.background = 'linear-gradient(90deg, #F59E0B, #52B788)';
      }
    }

    if (goalStatusEl) {
      if (totalCal === 0) {
        goalStatusEl.textContent = 'Hãy chọn ít nhất 1 sản phẩm để tính';
        goalStatusEl.style.color = '#888';
      } else if (totalCal < targetCal - 80) {
        goalStatusEl.textContent = `Thiếu ${targetCal - totalCal} kcal so với mục tiêu (${targetCal} kcal)`;
        goalStatusEl.style.color = '#F59E0B';
      } else if (totalCal > targetCal + 60) {
        goalStatusEl.textContent = `Vượt ${totalCal - targetCal} kcal so với mục tiêu (${targetCal} kcal)`;
        goalStatusEl.style.color = '#E63946';
      } else {
        goalStatusEl.textContent = `✓ Hoàn hảo! Khẩu phần chuẩn mục tiêu (${totalCal}/${targetCal} kcal)`;
        goalStatusEl.style.color = 'var(--clr-primary)';
      }
    }
  }

  // Goal select change
  const goalSelect = document.getElementById('macro-goal-select');
  if (goalSelect) {
    goalSelect.addEventListener('change', recalculateMacros);
  }

  // ─── Add Combo To Cart ──────────────────────────────
  const addComboBtn = document.getElementById('btn-add-combo');
  if (addComboBtn) {
    addComboBtn.addEventListener('click', () => {
      const selectedProducts = PRODUCTS_DB.filter(p => builderState[p.id] && builderState[p.id].selected);

      if (selectedProducts.length === 0) {
        if (window.showGreenBiteToast) {
          window.showGreenBiteToast('Vui lòng chọn ít nhất 1 sản phẩm GreenBite trong combo! ⚠️');
        }
        return;
      }

      // Add each selected GreenBite product to cart
      selectedProducts.forEach(product => {
        if (window.GreenBiteCart && window.GreenBiteCart.addToCart) {
          window.GreenBiteCart.addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
          });
        }
      });

      if (window.GreenBiteCart && window.GreenBiteCart.openCart) {
        setTimeout(() => {
          window.GreenBiteCart.openCart();
        }, 300);
      }
    });
  }

  // ─── Reset Builder ──────────────────────────────────
  const resetBtn = document.getElementById('btn-reset-builder');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      ALL_ITEMS.forEach(item => {
        builderState[item.id] = {
          selected: item.id === 'granola' || item.id === 'greek-yogurt',
          portion: item.defaultPortion
        };
      });
      renderBuilderCards();
      recalculateMacros();
      if (window.showGreenBiteToast) {
        window.showGreenBiteToast('Đã làm mới bộ tính Calo! 🔄');
      }
    });
  }

  // ─── Render Detailed Nutrition Facts ────────────────
  function renderNutritionFacts(filter = 'all') {
    const container = document.getElementById('nutrition-facts-grid');
    if (!container) return;

    let filtered = PRODUCTS_DB;
    if (filter !== 'all') {
      filtered = PRODUCTS_DB.filter(p => p.tags.includes(filter));
    }

    container.innerHTML = filtered.map(product => `
      <div class="nutrition-card animate-on-scroll">
        <div class="nutrition-card__header">
          <img src="${product.image}" alt="${product.title}" class="nutrition-card__img" onerror="this.src='images/granola.jpg'">
          <div class="nutrition-card__meta">
            <div class="nutrition-card__category">${product.category}</div>
            <h3 class="nutrition-card__title">${product.title}</h3>
            <div class="nutrition-card__price">${product.price.toLocaleString('vi-VN')} ₫ <small>(${product.weightInfo})</small></div>
          </div>
        </div>

        <div class="nutrition-card__body">
          <div class="nutrition-card__calories-badge">
            <span class="nutrition-card__portion">Khẩu phần: ${product.defaultPortion}g</span>
            <span class="nutrition-card__cal-val">${Math.round((product.per100g.calories * product.defaultPortion) / 100)} kcal</span>
          </div>

          <div class="nutrition-bars">
            <div class="nutrition-bar-row">
              <span>🥩 Protein:</span>
              <span class="nutrition-bar-val">${((product.per100g.protein * product.defaultPortion) / 100).toFixed(1)}g</span>
            </div>
            <div class="nutrition-bar-row">
              <span>🍞 Carbs (Tinh bột chậm):</span>
              <span class="nutrition-bar-val">${((product.per100g.carbs * product.defaultPortion) / 100).toFixed(1)}g</span>
            </div>
            <div class="nutrition-bar-row">
              <span>🥑 Chất béo tốt (Healthy Fat):</span>
              <span class="nutrition-bar-val">${((product.per100g.fat * product.defaultPortion) / 100).toFixed(1)}g</span>
            </div>
            <div class="nutrition-bar-row">
              <span>🌾 Chất xơ tự nhiên (Fiber):</span>
              <span class="nutrition-bar-val">${((product.per100g.fiber * product.defaultPortion) / 100).toFixed(1)}g</span>
            </div>
          </div>

          <div class="nutrition-card__ingredients">
            <strong>🌿 Điểm nổi bật:</strong><br>
            ${product.benefits.map(b => `• ${b}`).join('<br>')}
          </div>

          <button class="nutrition-card__add-btn btn-add-single" data-id="${product.id}">
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>
    `).join('');

    // Bind Add single to cart
    container.querySelectorAll('.btn-add-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const product = PRODUCTS_DB.find(p => p.id === id);
        if (product && window.GreenBiteCart && window.GreenBiteCart.addToCart) {
          window.GreenBiteCart.addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
          });
        }
      });
    });
  }

  // Nutrition Category Filters
  document.querySelectorAll('.nutrition-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.nutrition-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      renderNutritionFacts(filter);
    });
  });

  // ─── Preset Meal Plans (1-Click Load into Builder) ──
  document.querySelectorAll('.meal-plan-card__btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const plan = this.getAttribute('data-plan');

      // Reset all items first
      ALL_ITEMS.forEach(i => {
        builderState[i.id].selected = false;
      });

      if (plan === 'lean-fit') {
        builderState['granola'].selected = true;
        builderState['granola'].portion = 45;
        builderState['greek-yogurt'].selected = true;
        builderState['greek-yogurt'].portion = 100;
        builderState['strawberries'].selected = true;
        builderState['strawberries'].portion = 50;
        if (goalSelect) goalSelect.value = '350';
      } else if (plan === 'gym-energy') {
        builderState['energy-bar'].selected = true;
        builderState['energy-bar'].portion = 35;
        builderState['almond-butter'].selected = true;
        builderState['almond-butter'].portion = 20;
        builderState['banana'].selected = true;
        builderState['banana'].portion = 60;
        if (goalSelect) goalSelect.value = '500';
      } else if (plan === 'office-snack') {
        builderState['biscotti'].selected = true;
        builderState['biscotti'].portion = 30;
        builderState['macadamia'].selected = true;
        builderState['macadamia'].portion = 15;
        if (goalSelect) goalSelect.value = '200';
      }

      renderBuilderCards();
      recalculateMacros();

      // Scroll smoothly to builder
      const builderSection = document.getElementById('builder');
      if (builderSection) {
        builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (window.showGreenBiteToast) {
        window.showGreenBiteToast('Đã nạp thực đơn vào Bộ tính Calo! 🥗');
      }
    });
  });

  // ─── Initialize ────────────────────────────────────
  renderBuilderCards();
  recalculateMacros();
  renderNutritionFacts('all');
});
