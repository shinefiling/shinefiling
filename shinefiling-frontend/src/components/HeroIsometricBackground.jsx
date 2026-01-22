import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrthographicCamera,
    Environment,
    AccumulativeShadows,
    RandomizedLight,
    Float,
    RoundedBox
} from '@react-three/drei';
import * as THREE from 'three';

// --- THEME COLORS (SHINEFILING) ---
const C_NAVY = "#0f172a";      // Dark Slate Navy
const C_BRONZE = "#B58863";    // Brand Bronze/Brown
const C_GOLD = "#FCD34D";      // Gold Highlight
const C_ACCENT = "#D4B08C";    // Lighter Bronze
const C_WHITE = "#ffffff";     // White for lights

// --- COMPONENTS ---

// 1. Dynamic Hexagon Grid (Interactive)
const MovingHexagons = () => {
    const meshRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const { camera, pointer, raycaster } = useThree(); // Access Three.js internals
    const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 5), []); // Plane at y=-5
    const intersectPoint = useMemo(() => new THREE.Vector3(), []);

    // Create a grid of positions
    const { positions, colors } = useMemo(() => {
        const p = [];
        const c = [];
        const colorBronze = new THREE.Color(C_BRONZE);
        const colorNavy = new THREE.Color(C_NAVY).lerp(new THREE.Color("#1e293b"), 0.5);
        const colorGold = new THREE.Color(C_GOLD);

        // Slightly reduced density for performance with interaction
        const COLS = 60;
        const ROWS = 60;

        for (let x = 0; x < COLS; x++) {
            for (let z = 0; z < ROWS; z++) {
                const xPos = (x + (z % 2) * 0.5) * 2.0; // Wider spacing
                const zPos = z * 1.7;
                p.push(new THREE.Vector3(xPos - 60, -5, zPos - 50));

                const rand = Math.random();
                if (rand > 0.95) c.push(colorGold);
                else if (rand > 0.85) c.push(colorBronze);
                else c.push(colorNavy);
            }
        }
        return { positions: p, colors: c };
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            colors.forEach((color, i) => meshRef.current.setColorAt(i, color));
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [colors]);

    useFrame((state) => {
        if (!meshRef.current) return;

        // 1. Raycast to find mouse position on the grid
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(groundPlane, intersectPoint);

        const t = state.clock.getElapsedTime();

        positions.forEach((pos, i) => {
            const { x, z } = pos;

            // 2. Calculate Distance to Mouse
            const dist = Math.sqrt(Math.pow(x - intersectPoint.x, 2) + Math.pow(z - intersectPoint.z, 2));

            // 3. Interaction Wave (Lift up if close)
            let hoverLift = 0;
            if (dist < 12) {
                // Smooth falloff curve
                hoverLift = Math.cos((dist / 12) * (Math.PI / 2)) * 3.0;
            }

            // 4. Ambient Wave
            const waveY = Math.sin(t * 0.5 + x * 0.1 + z * 0.1) * 0.5;

            // Combine
            const finalY = waveY + hoverLift;

            dummy.position.set(x, -5 + finalY, z);
            dummy.scale.set(1, 1 + Math.max(0, finalY * 0.5), 1); // Scale with height
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, 3600]}>
            <cylinderGeometry args={[0.9, 0.9, 0.5, 6]} />
            <meshStandardMaterial roughness={0.2} metalness={0.6} />
        </instancedMesh>
    );
};

// Cursor Tracker Light
const CursorTracker = () => {
    const ref = useRef();
    const { camera, pointer, raycaster } = useThree();
    const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 4), []);
    const intersectPoint = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        if (!ref.current) return;
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(groundPlane, intersectPoint);

        // Smooth follow
        ref.current.position.lerp(intersectPoint, 0.1);
    });

    return (
        <mesh ref={ref} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.8, 32]} />
            <meshBasicMaterial color={C_GOLD} transparent opacity={0.5} />
            <pointLight distance={10} intensity={2} color={C_GOLD} />
        </mesh>
    );
};

