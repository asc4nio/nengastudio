import * as THREE from 'three';

import denimDiffuseURL from '/denim-diffuse.jpg'
import denimNormalURL from '/denim-normal.jpg'
import denimBumpURL from '/denim-bump.jpg'
import denimRoughnessURL from '/denim-roughness.jpg'


const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

// manager.onLoad = function () {
//     console.log('Loading complete!');
// };

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function (url) {
    console.log('There was an error loading ' + url);
};



export const loadDenim = (scene) => {

    let textureScale = 0.5
    
    let denimTextures = {
        diffuse: {
            url: denimDiffuseURL,
            value: undefined
        },
        normal: {
            url: denimNormalURL,
            value: undefined
        },
        bump: {
            url: denimBumpURL,
            value: undefined
        },
        roughness: {
            url: denimRoughnessURL,
            value: undefined
        },
    }

    for (let key in denimTextures) {
        // console.log(denimTextures[key].url)

        loader.load(
            // resource URL
            denimTextures[key].url,

            // onLoad callback
            function (texture) {
                // in this example we create the material when the texture is loaded
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(textureScale, textureScale);
                texture.colorSpace = THREE.SRGBColorSpace;


                denimTextures[key].value = texture
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function (err) {
                console.error('An error happened.');
            }
        );

    }

    manager.onLoad = function () {
        console.log('window.denimMaterial Loading complete!');

        const denimMaterial = new THREE.MeshStandardMaterial({
            map: denimTextures.diffuse.value,
            normalMap: denimTextures.normal.value,
            // normalScale: new THREE.Vector2(1, 1),
            roughnessMap: denimTextures.roughness.value,
            bumpMap: denimTextures.bump.value,
        })

        const planeGeometry = new THREE.PlaneGeometry(
            1 * (window.innerHeight * threeParams.aspectRatio / window.innerHeight),
            1
        );
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
        });
        window.plane = new THREE.Mesh(planeGeometry, denimMaterial);
        plane.scale.set(threeParams.planeScale, threeParams.planeScale, 1);
        scene.add(plane);

    };

}


/*
// load a resource
loader.load(
    // resource URL
    'textures/land_ocean_ice_cloud_2048.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        const material = new THREE.MeshBasicMaterial( {
            map: texture
         } );
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' );
    }
);
*/