function toggleTilt(card) {
    if (!card.classList.contains("details"))
        card.classList.add("details");
    else
        card.classList.remove("details");
}

const modalBackdrop = document.getElementById("modalBackdrop")
function toggleModal(modalId) {
    let modal = document.getElementById(modalId)
    let hidden = (document.body.style.overflow == "hidden" ? true : false)
    if (hidden) {
        document.body.style.overflow = "auto"
        modalBackdrop.style.display = "none"
        modal.style.display = "none"
    } else {
        document.body.style.overflow = "hidden"
        modalBackdrop.style.display = "block"
        modal.style.display = "block"
    }
}

window.onload = () => {
    modalBackdrop.addEventListener("click", () => toggleModal("infoModal"))
    toggleModal("infoModal")

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
        slides.forEach(() => {
            let pn = document.createElement("div")
            let pnPrev = document.createElement("a")
            let pnNext = document.createElement("a")

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

            if (k == 1) bullet.classList.add("active")
        })

        /* overrides nodes memory to get a proper Array prototype */
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
    
    loader3DViewer(500, 900, "3DViewer", "fbx/Lio_render.fbx")
}