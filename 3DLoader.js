loader3DViewer = (width, height, id, file) => {
    /* Scene setup */
    const scene = new THREE.Scene()

    const light1 = new THREE.PointLight(0x404040, 1.5, 100)
    light1.position.set(50, 50, 50);
    scene.add(light1)

    const light2 = new THREE.PointLight(0x404040, 1.5, 100)
    light2.position.set(50, 50, 0);
    scene.add(light2)

    const light3 = new THREE.PointLight(0x404040, 1.5, 100)
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
    renderer.setPixelRatio(window.devicePixelRatio * 2)
    renderer.setSize(width, height)
    renderer.setClearColor(0xffffff, 0)
    renderer.outputEncoding = THREE.sRGBEncoding

    document.getElementById(id).appendChild(renderer.domElement)

    const controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false
    controls.enablePan = false
    controls.maxPolarAngle = 1.5
    controls.minPolarAngle = 1.5
    controls.target.set(0, 0.75, 0)

    const material = new THREE.MeshLambertMaterial()
    //material.map = 
    /* Loader */
    const fbxLoader = new THREE.FBXLoader()
    fbxLoader.load(
        file,
        (object) => {
            object.scale.set(.01, .01, .01)
            scene.add(object)
        },
        (xhr) => {
            console.log("3D Viewer loading: " + (xhr.loaded / xhr.total) * 100 + '%')
        },
        (error) => {
            console.log("3D Viewer error: ", error)
        }
    )

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

        //console.log(camera.getWorldDirection(controls.target))
    }

    function render() {
        renderer.render(scene, camera)
    }

    animate()

}