// Animated Tech Rings Component
const TechRings = () => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.z -= delta * 0.5; // Constant Spin
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1; // Subtle Wobble
        }
    });

    return (
        <group position={[-1, 2.5, 0]}>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                <group ref={groupRef}>
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <torusGeometry args={[3.5, 0.02, 16, 64, Math.PI / 2]} />
                        <meshStandardMaterial color={C_GOLD} emissive={C_GOLD} emissiveIntensity={0.5} transparent opacity={0.6} />
                    </mesh>
                    <mesh rotation={[0, 0, -Math.PI / 4]}>
                        <torusGeometry args={[3, 0.02, 16, 64, Math.PI / 2]} />
                        <meshStandardMaterial color={C_ACCENT} emissive={C_ACCENT} emissiveIntensity={0.5} transparent opacity={0.4} />
                    </mesh>
                </group>
            </Float>
        </group>
    );
};

// --- 5. ANIMATED DATA FLOW (Proper Data Transfer Effect) ---
const AnimatedDataFlow = ({ start, end, color = "#38bdf8", count = 5, speed = 1 }) => {
    // Generate particles
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            offset: Math.random(), // Random start position along path
            speed: (Math.random() * 0.5 + 0.5) * speed, // Varying speed
        }));
    }, [count, speed]);

    const curve = useMemo(() => {
        // Create a gentle arc point between start and end
        const mid = new THREE.Vector3(
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 1.5, // Arch up slightly
            (start[2] + end[2]) / 2
        );
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(...start),
            mid,
            new THREE.Vector3(...end)
        ]);
    }, [start, end]);

    const groupRef = useRef();

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Update each particle's position
        groupRef.current.children.forEach((mesh, i) => {
            const data = particles[i];
            // Guard against the tube mesh or extra children
            if (!data) return;

            data.offset += delta * data.speed;
            if (data.offset > 1) data.offset = 0; // Loop

            const point = curve.getPoint(data.offset);
            mesh.position.set(point.x, point.y, point.z);

            // Tail/Stretch effect based on curve tangent could go here, but simple sphere is cleaner for "packets"
            const scaleScrubber = Math.sin(data.offset * Math.PI); // Fade in/out at ends
            mesh.scale.setScalar(scaleScrubber);
        });
    });

    return (
        <group ref={groupRef}>
            {/* Render particles */}
            {particles.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}
            {/* Faint path line for visual guide */}
            <mesh>
                <tubeGeometry args={[curve, 20, 0.01, 8, false]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

// --- 6. HOLOGRAPHIC SECURITY SCANNER (Replaces simple rings) ---
const SecurityScannerRings = () => {
    const r1 = useRef();
    const r2 = useRef();
    const r3 = useRef();

    useFrame((state, delta) => {
        if (r1.current) r1.current.rotation.z += delta * 0.2;
        if (r1.current) r1.current.rotation.y += delta * 0.1;

        if (r2.current) r2.current.rotation.x -= delta * 0.3;

        if (r3.current) r3.current.rotation.y += delta * 0.5;
    });

    return (
        <group position={[0, 5, -1]}> {/* Centered on Cloud */}
            {/* Ring 1 - Outer Slow */}
            <group ref={r1}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.0, 0.02, 16, 64]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
                </mesh>
            </group>

            {/* Ring 2 - Middle Vertical */}
            <group ref={r2}>
                <mesh>
                    <torusGeometry args={[1.8, 0.03, 16, 64]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
                </mesh>
                <mesh position={[1.8, 0, 0]}>
                    <sphereGeometry args={[0.08]} />
                    <meshBasicMaterial color="#facc15" />
                </mesh>
            </group>

            {/* Ring 3 - Inner Fast Scanner */}
            <group ref={r3}>
                <mesh rotation={[Math.PI / 4, 0, 0]}>
                    <torusGeometry args={[1.5, 0.05, 16, 64]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
                </mesh>
                {/* Scanning Beam Fan */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <ringGeometry args={[1.0, 1.5, 32, 1, 0, Math.PI / 4]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </group>
    );
};


// --- 7. FINANCE & AUDITING VECTORS (Specific to User Domain) ---

// A. Auditing Document with Checkmark
const VectorDocument = ({ position, rotation }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Paper Base */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.8, 2.4, 0.1]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
            {/* Header/Clip */}
            <mesh position={[0, 1, 0.08]}>
                <boxGeometry args={[0.8, 0.2, 0.1]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            {/* Green Checkmark (Audited) */}
            <group position={[0, 0, 0.15]}>
                <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, -0.5]}>
                    <boxGeometry args={[0.2, 1.0, 0.1]} />
                    <meshStandardMaterial color={C_GOLD} emissive="#ca8a04" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[-0.3, -0.2, 0]} rotation={[0, 0, 0.8]}>
                    <boxGeometry args={[0.2, 0.5, 0.1]} />
                    <meshStandardMaterial color={C_GOLD} emissive="#ca8a04" emissiveIntensity={0.5} />
                </mesh>
            </group>
            {/* Text Lines */}
            <mesh position={[0, -0.6, 0.06]}><planeGeometry args={[1.2, 0.1]} /><meshBasicMaterial color="#cbd5e1" /></mesh>
            <mesh position={[0, -0.9, 0.06]}><planeGeometry args={[1.2, 0.1]} /><meshBasicMaterial color="#cbd5e1" /></mesh>
        </group>
    );
};

// B. Finance Coins Stack
const VectorCoinStack = ({ position }) => {
    return (
        <group position={position}>
            {/* Staggered Stack */}
            <mesh position={[0, 0, 0]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.15, 32]} /><meshStandardMaterial color={C_GOLD} metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.15, 32]} /><meshStandardMaterial color={C_GOLD} metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[0.1, 0.4, 0.1]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.15, 32]} /><meshStandardMaterial color={C_GOLD} metalness={0.8} roughness={0.2} /></mesh>
            {/* Rupee Symbol Implied (Simple Line) */}
            <mesh position={[0.1, 0.48, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.4, 0.05]} />
                <meshBasicMaterial color="#78350f" />
            </mesh>
        </group>
    );
};

