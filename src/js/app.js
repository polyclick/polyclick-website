// libraries
import $ from 'jquery'
import TweenMax from 'gsap'
import page from 'page'


// variables



// jquery elements
const $body = $(`body`)
const $overlay = $(`div.overlay`)


// click on overlay itself, hide
$overlay.click(() => {
  hideOverlay()
})


// bg position move effect
$(document).mousemove((event) => {
  const percentage = event.clientX / $(document).width()
  TweenMax.to($overlay, 0.5, { backgroundPosition: `${percentage * 100}% 0px`, force3D: true, ease: Cubic.easeOut })
})


// routes
page('/', index)
page('/what', what)
page('/contact', contact)
page('/work/:slug', work)
page()

function index() {
  loadPage(`work-overview`)
  initNavigation()
}

function what() {
  loadPage(`what`)
  initNavigation()
}

function contact() {
  loadPage(`contact`)
  initNavigation()
}

function work(ctx) {
  loadPage(`work-${ctx.params.slug}`)
  initOverlayLinks()
}


// load a page
function loadPage(id) {
  const $page = $(`#` + id)
  const $template = $(`#` + $page.attr(`template`))
  const $composed = $($template.html())

  // put page content in template
  $composed.find(`#content`).append($page.html())

  // put composed result in dom
  // add helper css classes
  $(`body main`)
    .html($composed)
    .removeClass()
    .addClass($page.attr(`template`).substring(0, $page.attr(`template`).indexOf(`-template`)))
    .addClass(id)

  // scroll to top
  window.scrollTo(0, 0)

  // track
  ga('set', 'page', id)
  ga('send', 'pageview')
}


// init navigation stuff
function initNavigation() {
  const $what = $(`#what-nav`)
  const whatWords = [`what`, `i`, `do`]

  let whatAnimationInterval
  let whatIndex = 0

  // what i do animation
  $what.mouseenter(() => {
    whatIndex = 0
    nextWhatWord()
    whatAnimationInterval = setInterval(() => { nextWhatWord() }, 250)
  })

  $what.mouseleave(() => {
    clearTimeout(whatAnimationInterval)
    whatIndex = -1
    nextWhatWord()
  })

  function nextWhatWord() {
    whatIndex++
    $what.html(whatWords[whatIndex % whatWords.length])
  }
}


// functionality to open the overlay
function initOverlayLinks() {
  const $links = $(`[overlay]`)

  // clickable items with overlay attr
  $links.on(`click`, (event) => {
    const url = $(event.currentTarget).attr(`overlay`)

    // load image and wait, then show overlay
    const image = new Image()
    image.onload = () => {
      $body.removeClass(`loading`)
      showOverlay(url)
    }
    image.src = url

    // show loading state
    $body.addClass(`loading`)
  })
}


// show the overlay, animated
function showOverlay(url) {
  $body.addClass(`overlay-shown`)
  $overlay.css(`background-image`, `url(${url})`)

  // animate
  TweenMax.to($overlay, 0, { autoAlpha: 0, scale: 1.2, force3D: true })
  TweenMax.to($overlay, 0.3, { autoAlpha: 1, scale: 1, force3D: true, ease: Circ.easeOut })

  // track
  ga('send', 'event', 'Overlay', 'open', url)
}


// hide the overlay, animated
function hideOverlay() {
  $body.removeClass(`overlay-shown`)

  // animate out
  TweenMax.to($overlay, 0.2, { autoAlpha: 0, scale: 1.2, force3D: true, ease: Circ.easeIn })

  // track
  ga('send', 'event', 'Overlay', 'close')
}