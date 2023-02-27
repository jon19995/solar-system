import {
	WebGLRenderer,
	Scene,
	CubeTextureLoader,
	TextureLoader,
	PerspectiveCamera,
	AmbientLight,
	PointLight,
	SphereGeometry,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Object3D,
	Mesh,
	RingGeometry,
	DoubleSide,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import {
	stars,
	sun,
	mercury,
	venus,
	neptune,
	mars,
	jupiter,
	pluton,
	saturn,
	uranus,
	uranus_ring,
	earth,
	saturn_ring,
} from '@img';

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
camera.position.set(-90, 140, 140);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const scene = new Scene();
const textureLoader = new TextureLoader();
const cubeTextureLoader = new CubeTextureLoader();
scene.background = cubeTextureLoader.load([
	stars,
	stars,
	stars,
	stars,
	stars,
	stars,
]);


const ambientLight = new AmbientLight('#333');
scene.add(ambientLight);
const pointLight = new PointLight('#fff', 2, 300);
scene.add(pointLight);

// Ф-ия создание планеты
const createPlanet = (distance, size, texture, ringConfig) => {
	const center = new Object3D();
	const planetGeametry = new SphereGeometry(size, 30, 30);
	const planetMaterial = new MeshStandardMaterial({ map: textureLoader.load(texture) });
	const planet = new Mesh(planetGeametry, planetMaterial);

	if (ringConfig) {
		const ringGeometry = new RingGeometry(ringConfig.innerRadius, ringConfig.outerRadius, 32);
		const ringMaterial = new MeshStandardMaterial({
			map: textureLoader.load(ringConfig.texture),
			side: DoubleSide,
		});
		const ring = new Mesh(ringGeometry, ringMaterial);
		ring.rotation.x = -0.5 * Math.PI;
		planet.add(ring);
	}
	planet.position.x = distance;
	scene.add(center);
	center.add(planet);

	return { center, planet };
};
// Интерфейс управления
const gui = new GUI();
const options = { speed: 1 };
gui.add(options, 'speed', 0.1, 10);

// Создание солнца
const sunGeametry = new SphereGeometry(16, 30, 30);
const sunMaterial = new MeshBasicMaterial({ map: textureLoader.load(sun) });
const sunPlanet = new Mesh(sunGeametry, sunMaterial);
scene.add(sunPlanet);

// Создание планет
const mercuryPlanet = createPlanet(28, 3.2, mercury);
const venusPlanet = createPlanet(44, 5.8, venus);
const earthPlanet = createPlanet(62, 6, earth);
const marsPlanet = createPlanet(78, 4, mars);
const jupiterPlanet = createPlanet(100, 12, jupiter);
const saturnPlanet = createPlanet(138, 10, saturn, {
	innerRadius: 10,
	outerRadius: 20,
	texture: saturn_ring,
});
const uranusPlanet = createPlanet(176, 7, uranus, {
	innerRadius: 7,
	outerRadius: 12,
	texture: uranus_ring,
});
const neptunePlanet = createPlanet(200, 7, neptune);
const plutoPlanet = createPlanet(216, 2.8, pluton);

// Обновление каждые 60с
const animate = () => {
	// Собственное вращение:
	sunPlanet.rotateY(0.004 * options.speed);
	mercuryPlanet.planet.rotateY(0.004 * options.speed);
	venusPlanet.planet.rotateY(0.002 * options.speed);
	earthPlanet.planet.rotateY(0.02 * options.speed);
	marsPlanet.planet.rotateY(0.018 * options.speed);
	jupiterPlanet.planet.rotateY(0.04 * options.speed);
	saturnPlanet.planet.rotateY(0.038 * options.speed);
	uranusPlanet.planet.rotateY(0.03 * options.speed);
	neptunePlanet.planet.rotateY(0.032 * options.speed);
	plutoPlanet.planet.rotateY(0.008 * options.speed);

	// Вращение вокруг солнца
	mercuryPlanet.center.rotateY(0.04 * options.speed);
	venusPlanet.center.rotateY(0.015 * options.speed);
	earthPlanet.center.rotateY(0.01 * options.speed);
	marsPlanet.center.rotateY(0.008 * options.speed);
	jupiterPlanet.center.rotateY(0.002 * options.speed);
	saturnPlanet.center.rotateY(0.0009 * options.speed);
	uranusPlanet.center.rotateY(0.0004 * options.speed);
	neptunePlanet.center.rotateY(0.0001 * options.speed);
	plutoPlanet.center.rotateY(0.00007 * options.speed);

	requestAnimationFrame(animate);
	renderer.render(scene, camera);

};

animate();

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

