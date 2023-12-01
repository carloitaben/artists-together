// Based on https://github.com/o2bomb/space-warp

import { Object3D, Matrix4, Vector3, Color } from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { useScroll, motion } from "framer-motion"

const COUNT = 500
const XY_BOUNDS = 40
const Z_BOUNDS = 20
const MAX_SPEED_FACTOR = 2
const MAX_SCALE_FACTOR = 50

function Scene() {
  const ref = useRef<THREE.InstancedMesh>(null)

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

  useFrame((_, delta) => {
    if (!ref.current) return

    const velocity = Math.abs(scrollYProgress.getVelocity() / 3)

    for (let i = 0; i < COUNT; i++) {
      ref.current.getMatrixAt(i, temp)

      // update scale
      tempObject.scale.set(0.5, 0.5, Math.max(0.5, velocity * MAX_SCALE_FACTOR))

      // update position
      tempPos.setFromMatrixPosition(temp)

      if (tempPos.z > Z_BOUNDS / 2) {
        tempPos.z = -Z_BOUNDS / 2
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.75, delay: 0.3 }}
      className="fixed inset-y-0 right-0 -left-16 -z-10 pointer-events-none"
    >
      <Canvas className="absolute inset-0 w-full h-full">
        <Scene />
      </Canvas>
    </motion.div>
  )
}
