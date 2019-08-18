import Particle from "./particle.js"
import Vector3D from "./vector3d.js";

const WIDTH  = 500;  // x 500
const HEIGHT = 200;  // y
const DEPTH  = 200;  // z

const NUM_PARTICLES = 200;
const VELOCITY_PARTICLES = 100; 

const SPHERE_RADIUS = 5;

// crea una scena
let scene = new THREE.Scene();

// crea le particelle
let particelsArray = [];
let sphereGroup = new THREE.Group();
let sphereGeometry = new THREE.SphereGeometry( SPHERE_RADIUS, 20, 20 );
let sphereMaterial = new THREE.MeshPhysicalMaterial( { color: 0x3BB9FF } );

addParticles( particelsArray, NUM_PARTICLES, 1, SPHERE_RADIUS, VELOCITY_PARTICLES,
              sphereGeometry, sphereMaterial,
              0, - WIDTH / 2, HEIGHT / 2, - HEIGHT / 2, DEPTH / 2, - DEPTH / 2 )

sphereMaterial = new THREE.MeshPhysicalMaterial( { color: 0xE41B17 } );
addParticles( particelsArray, NUM_PARTICLES, 1, SPHERE_RADIUS, VELOCITY_PARTICLES,
              sphereGeometry, sphereMaterial,
              WIDTH / 2, 0, HEIGHT / 2, - HEIGHT / 2, DEPTH / 2, - DEPTH / 2 )

scene.add( sphereGroup );

// crea una camera con prospettiva
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

// posiziona la camera e la punta al centro della scena
camera.position.set( 200, 200, -500 );
camera.lookAt( scene.position );
// ... per controllo della camera
let clock = new THREE.Clock();
let trackballControls = new THREE.TrackballControls( camera );
trackballControls.rotateSpeed = 1.0;
trackballControls.zoomSpeed = 1.0;
trackballControls.panSpeed = 1.0;

// crea un render
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor( new THREE.Color( 0x000000 ) ); //0x747170
renderer.setSize( window.innerWidth, window.innerHeight );

// crea una scatola trasparente 
let boxGeometry = new THREE.BoxGeometry( WIDTH, HEIGHT, DEPTH );

let boxMaterial = new THREE.MeshLambertMaterial( { opacity: 0.2, color: 0x00FFFF, transparent: true, side: THREE.DoubleSide } );
let box = new THREE.Mesh( boxGeometry, boxMaterial );
//box.position.y = HEIGHT / 2;
//box.position.z = DEPTH / 2;
scene.add( box );

// evidenzia gli spigoli della scatola
let boxEdgesGeometry = new THREE.EdgesGeometry( boxGeometry );
let boxEdge = new THREE.LineSegments( boxEdgesGeometry, new THREE.LineBasicMaterial( {color:0x00ff00} ) );
//scene.add( boxEdge );

// aggiunge un luce ambiente (uniforme) alla scena
let ambienLight = new THREE.AmbientLight( 0x353535 );
scene.add( ambienLight );

// aggiunge un "proiettore" utilizzato per i riflessi e, eventualmente, per le ombre
let spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set( 300, 300, -300 );
spotLight.castShadow = true;
scene.add( spotLight );

// aggiunge il render all'elemento html
document.getElementById( "webgl-output" ).appendChild( renderer.domElement );

let step = 0;
renderScene();
//renderer.render( scene, camera );

// crea un array di particelle uguali
function addParticles( particelsArray, numberParticles, 
                       mass, radius, velocity,
                       sphereGeometry, sphereMaterial,
                       wallXplus, wallXminus, wallYplus, wallYminus, wallZplus, wallZminus )
{
    for ( let i = 0; i < numberParticles; i++ )
    {
        // posizione casuale della particella
        let pos;
        let overlap = false;
        do
        {
            pos = new Vector3D( Math.random() * ( wallXplus - wallXminus - 2 * radius ) + radius + wallXminus,  
                                Math.random() * ( wallYplus - wallYminus - 2 * radius ) + radius + wallYminus,
                                Math.random() * ( wallZplus - wallZminus - 2 * radius ) + radius + wallZminus );

            // controllo sovrapposizione con le particelle già prodotte
            overlap = false;
            particelsArray.forEach( particle => {
                let p2 = new Vector3D( pos.x, pos.y, pos.z );
                if ( p2.subtract( particle.p ).module() < 2 * radius ) { overlap = true; }
            } );

        } while ( overlap === true );

        // aggiunta una nuova particella
        const newParticle = new Particle( mass, pos, radius );
        newParticle.v = new Vector3D( velocity * 2 * ( Math.random() - 0.5 ),
                                      velocity * 2 * ( Math.random() - 0.5 ),
                                      velocity * 2 * ( Math.random() - 0.5 ) );

        particelsArray.push( newParticle );

        // aggiunge una nuova sfera
        let newSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );                                   
        sphereGroup.add( newSphere );
    }

}


function checkCollision()
{
    for ( let i = 0; i < particelsArray.length -1; i++ )
    {
        const p1 = particelsArray[ i ];
        for ( let j = i + 1; j < particelsArray.length; j++ )
        {
            const p2 = particelsArray[ j ];
            p1.checkCollision( p2 );
            // collisioni con i bordi p1
            p1.checkXplusWallCollision( WIDTH / 2 );
            p1.checkXminusWallCollision( - WIDTH / 2 );
            p1.checkYplusWallCollision( HEIGHT / 2 );
            p1.checkYminusWallCollision( - HEIGHT / 2 );
            p1.checkZplusWallCollision( DEPTH / 2 );
            p1.checkZminusWallCollision( - DEPTH / 2 );
        
            // collisioni con i bordi p2
            p2.checkXplusWallCollision( WIDTH / 2 );
            p2.checkXminusWallCollision( - WIDTH / 2 );
            p2.checkYplusWallCollision( HEIGHT / 2 );
            p2.checkYminusWallCollision( - HEIGHT / 2 );
            p2.checkZplusWallCollision( DEPTH / 2 );
            p2.checkZminusWallCollision( - DEPTH / 2 );
        }
    }     
}


function renderScene() 
{
    const dt = clock.getDelta();
  
    // muove tutte le particelle
    particelsArray.forEach( particle => {
        particle.move( dt );
    } );

    // controlla tutte le collisioni e riposiziona se serve
    checkCollision();

    // aggiorna la rappresentazione grafica delle particelle
    let i = 0;
    sphereGroup.traverse( sphere => {
        if ( sphere instanceof THREE.Mesh ) 
        {
            sphere.position.x = particelsArray[ i ].p.x;
            sphere.position.y = particelsArray[ i ].p.y;
            sphere.position.z = particelsArray[ i ].p.z;
            i++;
        }
    } );

    trackballControls.update( clock.getDelta() );

    // render con requestAnimationFrame
    requestAnimationFrame( renderScene );
    renderer.render( scene, camera );
}



