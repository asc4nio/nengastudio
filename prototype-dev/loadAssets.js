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



import denimDiffuseURL from '/denim-diffuse.jpg'
import denimNormalURL from '/denim-normal.jpg'
import denimBumpURL from '/denim-bump.jpg'
import denimRoughnessURL from '/denim-roughness.jpg'


// import decal01DiffuseURL from '/test-02-diffuse.png'
// import decal01NormalURL from '/test-02-normal.jpg'
// import decal02DiffuseURL from '/test-01-diffuse.png'
// import decal02NormalURL from '/test-01-normal.jpg'

let decalsTextures = [
    [
        '/test-02-diffuse.png',
        '/test-02-normal.jpg'
    ],
    [
        '/test-01-diffuse.png',
        '/test-01-normal.jpg'
    ]
]



export const loadDenimMaterial = async () => {
    const denimDiffuseTexture = await loader.load(denimDiffuseURL);
    denimDiffuseTexture.wrapS = THREE.RepeatWrapping;
    denimDiffuseTexture.wrapT = THREE.RepeatWrapping;
    denimDiffuseTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );
    denimDiffuseTexture.colorSpace = THREE.SRGBColorSpace;

    const denimNormalTexture = await loader.load(denimNormalURL);
    denimNormalTexture.wrapS = THREE.RepeatWrapping;
    denimNormalTexture.wrapT = THREE.RepeatWrapping;
    denimNormalTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );

    const denimRoughnessTexture = await loader.load(denimRoughnessURL);
    denimRoughnessTexture.wrapS = THREE.RepeatWrapping;
    denimRoughnessTexture.wrapT = THREE.RepeatWrapping;
    denimRoughnessTexture.repeat.set(
        threeState.denimTextureScale * (window.innerWidth / window.innerHeight),
        threeState.denimTextureScale
    );

    const denimBumpTexture = await loader.load(denimBumpURL);
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

    for(let decalTexture of decalsTextures){
        const decalDiffuseTexture = await loader.load(decalTexture[0]);
        decalDiffuseTexture.colorSpace = THREE.SRGBColorSpace;
        const decalNormalTexture = await loader.load(decalTexture[1]);

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

