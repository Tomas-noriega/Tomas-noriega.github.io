// Opens and closes the "info" overlay, jumps to the requested section,
// and keeps the URL hash in sync so links like /#info work directly.
(function () {
  const info = document.getElementById("info");
  const scroller = info.querySelector(".info__scroll");
  const closeBtn = document.getElementById("info-close");
  let lastTrigger = null;

  function openInfo(targetId) {
    if (info.hidden) {
      info.hidden = false;
      document.body.classList.add("is-locked");
      requestAnimationFrame(() => info.classList.add("is-open"));
    }

    const target = targetId && document.getElementById(targetId);
    if (target && targetId !== "about") {
      if (target.tagName === "DETAILS") target.open = true;
      // Wait one frame so the overlay is laid out before scrolling
      requestAnimationFrame(() => {
        scroller.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
      });
    } else {
      scroller.scrollTop = 0;
    }

    closeBtn.focus({ preventScroll: true });
    if (location.hash !== "#info") history.pushState(null, "", "#info");
  }

  function closeInfo(updateHistory = true) {
    if (info.hidden) return;
    info.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(() => { info.hidden = true; }, 400);
    if (updateHistory && location.hash === "#info") {
      history.pushState(null, "", location.pathname + location.search);
    }
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  // Any element with data-open="<section id>" opens the overlay there
  document.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      lastTrigger = el;
      openInfo(el.dataset.open);
    });
  });

  closeBtn.addEventListener("click", () => closeInfo());

  info.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeInfo();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeInfo();

    // Keep keyboard focus inside the open overlay
    if (e.key === "Tab" && !info.hidden) {
      const focusables = info.querySelectorAll("button, a[href], summary");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Browser back/forward
  window.addEventListener("popstate", () => {
    if (location.hash === "#info") openInfo();
    else closeInfo(false);
  });

  // Direct visits to /#info
  if (location.hash === "#info") openInfo();

  document.getElementById("year").textContent = new Date().getFullYear();
})();