// C. Analysis Pie Chart
const VectorPieChart = ({ position }) => {
    const ref = useRef();
    useFrame((state) => { if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 });
    return (
        <group ref={ref} position={position} rotation={[0.4, -0.2, 0]}>
            {/* Main Slice (Navy) */}
            <mesh>
                <cylinderGeometry args={[1.2, 1.2, 0.2, 32, 1, false, 0, 5]} />
                <meshStandardMaterial color={C_NAVY} />
            </mesh>
            {/* Accent Slice (Bronze/Gold - popped out) */}
            <mesh position={[0.2, 0, 0.2]} rotation={[0, -0.5, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 0.2, 32, 1, false, 0, 1.2]} />
                <meshStandardMaterial color={C_BRONZE} />
            </mesh>
        </group>
    );
};

const VectorIconField = () => {
    return (
        <group>
            {/* 1. Large Audit Document (Left Background) - Replaces Gear */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <VectorDocument position={[-5, 3.5, 1]} rotation={[0, 0.5, -0.1]} />
            </Float>

            {/* 2. Coin Stack (Foreground Right) - Replaces Cyan Gear */}
            <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
                <VectorCoinStack position={[4.5, 0.5, 2.5]} />
            </Float>

            {/* 3. Pie Chart (Top Right) - Replaces Bronze Gear */}
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <VectorPieChart position={[4, 5, 0]} />
            </Float>

            {/* Floating Plus/Percent Math Symbols */}
            <Float speed={2} rotationIntensity={2} floatIntensity={1}>
                {/* Plus */}
                <group position={[6, 3, 1]}>
                    <mesh><boxGeometry args={[0.6, 0.15, 0.1]} /><meshBasicMaterial color="#38bdf8" /></mesh>
                    <mesh><boxGeometry args={[0.15, 0.6, 0.1]} /><meshBasicMaterial color="#38bdf8" /></mesh>
                </group>
                {/* Minus */}
                <mesh position={[-3, 6, -1]}><boxGeometry args={[0.6, 0.15, 0.1]} /><meshBasicMaterial color={C_BRONZE} /></mesh>
            </Float>
        </group>
    )
}

// --- 8. NEAT & PROFESSIONAL KINETIC SCULPTURE ---

const KineticCenterpiece = () => {
    const r1 = useRef();
    const r2 = useRef();
    const r3 = useRef();
    const core = useRef();

    useFrame((state, delta) => {
        // Smooth, slow, hypnotic rotations
        if (r1.current) { r1.current.rotation.x += delta * 0.1; r1.current.rotation.y += delta * 0.15; }
        if (r2.current) { r2.current.rotation.z -= delta * 0.1; r2.current.rotation.x -= delta * 0.05; }
        if (r3.current) { r3.current.rotation.y += delta * 0.05; }
        if (core.current) {
            core.current.rotation.y -= delta * 0.5;
            core.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
            core.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group position={[0, 0, 0]} scale={1.5}>

            {/* 1. The Core (Golden Octahedron) - Representing Value/Finance */}
            <mesh ref={core} castShadow>
                <octahedronGeometry args={[1.2, 0]} /> {/* Slightly larger core */}
                <meshStandardMaterial
                    color={C_GOLD}
                    roughness={0.1}
                    metalness={0.9}
                    emissive="#ca8a04"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Rings Removed as requested for cleaner look */}

            {/* 5. Minimal Base Shadow/Glow */}
            <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 2.5, 32]} />
                <meshBasicMaterial color={C_NAVY} transparent opacity={0.5} />
            </mesh>

        </group>
    );
};


