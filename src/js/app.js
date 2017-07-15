// libraries
import $ from 'jquery'
import TweenLite from 'gsap'
import page from 'page'


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
  TweenLite.to($overlay, 0.5, { backgroundPosition: `${percentage * 100}% 0px`, force3D: true, ease: Cubic.easeOut })
})



// routes
page('/', index)
page('/what', what)
page('/contact', contact)
page('/work/:slug', work)
page('/challenge/:slug', challenge)
page()  // -> call page() to trigger root to be loaded first

function index() {
  loadPage(`work-overview`)
  initNavigation()
  initAnimations()
}

function what() {
  loadPage(`what`)
  initNavigation()
  initAnimations()
}

function contact() {
  loadPage(`contact`)
  initNavigation()
  initAnimations()
}

function work(ctx) {
  loadPage(`work-${ctx.params.slug}`)
  initOverlayLinks()
  initAnimations()
}

function challenge(ctx) {
  loadPage(`challenge-${ctx.params.slug}`)
  initChallenge()
  initOverlayLinks()
  initAnimations()
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

function initAnimations() {
  TweenLite.to(`main > *`, 1, { opacity: 1 })
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

function initChallenge() {

  // get section templates & randomize order
  const templates = $('script.challenge-zerotohero-section-templates')

  let templateSlots,
    templateSlotsLeft = 0,
    $template = null,
    $video = null,
    $output = $('<div class="centerer"></div>')

  // load challenge status file
  $.getJSON('/data/challenge-zerotohero.json', (data) => {
    console.log(data.tracks.length + ' tracks')

    // loop over each track
    for(let i = 0; i < data.tracks.length; i++) {
      const trackInfo = data.tracks[i]

      // take new template if there are no slots available
      if(!templateSlotsLeft) {
        $template = $(templates[!i ? 0 : Math.floor(Math.random() * templates.length)])
        $output.append($template.html())

        templateSlots = parseInt($template.attr(`slots`))
        templateSlotsLeft = templateSlots
      }

      // update video element
      $video = $output.find(`section`).last().find(`.video:nth-of-type(${(templateSlots - templateSlotsLeft) + 1})`)
      $video.css(`display`, `block`)
      $video.find(`iframe`).attr(`src`, `https://www.youtube.com/embed/BT5HLiStabQ?rel=0&amp;controls=0&amp;showinfo=0`)

      // lower available slots in current section
      templateSlotsLeft--
    }

    // add output to dom
    console.log($output)
    $(`body main div.centerer`).replaceWith($output)
  })
}

// show the overlay, animated
function showOverlay(url) {
  $body.addClass(`overlay-shown`)
  $overlay.css(`background-image`, `url(${url})`)

  // animate
  TweenLite.to($overlay, 0, { autoAlpha: 0, scale: 1.2, force3D: true })
  TweenLite.to($overlay, 0.3, { autoAlpha: 1, scale: 1, force3D: true, ease: Circ.easeOut })

  // track
  ga('send', 'event', 'Overlay', 'open', url)
}


// hide the overlay, animated
function hideOverlay() {
  $body.removeClass(`overlay-shown`)

  // animate out
  TweenLite.to($overlay, 0.2, { autoAlpha: 0, scale: 1.2, force3D: true, ease: Circ.easeIn })

  // track
  ga('send', 'event', 'Overlay', 'close')
}