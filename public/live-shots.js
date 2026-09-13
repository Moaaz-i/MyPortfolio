(function () {
  // Live screenshot refresher.
  // Every repo/project card with a real live demo gets an <img data-live-shot>
  // whose initial src is the local static shot (instant, cached). After the
  // page settles this script swaps it to a FRESH on-demand capture from the
  // WP mshots service (cached server-side + by the browser), so returning
  // visitors see instant cached images that quietly update to the newest
  // screenshot. Falls back to the static shot if the provider is unreachable.
  // Strict-CSP friendly: img-src https: is allowed, no inline handlers.

  if (!('fetch' in window)) return

  var PROVIDER = 'https://s0.wp.com/mshots/v1/'
  var HOURLY = new Date().toISOString().slice(0, 13) // YYYY-MM-DDThh → ~1 fresh capture per hour, cached the rest of the time

  function provider(url, stamp) {
    return PROVIDER + encodeURIComponent(String(url || '')) + '?w=1024&h=640&v=' + stamp
  }

  function process(img) {
    if (img.__liveShot) return
    var live = img.getAttribute('data-live')
    if (!live) return
    img.__liveShot = true

    var fallback = img.getAttribute('data-static') || img.getAttribute('src') || ''
    var timer = setTimeout(function () { upgrade(img, fallback) }, 1600)

    img.addEventListener('error', function () {
      clearTimeout(timer)
      revert(img, fallback)
    })
  }

  function upgrade(img, fallback) {
    var fresh = provider(img.getAttribute('data-live'), HOURLY)
    img.classList.add('is-swapping')
    var done = function () {
      img.classList.remove('is-swapping')
      img.removeEventListener('load', done)
      img.removeEventListener('error', err)
    }
    function err() {
      done()
      if (fallback) {
        img.src = fallback
      } else {
        img.classList.add('is-flat')
      }
    }
    img.addEventListener('load', done)
    img.addEventListener('error', err)
    img.src = fresh
  }

  function revert(img, fallback) {
    if (fallback && String(img.getAttribute('src')) !== fallback) {
      img.src = fallback
    } else if (!fallback) {
      img.classList.add('is-flat')
    }
  }

  function scan() {
    Array.prototype.forEach.call(document.querySelectorAll('img[data-live-shot]'), process)
  }

  document.addEventListener('DOMContentLoaded', scan)
  if (document.readyState !== 'loading') {
    scan()
  }
  window.addEventListener('load', function () { setTimeout(scan, 800) })

  // Re-scan after SPA navigation swaps <main> (and for pagination re-renders).
  var main = document.querySelector('main')
  if (main && main.parentNode && 'MutationObserver' in window) {
    var grid = document.querySelector('.repos-grid')
    if (grid && grid.parentNode) {
      new MutationObserver(function () { setTimeout(scan, 0) }).observe(grid.parentNode, { childList: true, subtree: true })
    }
    new MutationObserver(function () { setTimeout(scan, 0) }).observe(main.parentNode, { childList: true })
  }
})()