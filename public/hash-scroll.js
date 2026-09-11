(function () {
  // Anchor navigation fixes for the JPROT SPA.
  //
  // Problems:
  //  - JPROT core drops location.hash during cross-page SPA swaps
  //    (res.url never carries the fragment) and scrolls new pages to 0.
  //  - The first layout after a swap can be based on content-visibility
  //    size estimates, so a single scrollIntoView can land off-target
  //    once the real layout settles.
  //
  // Solution:
  //  - On clicks of hash links pointing to *other* pages, remember the hash
  //    and, after <main> is swapped, scroll to it and restore the hash in URL.
  //  - Re-check the scroll a few times; if the element did not settle at the
  //    top (below the sticky header), re-scroll to the corrected position.

  var pendingHash = null
  var INTERVAL = 250
  var MAX_CHECKS = 8

  // Scroll-reveal is only initialized ONCE by JPROT on first load, so any
  // [data-animate] content injected later via SPA navigation would stay
  // opacity:0 forever. Keep a persistent IntersectionObserver here and
  // (re-)observe every new element after each page swap.
  var revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            revealObserver.unobserve(e.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    : null

  function initReveal() {
    if (!revealObserver) return
    var els = document.querySelectorAll('[data-animate]')
    for (var i = 0; i < els.length; i++) {
      if (!els[i].dataset.revealWatched) {
        els[i].dataset.revealWatched = '1'
        revealObserver.observe(els[i])
      }
    }
  }

  // Fallback for environments where the scroll-reveal IntersectionObserver
  // never fires (embedded previews, some webviews): force-apply .visible to
  // [data-animate] elements that are already inside the viewport, otherwise
  // content loaded straight into a hash section would stay opacity:0.
  function revealInView(scope) {
    var els = (scope || document).querySelectorAll('[data-animate]')
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect()
      if (r.top < window.innerHeight + 40 && r.bottom > -40) {
        els[i].classList.add('visible')
      }
    }
  }

  function landOn(id) {
    var el = document.getElementById(id)
    if (!el) return false
    var lastTarget = -1
    var checks = 0

    function snap() {
      checks++
      var top = el.getBoundingClientRect().top + window.scrollY
      var margin = parseFloat(getComputedStyle(el).scrollMarginTop)
      var target = Math.max(0, Math.round(top - (isFinite(margin) ? margin : 84)))
      if (target === lastTarget) {
        revealInView(el)
        return true
      }
      lastTarget = target
      window.scrollTo({ top: target, behavior: 'smooth' })
      return false
    }

    snap()
    var iv = setInterval(function () {
      if (snap() || checks >= MAX_CHECKS) clearInterval(iv)
    }, INTERVAL)
    return true
  }

  function applyHash(hash) {
    if (!hash || hash.length < 2) return false
    var ok = landOn(hash.slice(1))
    if (ok && window.location.hash !== hash) {
      try {
        window.history.replaceState({ path: window.location.pathname + hash }, '', window.location.pathname + hash)
      } catch (e) { /* ignore */ }
    }
    return ok
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null
    if (!a) return
    var href = a.getAttribute('href') || ''
    var hashIdx = href.indexOf('#')
    if (hashIdx < 0) return
    var hash = href.slice(hashIdx)
    var base = href.slice(0, hashIdx)
    var samePage = !base || base === window.location.pathname
    if (!samePage) {
      // Cross-page SPA swap will drop the hash — remember it for the observer.
      pendingHash = hash
    }
  })

  // JPROT's setActiveLink() is unreliable: it drops hashes and uses
// cur.startsWith('') (always true), so on the homepage BOTH "Home" and
// "Projects" become active, and "Home" stays active even on /blog.
// Recompute active states for the main nav with a correct rule:
//  - links containing '#' are section anchors → never "the active page"
//  - otherwise a link is active when its path matches the current page
//    (or is an ancestor path of it)
  function fixNavActive() {
    var nav = document.querySelector('.site-nav')
    if (!nav) return
    var cur = window.location.pathname.replace(/\/$/, '')
    nav.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || ''
      var hashIdx = href.indexOf('#')
      if (hashIdx >= 0) { a.classList.remove('active'); return }
      var base = (href.split('?')[0] || '').replace(/\/$/, '')
      var active = base === cur || (base !== '' && base !== '/' && cur.startsWith(base + '/'))
      a.classList.toggle('active', active)
    })
  }

  var main = document.querySelector('main')
  if (main && main.parentNode && 'MutationObserver' in window) {
    var obs = new MutationObserver(function () {
      initReveal()
      fixNavActive()
      if (pendingHash) {
        if (applyHash(pendingHash)) pendingHash = null
      } else {
        applyHash(window.location.hash)
      }
    })
    obs.observe(main.parentNode, { childList: true })
  }

  initReveal()
  fixNavActive()

  window.addEventListener('hashchange', function () { applyHash(window.location.hash) })
  window.addEventListener('load', function () { applyHash(window.location.hash) })
})()