window.addEventListener('scroll', function() {
  document.body.classList.toggle('scrolled', window.scrollY > 80);

  // Scroll spy — uses getBoundingClientRect for accurate position regardless of nesting
  var navLinks = document.querySelectorAll('.nav-links .nav-link');

  // Map id → nav link
  var linkMap = {};
  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href !== '#') linkMap[href.replace('#', '')] = link;
  });

  // Get absolute page position using getBoundingClientRect + scrollY
  function getPageTop(el) {
    return el.getBoundingClientRect().top + window.scrollY;
  }

  // Build sections sorted by true page position
  var sections = [];
  Object.keys(linkMap).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: linkMap[id], top: getPageTop(el) });
  });
  sections.sort(function(a, b) { return a.top - b.top; });

  // Activate last section whose top is above 45% of the viewport
  var threshold = window.scrollY + window.innerHeight * 0.45;
  var activeLink = null;

  if (window.scrollY > 80) {
    sections.forEach(function(s) {
      if (s.top <= threshold) activeLink = s.link;
    });
  }

  navLinks.forEach(function(link) { link.classList.remove('active'); });
  if (activeLink) activeLink.classList.add('active');
}, { passive: true });

// Hero Card Animation — infinite loop with pause between cycles
(function() {
  var card = document.getElementById('journeyCard');
  if (!card) return;

  var steps = document.querySelectorAll('.hero-steps .journey-step');
  var tierBadge = card.querySelector('.tier-badge');
  var guestName = card.querySelector('.guest-name');
  var trendIndicator = card.querySelector('.trend-indicator');
  var guestContext = card.querySelector('.guest-context');
  var contextSpans = guestContext.querySelectorAll('span');
  var actionItems = card.querySelectorAll('.action-item');
  var actionBadge = card.querySelector('.action-badge');
  var guestStatus = card.querySelector('.guest-status');
  var actionBadgeCount = actionBadge.querySelector('.action-badge-count');
  var actionBadgeCheckSvg = actionBadge.querySelector('.action-badge-check');

  var STEP_DURATION = 2500;
  var PAUSE_BETWEEN_CYCLES = 3000;

  function resetAll() {
    steps.forEach(function(s) { s.classList.remove('active'); });
    tierBadge.classList.remove('illuminated');
    guestName.classList.remove('visible');
    trendIndicator.classList.remove('visible');
    contextSpans.forEach(function(s) { s.classList.remove('visible'); });
    actionItems.forEach(function(item) {
      item.classList.remove('visible', 'completed');
      item.querySelector('.action-checkbox').classList.remove('completed');
    });
    // Reset badge — hidden until Step 3
    actionBadge.style.transition = 'none';
    actionBadge.style.opacity = '0';
    actionBadge.style.transform = 'scale(0.6)';
    actionBadge.classList.remove('hide');
    actionBadgeCount.textContent = '3';
    actionBadgeCount.classList.remove('hidden');
    actionBadgeCheckSvg.classList.remove('draw');
    guestStatus.textContent = 'Arriving';
    guestStatus.style.color = '';
  }

  function celebrate() {
    // Fade out the number
    actionBadgeCount.classList.add('hidden');

    // Draw the checkmark in its place
    setTimeout(function() {
      actionBadgeCheckSvg.classList.add('draw');

      // Hold, then fade the whole circle out
      setTimeout(function() {
        actionBadge.classList.add('hide');
      }, 1200);
    }, 250);
  }

  function runCycle() {
    resetAll();

    // Step 1: Guest Recognized
    setTimeout(function() {
      steps[0].classList.add('active');
      tierBadge.classList.add('illuminated');
      guestName.classList.add('visible');
      setTimeout(function() { trendIndicator.classList.add('visible'); }, 400);
    }, 500);

    // Step 2: Context Generated
    setTimeout(function() {
      steps[0].classList.remove('active');
      steps[1].classList.add('active');
      contextSpans.forEach(function(span, i) {
        setTimeout(function() { span.classList.add('visible'); }, i * 120);
      });
    }, STEP_DURATION);

    // Step 3: Playbook Generated — badge hidden, reveals after last action item appears
    setTimeout(function() {
      steps[1].classList.remove('active');
      steps[2].classList.add('active');
      actionItems.forEach(function(item, i) {
        setTimeout(function() { item.classList.add('visible'); }, i * 150);
      });
      // Badge fades in after last action item appears
      setTimeout(function() {
        actionBadge.style.transition = 'opacity 300ms ease, transform 300ms ease';
        actionBadge.style.opacity = '1';
        actionBadge.style.transform = 'scale(1)';
      }, actionItems.length * 150 + 100);
    }, STEP_DURATION * 2);

    // Step 4: Floor Executes — actions check off, counter counts down, then celebrate
    setTimeout(function() {
      steps[2].classList.remove('active');
      steps[3].classList.add('active');

      setTimeout(function() {
        actionItems[0].classList.add('completed');
        actionItems[0].querySelector('.action-checkbox').classList.add('completed');
        actionBadgeCount.textContent = '2';
      }, 300);

      setTimeout(function() {
        actionItems[1].classList.add('completed');
        actionItems[1].querySelector('.action-checkbox').classList.add('completed');
        actionBadgeCount.textContent = '1';
      }, 800);

      setTimeout(function() {
        actionItems[2].classList.add('completed');
        actionItems[2].querySelector('.action-checkbox').classList.add('completed');
        actionBadgeCount.textContent = '0';
        guestStatus.textContent = 'Seated';
        guestStatus.style.color = '#52B788';
        setTimeout(celebrate, 400);
      }, 1300);

    }, STEP_DURATION * 3);

    // Hold for pause, then restart
    var cycleLength = STEP_DURATION * 3 + 2500 + PAUSE_BETWEEN_CYCLES;
    setTimeout(runCycle, cycleLength);
  }

  runCycle();
})();

