let dataset = {}
const main = document.getElementById("armyDisplay")
const fileInput = document.getElementById("file")
const previous = document.getElementById("previous")
const next = document.getElementById("next")
const current = document.getElementById("current")

let color = {Archers: "#92F22A", Swordsmen: "#F29B34", Spearmen: "#3D8EB9", Horsemen: "#8F6F40"}

fileInput.addEventListener("change", (event) => {
    readFile(event.target.files[0])
})

function readFile(file) {
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
        const result = event.target.result
        dataset = JSON.parse(result)
        current.value = 0
        drawArmy(dataset["army0"])
    })

    reader.readAsText(file)
}

function drawArmy(army) {
    main.innerHTML = null
    army.forEach(e => {
        let troop = document.createElement("div")
        troop.classList.add("troop")

        let unitName = Object.keys(e)[0]
        for (let i=0; i<e[unitName]; i++) {
            let unit = document.createElement("div")
            unit.classList.add("unit")
            unit.innerText = unitName
            unit.style.backgroundColor = color[unitName]
            troop.append(unit)
        }

        main.append(troop)
    })
}

current.addEventListener("change", e => {
    if(dataset.army0) drawArmy(dataset["army" + e.target.value])
})

next.addEventListener("click", () => {
    current.value++
    if(dataset.army0) drawArmy(dataset["army" + current.value])
})

previous.addEventListener("click", () => {
    current.value--
    if(dataset.army0) drawArmy(dataset["army" + current.value])
})