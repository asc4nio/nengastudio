import * as THREE from 'three';
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.debug('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.debug('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    let loadingDiv = document.getElementById('loading-overlay')
    loadingDiv.innerText = 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.'

};
manager.onLoad = function () {
    console.debug('Loading complete!');

    let loadingDiv = document.getElementById('loading-overlay')
    loadingDiv.innerText = 'Loading complete'
    loadingDiv.classList = 'is--away'
    setTimeout(() => {
        loadingDiv.remove()
    }, 1000);
};
manager.onError = function (url) {
    console.debug('There was an error loading ' + url);
};

export const loadLogoMaterial = async () => {
    let logoTextureURL = 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/logo-overlay.png'
    const logoTexture = await loader.load(logoTextureURL);
    // logoTexture.colorSpace = THREE.SRGBColorSpace;
    // logoTexture.colorSpace = THREE.NoColorSpace
    // logoTexture.colorSpace = THREE.LinearSRGBColorSpace

    const logoMaterial = new THREE.MeshPhongMaterial({
        map: logoTexture,
        transparent: true,

        // blending: THREE.MultiplyBlending,

        blending: THREE.CustomBlending,

        blendEquation: THREE.AddEquation  , 
        // blendEquation: THREE.SubtractEquation  , 
        // blendEquation: THREE.ReverseSubtractEquation , 
        // blendEquation: THREE.MinEquation  , 
        // blendEquation: THREE.MaxEquation , 

        // blendEquationAlpha: THREE.AddEquation  , 
        // blendEquationAlpha: THREE.SubtractEquation  , 
        // blendEquationAlpha: THREE.ReverseSubtractEquation , 
        // blendEquationAlpha: THREE.MinEquation  , 
        blendEquationAlpha: THREE.MaxEquation , 


        opacity: 0.1,

    });

    return logoMaterial
}

export const loadDenimMaterial = async () => {
    // let denimTextures = {
    //     diffuseURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim-diffuse-recolor.jpg',
    //     normalURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim-normal.jpg',
    //     bumpURL : 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim-bump.jpg',
    //     roughnessURL : 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim-roughness.jpg'
    // }

    let denimTextures = {
        diffuseURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim02-diffuse.jpg',
        normalURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim02-normal.jpg',
        bumpURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim02-bump.jpg',
        roughnessURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/denim02-roughness.jpg'
    }

    // let denimTextures = {
    //     diffuseURL: '/denim02-diffuse.jpg',
    //     normalURL: '/denim02-normal.jpg',
    //     bumpURL : '/denim02-bump.jpg',
    //     roughnessURL : '/denim02-roughness.jpg'
    // }

    const denimDiffuseTexture = await loader.load(denimTextures.diffuseURL);
    denimDiffuseTexture.wrapS = THREE.RepeatWrapping;
    denimDiffuseTexture.wrapT = THREE.RepeatWrapping;
    denimDiffuseTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );
    denimDiffuseTexture.colorSpace = THREE.SRGBColorSpace;

    const denimNormalTexture = await loader.load(denimTextures.normalURL);
    denimNormalTexture.wrapS = THREE.RepeatWrapping;
    denimNormalTexture.wrapT = THREE.RepeatWrapping;
    denimNormalTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );

    const denimRoughnessTexture = await loader.load(denimTextures.roughnessURL);
    denimRoughnessTexture.wrapS = THREE.RepeatWrapping;
    denimRoughnessTexture.wrapT = THREE.RepeatWrapping;
    denimRoughnessTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );

    const denimBumpTexture = await loader.load(denimTextures.bumpURL);
    denimBumpTexture.wrapS = THREE.RepeatWrapping;
    denimBumpTexture.wrapT = THREE.RepeatWrapping;
    denimBumpTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );

    const denimMaterial = new THREE.MeshPhysicalMaterial({
        // specular: 0x444444,
        map: denimDiffuseTexture,
        normalMap: denimNormalTexture,
        normalScale: new THREE.Vector2(1, 1),
        roughnessMap: denimRoughnessTexture,
        bumpMap: denimBumpTexture,
        // shininess: 30,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        // polygonOffsetFactor: -4,
        wireframe: false,
    });

    return denimMaterial
}


export const loadDecalsMaterial = async () => {
    let decalsMaterials = []

    // let decalsTextures = [
    //     {
    //         id: 0,
    //         diffuseURL : '/brush01-diffuse.png',
    //         normalURL : '/brush01-normal.jpg'
    //     },
    //     {
    //         id: 1,
    //         diffuseURL : '/brush02-diffuse.png',
    //         normalURL : '/brush02-normal.jpg'
    //     },
    //     {
    //         id: 2,
    //         diffuseURL : '/brush03-diffuse.png',
    //         normalURL : '/brush03-normal.jpg'
    //     },
    // ]

    let decalsTextures = [
        {
            id: 0,
            diffuseURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/brush01-diffuse.png',
            normalURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/brush01-normal.jpg'
        },
        {
            id: 1,
            diffuseURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/brush02-diffuse.png',
            normalURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/brush02-normal.jpg'
        },
        {
            id: 2,
            diffuseURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/brush03-diffuse.png',
            normalURL: 'https://asc4nio.github.io/nengastudio/prototype-dev/dist/brush03-normal.jpg'
        },
    ]

    for (let decalTexture of decalsTextures) {
        const decalDiffuseTexture = await loader.load(decalTexture.diffuseURL);
        decalDiffuseTexture.colorSpace = THREE.SRGBColorSpace;
        const decalNormalTexture = await loader.load(decalTexture.normalURL);

        const decalMaterial = new THREE.MeshPhongMaterial({
            specular: 0x444444,
            map: decalDiffuseTexture,
            normalMap: decalNormalTexture,
            // normalScale: new THREE.Vector2(1, 1),
            shininess: 10,
            transparent: true,
            // depthTest: true,
            // depthWrite: false,
            // polygonOffset: true,
            // polygonOffsetFactor: -4,
        });

        // const decalMaterial = new THREE.MeshPhongMaterial({
        //     specular: 0x444444,
        //     map: decalDiffuseTexture,
        //     normalMap: decalNormalTexture,
        //     normalScale: new THREE.Vector2(1, 1),
        //     shininess: 10,
        //     transparent: true,
        //     depthTest: true,
        //     depthWrite: false,
        //     polygonOffset: true,
        //     polygonOffsetFactor: -4,
        //     wireframe: false,
        // });

        decalsMaterials = [...decalsMaterials, decalMaterial]
    }

    return decalsMaterials
}

