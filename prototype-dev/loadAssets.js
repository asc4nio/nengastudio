import * as THREE from 'three';
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onLoad = function () {
    console.log('Loading complete!');
};
manager.onError = function (url) {
    console.log('There was an error loading ' + url);
};





export const loadDenimMaterial = async () => {
    let denimTextures = {
        diffuseURL: '/denim-diffuse-recolor.jpg',
        normalURL: '/denim-normal.jpg',
        bumpURL : '/denim-bump.jpg',
        roughnessURL : '/denim-roughness.jpg'
    }

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

    let decalsTextures = [
        {
            id: 0,
            diffuseURL : '/brush01-diffuse.png',
            normalURL : '/brush01-normal.jpg'
        },
        {
            id: 1,
            diffuseURL : '/brush02-diffuse.png',
            normalURL : '/brush02-normal.jpg'
        },
        {
            id: 2,
            diffuseURL : '/brush03-diffuse.png',
            normalURL : '/brush03-normal.jpg'
        },
    ]

    for(let decalTexture of decalsTextures){
        const decalDiffuseTexture = await loader.load(decalTexture.diffuseURL);
        decalDiffuseTexture.colorSpace = THREE.SRGBColorSpace;
        const decalNormalTexture = await loader.load(decalTexture.normalURL);

        const decalMaterial = new THREE.MeshPhongMaterial({
            specular: 0x444444,
            map: decalDiffuseTexture,
            normalMap: decalNormalTexture,
            normalScale: new THREE.Vector2(1, 1),
            shininess: 10,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
            wireframe: false,
        });
        
        decalsMaterials = [...decalsMaterials, decalMaterial]
    }

    // const decalDiffuseTexture = await loader.load(decalsTextures[1][0]);
    // decalDiffuseTexture.colorSpace = THREE.SRGBColorSpace;

    // const decalNormalTexture = await loader.load(decalsTextures[1][1]);

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

    return decalsMaterials
}

