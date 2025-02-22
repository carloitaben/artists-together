import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { useScroll, motion, useSpring } from "motion/react"
import type { InstancedMesh } from "three"
import { Object3D, Matrix4, Vector3, Color } from "three"
import { useMediaQuery } from "~/lib/media"

const COUNT = 500
const XY_BOUNDS = 40
const Z_BOUNDS = 100
const MAX_SPEED_FACTOR = 2
const MAX_SCALE_FACTOR = 50

function Scene() {
  const ref = useRef<InstancedMesh>(null)
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion)")

  useEffect(() => {
    if (!ref.current) return

    const t = new Object3D()
    let j = 0
    for (let i = 0; i < COUNT * 3; i += 3) {
      t.position.x = (Math.random() - 0.5) * XY_BOUNDS
      t.position.y = (Math.random() - 0.5) * XY_BOUNDS
      t.position.z = (Math.random() - 0.5) * Z_BOUNDS
      t.updateMatrix()
      ref.current.setMatrixAt(j++, t.matrix)
    }
  }, [])

  const temp = new Matrix4()
  const tempPos = new Vector3()
  const tempObject = new Object3D()
  const tempColor = new Color()

  const { scrollYProgress } = useScroll()
  const y = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  })

  useFrame((_, delta) => {
    if (!ref.current) return

    const velocity = prefersReducedMotion ? 0 : Math.abs(y.getVelocity() / 3)

    for (let i = 0; i < COUNT; i++) {
      ref.current.getMatrixAt(i, temp)

      // update scale
      tempObject.scale.set(0.5, 0.5, Math.max(0.5, velocity * MAX_SCALE_FACTOR))

      // update position
      tempPos.setFromMatrixPosition(temp)

      if (tempPos.z > Z_BOUNDS / 2) {
        const max = -Z_BOUNDS / 2
        tempPos.z = Math.random() * max
      } else {
        tempPos.z += Math.max(delta, velocity * MAX_SPEED_FACTOR)
      }

      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z)

      // apply transforms
      tempObject.updateMatrix()
      ref.current.setMatrixAt(i, tempObject.matrix)

      // update and apply color
      if (tempPos.z > 0) {
        tempColor.r = tempColor.g = tempColor.b = 1
      } else {
        tempColor.r =
          tempColor.g =
          tempColor.b =
            1 - tempPos.z / (-Z_BOUNDS / 2)
      }
      ref.current.setColorAt(i, tempColor)
    }

    ref.current.instanceMatrix.needsUpdate = true

    if (ref.current.instanceColor) {
      ref.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, COUNT]}
        matrixAutoUpdate
      >
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={[1.5, 1.5, 1.5]} toneMapped={false} />
      </instancedMesh>
    </>
  )
}

export default function Stars() {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 1.75, delay: 0.3 }}
      className="pointer-events-none fixed inset-y-0 -left-16 right-0 -z-10 size-full"
      aria-hidden
    >
      <Canvas
        className="absolute inset-0 size-full"
        onCreated={() => setLoaded(true)}
      >
        <Scene />
      </Canvas>
    </motion.div>
  )
}
