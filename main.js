const loadedMeshes = []
function toggleTilt(card) {
    if (!card.classList.contains("details")) {
        card.classList.add("details")
        if (card.getAttribute("data-mesh") && card.getAttribute("data-mesh")) {
            let alreadyLoaded = false
            for (let e in loadedMeshes) if (loadedMeshes[e] == card.getAttribute("data-mesh")) alreadyLoaded = true
            if (!alreadyLoaded) {
                loader3DViewer(card.getAttribute("data-mesh-width"), card.getAttribute("data-mesh-height"), card.getAttribute("data-mesh-target"), card.getAttribute("data-mesh"))
                loadedMeshes.push(card.getAttribute("data-mesh"))
                document.getElementById(card.getAttribute("data-mesh-target")).addEventListener("dblclick", () => toggleTilt(card))
            }
        }
    }
    else card.classList.remove("details")
}

const modalBackdrop = document.getElementById("modalBackdrop")
function toggleModal(modalId) {
    let modal = document.getElementById(modalId)
    let hidden = ((modal.style.display = "block" | modal.style.display == '') ? false : true)
    if (hidden) {
        modalBackdrop.style.display = "none"
        modal.style.display = "none"
    } else {
        modalBackdrop.style.display = "block"
        modal.style.display = "block"
    }
}

window.onload = () => {
    toggleModal("infoModal")

    modalBackdrop.addEventListener("click", () => toggleModal("infoModal"))

    /* timeouts are here to prevent page to be either not scrolled up after refresh and modal to pop out imediately because of the scrolling */
    window.setTimeout(() => {
        document.documentElement.scrollTop = 0
        window.setTimeout(() => window.addEventListener("scroll", () => toggleModal("infoModal")), 100)
    }, 200)

    /* calculating delay for smooth tile spawing */
    let speed = 2000
    let container = document.querySelector(".display-animation")
    container.querySelectorAll(".tile").forEach((e) => {
        let offset = e.offsetLeft * 0.8 + e.offsetTop
        let delay = parseFloat(offset / speed).toFixed(2)
        e.style.animationDelay = delay + 's'
        e.classList.add("animated")
    })

    /* cards toggle */
    document.querySelectorAll(".card").forEach((e) => {
        e.querySelector(".photo").addEventListener("click", () => toggleTilt(e))
    })

    /* reading card bars data */
    document.querySelectorAll(".bar").forEach((e) => {
        let color = (e.getAttribute("data-color") ? e.getAttribute("data-color") : "black")
        let background = (e.getAttribute("data-background") ? e.getAttribute("data-background") : "white")
        let label = (e.getAttribute("data-label") ? "'" + e.getAttribute("data-label") + "'" : "'?'")
        let size = (Number(e.firstChild.textContent.slice(0, e.firstChild.textContent.length - 1)) ? Number(e.firstChild.textContent.slice(0, e.firstChild.textContent.length - 1)) : 0)

        e.style.setProperty("--height", 5 * size + "px")
        e.style.setProperty("--marginTop", -5 * size + "px")
        e.style.setProperty("--background", background)
        e.style.setProperty("--color", color)
        e.style.setProperty("--label", label)
    })

    /* slideshow controls */
    document.querySelectorAll(".slideshow").forEach((slideshow) => {
        let slides = slideshow.querySelectorAll(".slider>div")
        let prevNext = slideshow.querySelector(".prevNext")
        let bullets = slideshow.querySelector(".bullets")
        let loop = null

        let k = 0
        slides.forEach((slide) => {
            let pn = null
            /* allow to click to access full picture */
            if (slide.firstElementChild.tagName == "IMG") {
                pn = document.createElement("a")
                pn.href = slide.firstElementChild.src
                pn.target = "_blank"
            } else pn = document.createElement("div")

            let pnPrev = document.createElement("a")
            let pnNext = document.createElement("a")

            let pnPrevIcon = document.createElement("div")
            let pnNextIcon = document.createElement("div")
            pnPrev.append(pnPrevIcon)
            pnNext.append(pnNextIcon)

            k++
            pnNext.href = "#s" + (((k + 1) % (slides.length + 1)) > 0 ? (k + 1) % (slides.length + 1) : 1)
            pnPrev.href = "#s" + (((k - 1) % slides.length) > 0 ? (k - 1) % slides.length : slides.length)

            pn.append(pnPrev, pnNext)
            prevNext.append(pn)

            let bulletWrap = document.createElement("li")
            let bullet = document.createElement("a")
            bullet.href = "#s" + k
            bulletWrap.append(bullet)

            bullets.append(bulletWrap)

            if (k == 1) { 
                bullet.classList.add("active")
                pn.style.visibility = "visible"
            } else pn.style.visibility = "hidden"
        })

        /* overrides nodes variable to get a proper Array iterator prototype */
        bullets = slideshow.querySelectorAll(".bullets li a")
        prevNext = slideshow.querySelectorAll(".prevNext>*")

        /* defining slide change function */
        let gotToSlide = (slide) => {

            /* prevents from looping while user is navigating threw slides */
            window.clearInterval(loop)
            if (slideshow.getAttribute("data-loop") == "true") loop = getLoop()

            slideshow.querySelector(".slider").style.transform = "translateX(" + -100 * (slide - 1) + "%)"
            bullets.forEach((b) => b.classList.remove("active"))
            bullets.forEach((b) => {
                if (b.getAttribute("href").slice(2) == slide) b.classList.add("active")
            })

            prevNext.forEach((pn) => pn.style.visibility = "hidden")
            slideshow.querySelector(".prevNext>*:nth-child(" + slide + ")").style.visibility = "visible"
        }

        /* automated loop */
        let getLoop = () => {
            return window.setInterval(() => {
                let nextSlide = Number(slideshow.querySelector(".active").getAttribute("href").slice(2))
                nextSlide = (nextSlide + 1) % (slides.length + 1)
                if (!nextSlide > 0) nextSlide = 1
                gotToSlide(nextSlide)
            }, 3000);
        }
        if (slideshow.getAttribute("data-loop") == "true") loop = getLoop()

        /* binding clicks */
        bullets.forEach((bullet) => {
            bullet.addEventListener("click", (ev) => {
                ev.preventDefault()
                let slide = bullet.getAttribute("href").slice(2)
                gotToSlide(slide)
            })
        })

        prevNext.forEach((pnGroup) => {
            for (let i = 0; i < pnGroup.children.length; i++) {
                let pn = pnGroup.children.item(i)
                pn.addEventListener("click", (ev) => {
                    ev.preventDefault()
                    let slide = pn.getAttribute("href").slice(2)
                    gotToSlide(slide)
                })
            }
        })
    })
}