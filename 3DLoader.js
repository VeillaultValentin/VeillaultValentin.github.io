loader3DViewer = (width, height, id, file) => {
    const target = document.getElementById(id)
    const progressBar = (target.getElementsByClassName("progress")[0] ? target.getElementsByClassName("progress")[0] : false)
    let progressIndex
    if (progressBar) progressIndex = target.getElementsByClassName("progress")[0].lastElementChild

    /* Scene setup */
    const scene = new THREE.Scene()

    const light1 = new THREE.PointLight(0x404040, 2, 100)
    light1.position.set(50, 50, 50);
    scene.add(light1)

    const light2 = new THREE.PointLight(0x404040, 2, 100)
    light2.position.set(50, 50, 0);
    scene.add(light2)

    const light3 = new THREE.PointLight(0x404040, 2, 100)
    light3.position.set(0, 50, 0);
    scene.add(light3)

    const ambientLight = new THREE.AmbientLight(0x404040, 3)
    scene.add(ambientLight)

    const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        1,
        50
    )
    camera.position.set(1.5, 1, 1.3)

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
        antialiasing: true
    })
    renderer.setPixelRatio(window.devicePixelRatio * 4)
    renderer.setSize(width, height)
    renderer.setClearColor(0xffffff, 0)
    renderer.outputEncoding = THREE.sRGBEncoding

    renderer.domElement.style.display = "none"

    target.appendChild(renderer.domElement)

    const controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false
    controls.enablePan = false
    controls.maxPolarAngle = 1.5
    controls.minPolarAngle = 1.5
    controls.target.set(0, 0.75, 0)

    /* Loader */
    /*const fbxLoader = new THREE.FBXLoader()
    fbxLoader.load(
        file,
        (object) => {
            object.scale.set(.01, .01, .01)
            scene.add(object)
        },
        (xhr) => {
            //console.log("3D Viewer loading '" + file + "': " + (xhr.loaded / xhr.total) * 100 + '%')
            progressIndex.style.width = (xhr.loaded / xhr.total) * 100 + "%"
            if ((xhr.loaded / xhr.total) == 1) {
                progressBar.style.display = "none"
                renderer.domElement.style.display = "block"
            }
        },
        (error) => {
            console.warn("3D Viewer error for file '" + file + "': ", error)
            progressIndex.style.width = "100%"
            progressIndex.innerText = "An error has occured"
            progressIndex.style.backgroundColor = "rgb(229, 77, 39)"
        }
    )*/

    const mtlLoader = new THREE.MTLLoader()
    const objLoader = new THREE.OBJLoader()
    file = file.split(".")[0]
    mtlLoader.load(file + ".mtl", (materials) => {
        materials.preload()

        /* setup custom material properties */
        for (let e in materials.materials) {
            materials.materials[e].shininess /= 10
            if (e.match("Clothes")) materials.materials[e].side = THREE.DoubleSide
        }

        objLoader.setMaterials(materials)
        objLoader.load(
            file + ".obj",
            (object) => {
                scene.add(object)
            },
            (xhr) => {
                //console.log("3D Viewer loading '" + file + ".obj': " + (xhr.loaded / xhr.total) * 100 + '%')
                progressIndex.style.width = (xhr.loaded / xhr.total) * 100 + "%"
                if ((xhr.loaded / xhr.total) == 1) {
                    progressBar.style.display = "none"
                    renderer.domElement.style.display = "block"
                }
            },
            (error) => {
                console.warn("3D Viewer error for file '" + file + ".obj': ", error)
                progressIndex.style.width = "100%"
                progressIndex.innerText = "An error has occured"
                progressIndex.style.backgroundColor = "rgb(229, 77, 39)"
            }
        )
    })

    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        render()
    }

    function animate() {
        requestAnimationFrame(animate)
        controls.update()
        render()
    }

    function render() {
        renderer.render(scene, camera)
    }

    animate()
}