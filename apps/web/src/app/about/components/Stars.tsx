"use client"

import { useEffect, useRef, useState } from "react"
import { useScroll, motion, useSpring, useReducedMotion } from "motion/react"
import { InstancedMesh, MeshBasicMaterial, SphereGeometry } from "three"
import {
  Object3D,
  Matrix4,
  Vector3,
  Color,
  Clock,
  WebGLRenderer,
  PerspectiveCamera,
} from "three"
import { Scene as ThreeScene } from "three"
import { colors as tailwindColors } from "~/../tailwind.config"
import { themeableColorRegex } from "~/lib/tailwind"

function dothething(color: string) {
  const [, r, g, b] = color.match(themeableColorRegex)
  return [parseInt(r) / 255, parseInt(g) / 255, parseInt(b) / 255]
}

const colors = [
  dothething(tailwindColors["acrylic-red"][400]),
  dothething(tailwindColors["outsider-violet"][400]),
  dothething(tailwindColors["ruler-cyan"][400]),
]

const COUNT = 2500
const Z_BOUNDS = 100
const MAX_SPEED_FACTOR = 2
const MAX_SCALE_FACTOR = 50
const MIN_Z_DISTANCE = -3

// TODO? move this?
function getZ() {
  const z = (Math.random() - 0.5) * Z_BOUNDS
  return z > MIN_Z_DISTANCE && 5 < -MIN_Z_DISTANCE
    ? z > 0
      ? MIN_Z_DISTANCE
      : -MIN_Z_DISTANCE
    : z
}

export default function Stars() {
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const y = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  })
  useEffect(() => {
    if (!canvasRef.current) return
    const temp = new Matrix4()
    const tempPos = new Vector3()
    const tempObject = new Object3D()
    const tempColor = new Color()
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    const scene = new ThreeScene()
    const clock = new Clock()
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      400,
    )

    camera.position.z = 3
    camera.lookAt(0, 0, 0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    const calculateBoundsAtDepth = (z: number) => {
      const heightAtDepth =
        Math.tan((camera.fov * Math.PI) / 360) * Math.abs(z) * 2
      const widthAtDepth = heightAtDepth * aspectRatio
      return { x: widthAtDepth / 2, y: heightAtDepth / 2 }
    }

    // TODO? throttle this bitch?
    window.addEventListener("resize", resize)
    renderer.setClearColor(0x000000, 0)
    const sphere = new SphereGeometry(0.0175)
    const material = new MeshBasicMaterial({
      color: new Color().setRGB(1.5, 1.5, 1.5),
      toneMapped: false,
    })
    const ADAPTIVE_COUNT = COUNT * window.devicePixelRatio
    const instancedMesh = new InstancedMesh(sphere, material, ADAPTIVE_COUNT)
    const t = new Object3D()
    const aspectRatio = window.innerWidth / window.innerHeight

    // Calculate screen bounds based on camera's FOV and aspect ratio
    const screenHeight =
      Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * 2
    const screenWidth = screenHeight * aspectRatio

    // Render
    let rnd = 0
    for (let i = 0, j = 0; i < ADAPTIVE_COUNT * 3; i += 3) {
      // t.position.x = (Math.random() - 0.5) * xBounds
      // t.position.y = (Math.random() - 0.5) * yBounds
      t.position.z = getZ()
      const bounds = calculateBoundsAtDepth(t.position.z)
      t.position.x = (Math.random() - 0.5) * bounds.x * 2
      t.position.y = (Math.random() - 0.5) * bounds.y * 2
      t.position.z += (Math.random() + 100) * 100

      t.updateMatrix()
      instancedMesh.setMatrixAt(j++, t.matrix)
      tempColor.setRGB(...colors[rnd])
      rnd = ++rnd % colors.length
      console.log(rnd)
      instancedMesh.setColorAt(j, tempColor)
    }
    scene.add(instancedMesh)
    scene.matrixWorldAutoUpdate = true
    setLoaded(true)
    const tick = () => {
      const delta = clock.getDelta()
      // Update controls

      let velocity = reducedMotion ? 0 : Math.abs(y.getVelocity() / 3)
      if (reducedMotion && y.getVelocity() > 0) {
        velocity *= 1 + y.getVelocity() * 0.5
      }

      for (let i = 0; i < ADAPTIVE_COUNT; i++) {
        instancedMesh.getMatrixAt(i, temp)

        // update scale
        tempObject.scale.set(0.5, 0.5, Math.max(0, velocity * MAX_SCALE_FACTOR))

        // update position
        tempPos.setFromMatrixPosition(temp)

        if (tempPos.z > Z_BOUNDS / 2 - 12) {
          tempPos.z = getZ()
          const bounds = calculateBoundsAtDepth(tempPos.z)
          tempPos.x = (Math.random() - 0.5) * bounds.x * 2
          tempPos.y = (Math.random() - 0.5) * bounds.y * 2

          tempColor.setRGB(...colors[rnd])
          rnd = ++rnd % colors.length
          console.log(rnd)
          instancedMesh.setColorAt(i, tempColor)
        } else {
          // Update z position based on velocity
          tempPos.z += Math.max(delta / 2, velocity * MAX_SPEED_FACTOR)
        }

        tempObject.position.set(tempPos.x, tempPos.y, tempPos.z)

        tempObject.updateMatrix()
        instancedMesh.setMatrixAt(i, tempObject.matrix)

        // update and apply color
      }

      instancedMesh.instanceMatrix.needsUpdate = true

      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true
      }
      scene.matrixWorldNeedsUpdate = true
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }
    tick()
    return () => window.removeEventListener("resize", resize)
  }, [reducedMotion, y])

  return (
    <motion.div
      initial={false}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 1.75, delay: 0.3 }}
      className="fixed inset-0 -z-10"
      aria-hidden
    >
      <canvas className="absolute inset-0 size-full" ref={canvasRef} />
    </motion.div>
  )
}