// --- 9. FLOATING AMBIENT PARTICLES ---
const FloatingParticles = () => {
    const count = 50;
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        return new Array(count).fill().map(() => ({
            t: Math.random() * 100,
            factor: 20 + Math.random() * 100,
            speed: 0.01 + Math.random() / 200,
            x: (Math.random() - 0.5) * 30,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 30,
            mx: 0,
            my: 0
        }));
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(
                x + Math.cos(t / 10) * factor + (Math.sin(t * 1) * factor) / 10,
                y + Math.sin(t / 10) * factor + (Math.cos(t * 2) * factor) / 10,
                z + Math.cos(t / 10) * factor + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color={C_ACCENT} transparent opacity={0.4} />
        </instancedMesh>
    );
};

// 2. Right Side Floating Composition (CentralGraphic - Cleared/Placeholder)
const RightSideGraphic = () => {
    return null; // Cleared as requested, logic moved to main scene
};

const Scene = () => {
    return (
        <>
            {/* Lighting Studio - Warm Professional Tone - BOOSTED */}
            <ambientLight intensity={1.5} color={C_ACCENT} />
            <spotLight
                position={[10, 20, 10]}
                angle={0.25}
                penumbra={1}
                intensity={4} // Increased for pop
                castShadow
                shadow-bias={-0.0001}
                color={C_WHITE}
            />
            {/* Gold Rim Light for Premium Feel - BOOSTED */}
            <pointLight position={[-10, 5, -10]} intensity={3} color={C_GOLD} />

            <Environment preset="city" />

            {/* --- Isometric Composition --- */}
            <group rotation={[0, Math.PI / 4, 0]}> {/* Rotate 45deg for iso look */}

                {/* 1. The Floor Grid (Interactive) */}
                <MovingHexagons />

                {/* 2. Cursor Interaction (New) */}
                <CursorTracker />

                {/* 4. Beautiful Soft Shadows (Baked-like) */}
                <AccumulativeShadows
                    temporal
                    frames={60}
                    color={C_NAVY}
                    colorBlend={2}
                    toneMapped={true}
                    alphaTest={0.9}
                    opacity={0.7} // Darker shadows
                    scale={100}
                    position={[0, -4, 0]}
                >
                    <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 10, 5]} bias={0.001} />
                </AccumulativeShadows>

            </group>
        </>
    );
};



const HeroIsometricBackground = () => {
    const [config, setConfig] = useState({ zoom: 30, target: [0, 0, 0] }); // Default Desktop

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                // Mobile: Dynamic zoom to fit width
                setConfig({ zoom: width / 32, target: [6, 2, 0] });
            } else if (width < 1024) {
                // Tablet: Dynamic zoom
                setConfig({ zoom: width / 38, target: [3, 0, 0] });
            } else {
                // Desktop: Dynamic zoom Scaling
                // This keeps the "Field of View" constant in world units (~48 units wide)
                // So the desk at x=10 stays at the same relative screen position
                const dynamicZoom = width / 48;
                setConfig({ zoom: dynamicZoom, target: [0, 0, 0] });
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full bg-[#0F172A] z-0">
            {/* Gradient Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#020617]"></div>

            <Canvas shadows dpr={[1, 2]} camera={{ position: [20, 20, 20], zoom: config.zoom }}>
                {/* Camera Control - Dynamic LookAt */}
                <OrthographicCamera
                    makeDefault
                    position={[20, 20, 20]}
                    zoom={config.zoom}
                    onUpdate={c => c.lookAt(...config.target)}
                />
                <Scene />
            </Canvas>

            {/* 3. Color Overlay for Text Readability - Reduced Opacity as requested */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/30 to-transparent pointer-events-none w-full"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0F172A]/80 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default HeroIsometricBackground;
