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

  var STEP_DURATION = 2500;
  var PAUSE_BETWEEN_CYCLES = 3000;

  function resetAll() {
    steps.forEach(function(s) { s.classList.remove('active'); });
    tierBadge.classList.remove('illuminated');
    guestName.classList.remove('visible');
    trendIndicator.classList.remove('visible');
    contextSpans.forEach(function(s) { s.classList.remove('visible'); });
    actionItems.forEach(function(item) {
      item.classList.remove('visible', 'completed', 'amber-pulse');
      item.querySelector('.action-checkbox').classList.remove('completed');
    });
    actionBadge.textContent = '4';
    guestStatus.textContent = 'Arriving';
    guestStatus.style.color = '';
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

    // Step 3: Playbook Generated
    setTimeout(function() {
      steps[1].classList.remove('active');
      steps[2].classList.add('active');
      actionItems.forEach(function(item, i) {
        setTimeout(function() { item.classList.add('visible'); }, i * 150);
      });
    }, STEP_DURATION * 2);

    // Step 4: Floor Executes
    setTimeout(function() {
      steps[2].classList.remove('active');
      steps[3].classList.add('active');

      setTimeout(function() {
        actionItems[0].classList.add('completed');
        actionItems[0].querySelector('.action-checkbox').classList.add('completed');
        actionBadge.textContent = '3';
      }, 300);

      setTimeout(function() {
        actionItems[1].classList.add('completed');
        actionItems[1].querySelector('.action-checkbox').classList.add('completed');
        actionBadge.textContent = '2';
      }, 700);

      setTimeout(function() {
        actionItems[2].classList.add('completed');
        actionItems[2].querySelector('.action-checkbox').classList.add('completed');
        actionBadge.textContent = '1';
      }, 1100);

      setTimeout(function() {
        actionItems[3].classList.add('completed');
        actionItems[3].querySelector('.action-checkbox').classList.add('completed');
        actionBadge.textContent = '0';
        guestStatus.textContent = 'Seated';
        guestStatus.style.color = '#52B788';
      }, 1500);
    }, STEP_DURATION * 3);

    // Amber pulse on manager visit action after card completes
    setTimeout(function() {
      actionItems[2].classList.add('amber-pulse');
    }, STEP_DURATION * 3 + 2000);

    // Hold for pause, then restart
    var cycleLength = STEP_DURATION * 3 + 2500 + PAUSE_BETWEEN_CYCLES;
    setTimeout(runCycle, cycleLength);
  }

  runCycle();
})();