// Dual-Signal Intelligence Animation
(function() {
  var wrapper = document.getElementById('segmentation');
  if (!wrapper) return;

  var TIERS = [
    { label: 'Elite',    icon: '★', color: '#F5A623' },
    { label: 'VIP',      icon: '◆', color: '#01A0C6' },
    { label: 'Loyal',    icon: '●', color: '#52B788' },
    { label: 'Prospect', icon: '◆', color: '#01A0C6' },
    { label: 'New',      icon: '○', color: '#8B8B8B' },
    { label: 'Lapsed',   icon: '▾', color: '#E85D5D' },
  ];

  // 6 padded rows: 1 spacer above real items, 2 spacers below (real traj index + 1 = padded index)
  var TRAJS = [
    { spacer: true },
    { label: 'High Potential', icon: '↑', color: '#52B788' },
    { label: 'Trending Up',    icon: '↗', color: '#01A0C6' },
    { label: 'At Risk',        icon: '↓', color: '#E85D5D' },
    { spacer: true },
    { spacer: true },
  ];
  var TRAJ_OFFSET = 1;

  var COMBOS = [
    { name: 'Nadia Okafor',       tier: 0, traj: 2, goal: 'Recovery',           goalColor: '#E85D5D' },
    { name: 'Tomás Herrera',      tier: 3, traj: 0, goal: 'Surprise & Delight',  goalColor: '#52B788' },
    { name: 'Lena Johansson',     tier: 2, traj: 1, goal: 'Accelerate Loyalty',  goalColor: '#01A0C6' },
    { name: 'Callum Brightwater', tier: 4, traj: 0, goal: 'First Impression',    goalColor: '#52B788' },
    { name: 'Amara Sato',         tier: 1, traj: 2, goal: 'Win-Back',            goalColor: '#E85D5D' },
    { name: 'Eli Montague',       tier: 5, traj: 1, goal: 'Re-Activation',       goalColor: '#01A0C6' },
  ];

  var STEP1 = 800, STEP2 = 1700, STEP3 = 2400, RESET_T = 4500, ADVANCE_T = 4900;
  var currentIndex = 0;
  var timers = [];

  var tierWheel   = document.getElementById('segTierWheel');
  var trajWheel   = document.getElementById('segTrajWheel');
  var carousel    = document.getElementById('segCarousel');
  var panelLeft   = document.getElementById('segPanelLeft');
  var panelRight  = document.getElementById('segPanelRight');
  var dot1        = document.getElementById('segDot1');
  var dot2        = document.getElementById('segDot2');
  var dot3        = document.getElementById('segDot3');
  var conn1       = document.getElementById('segConn1');
  var conn2       = document.getElementById('segConn2');
  var goalBar      = document.getElementById('segGoalBar');
  var goalText     = document.getElementById('segGoalText');
  var guestName    = document.getElementById('segGuestName');      // <span> — text content
  var guestNameEl  = guestName.parentElement;                      // <p>    — opacity toggle

  // Build tier wheel
  TIERS.forEach(function(t, i) {
    var el = document.createElement('div');
    el.className = 'seg-wheel-item';
    el.dataset.index = i;
    el.innerHTML =
      '<span class="seg-wheel-icon" style="color:' + t.color + '">' + t.icon + '</span>' +
      '<span class="seg-wheel-label">' + t.label + '</span>' +
      '<span class="seg-wheel-glow" style="background:' + t.color + ';box-shadow:0 0 8px ' + t.color + '88"></span>';
    tierWheel.appendChild(el);
  });

  // Build trajectory wheel (padded)
  TRAJS.forEach(function(t, i) {
    var el = document.createElement('div');
    el.className = 'seg-wheel-item' + (t.spacer ? ' seg-wheel-spacer' : '');
    el.dataset.index = i;
    if (!t.spacer) {
      el.innerHTML =
        '<span class="seg-wheel-icon" style="color:' + t.color + '">' + t.icon + '</span>' +
        '<span class="seg-wheel-label">' + t.label + '</span>' +
        '<span class="seg-wheel-glow" style="background:' + t.color + ';box-shadow:0 0 8px ' + t.color + '88"></span>';
    }
    trajWheel.appendChild(el);
  });

  // Build carousel dots
  COMBOS.forEach(function(_, i) {
    var btn = document.createElement('button');
    btn.className = 'seg-carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'View combination ' + (i + 1));
    btn.addEventListener('click', function() { jumpTo(i); });
    carousel.appendChild(btn);
  });

  function setWheelPos(wheel, paddedIndex, instant) {
    var ty = (1 - paddedIndex) * 36;
    if (instant) {
      wheel.style.transition = 'none';
      wheel.style.transform = 'translateY(' + ty + 'px)';
      void wheel.offsetHeight;
      wheel.style.transition = '';
    } else {
      wheel.style.transition = '';
      wheel.style.transform = 'translateY(' + ty + 'px)';
    }
  }

  // RAF loop — continuously highlights whatever item is in the center selection slot
  function getActiveIndex(wheel) {
    var transform = window.getComputedStyle(wheel).transform;
    var matrix = transform.match(/matrix.*\((.+)\)/);
    if (!matrix) return -1;
    var values = matrix[1].split(', ');
    var ty = parseFloat(values[5]);
    var index = Math.round(1 - (ty / 36));
    return Math.max(0, Math.min(index, wheel.children.length - 1));
  }

  function updateActiveItems() {
    var tierIdx = getActiveIndex(tierWheel);
    var trajIdx = getActiveIndex(trajWheel);
    tierWheel.querySelectorAll('.seg-wheel-item').forEach(function(item) {
      item.classList.toggle('active', parseInt(item.dataset.index, 10) === tierIdx);
    });
    trajWheel.querySelectorAll('.seg-wheel-item').forEach(function(item) {
      item.classList.toggle('active', parseInt(item.dataset.index, 10) === trajIdx);
    });
    requestAnimationFrame(updateActiveItems);
  }

  function setDot(dot, state, color) {
    dot.classList.remove('active', 'complete');
    if (state === 'active') {
      dot.classList.add('active');
      dot.style.background = color;
      dot.style.boxShadow = '0 0 12px ' + color + '88';
      dot.style.width = '10px';
      dot.style.height = '10px';
    } else if (state === 'complete') {
      dot.classList.add('complete');
      dot.style.background = color;
      dot.style.boxShadow = 'none';
      dot.style.width = '7px';
      dot.style.height = '7px';
    } else {
      dot.style.background = 'rgba(255,255,255,0.08)';
      dot.style.boxShadow = 'none';
      dot.style.width = '';
      dot.style.height = '';
    }
  }

  function resetState() {
    guestNameEl.classList.remove('visible');
    panelLeft.style.borderColor = '';
    panelRight.style.borderColor = '';
    setDot(dot1, 'off'); setDot(dot2, 'off'); setDot(dot3, 'off');
    conn1.style.background = '';
    conn2.style.background = '';
    goalBar.style.borderColor = '';
    goalText.style.color = '';
    goalText.style.opacity = '0';
    // RAF loop manages .active on wheel items — do not clear them here
  }

  function prepareCombo(idx) {
    var combo = COMBOS[idx];
    guestName.textContent = combo.name;
    goalText.textContent = combo.goal;
    goalText.style.opacity = '0';
    carousel.querySelectorAll('.seg-carousel-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === idx);
    });
    // Wheel positions are NOT changed here — they scroll smoothly in startCycle steps
  }

  function jumpTo(idx) {
    timers.forEach(clearTimeout);
    timers = [];
    currentIndex = idx;
    resetState();
    prepareCombo(idx);
    startCycle();
  }

  function startCycle() {
    var combo = COMBOS[currentIndex];
    var tierColor = TIERS[combo.tier].color;
    var trajColor = TRAJS[combo.traj + TRAJ_OFFSET].color;

    timers.push(setTimeout(function() {
      guestNameEl.classList.add('visible');
    }, 50));

    // Step 1: tier wheel scrolls (RAF highlights items as they pass), dot 1 + left panel border
    timers.push(setTimeout(function() {
      setWheelPos(tierWheel, combo.tier, false);
      panelLeft.style.borderColor = tierColor + '55';
      setDot(dot1, 'active', tierColor);
    }, STEP1));

    // Step 2: traj wheel scrolls, dot 2 + right panel border + dot 1 → complete + conn 1 lit
    timers.push(setTimeout(function() {
      setWheelPos(trajWheel, combo.traj + TRAJ_OFFSET, false);
      panelRight.style.borderColor = trajColor + '55';
      setDot(dot1, 'complete', tierColor);
      conn1.style.background = tierColor;
      setDot(dot2, 'active', trajColor);
    }, STEP2));

    // Step 3: goal bar reveals + dot 3 + dot 2 → complete + conn 2 lit
    timers.push(setTimeout(function() {
      goalBar.style.borderColor = combo.goalColor + '35';
      goalText.style.color = combo.goalColor;
      goalText.style.opacity = '1';
      setDot(dot2, 'complete', trajColor);
      conn2.style.background = trajColor;
      setDot(dot3, 'active', combo.goalColor);
    }, STEP3));

    // Reset (dim everything)
    timers.push(setTimeout(resetState, RESET_T));

    // Advance to next combo
    timers.push(setTimeout(function() {
      currentIndex = (currentIndex + 1) % COMBOS.length;
      prepareCombo(currentIndex);
      startCycle();
    }, ADVANCE_T));
  }

  // Set initial wheel positions instantly (one time only, before first cycle)
  setWheelPos(tierWheel, COMBOS[0].tier, true);
  setWheelPos(trajWheel, COMBOS[0].traj + TRAJ_OFFSET, true);

  prepareCombo(0);
  requestAnimationFrame(updateActiveItems);
  startCycle();
})();
