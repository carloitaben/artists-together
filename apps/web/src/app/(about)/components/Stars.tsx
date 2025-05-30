"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { motion, useScroll, useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"
import type { InstancedMesh } from "three"
import { Color, Matrix4, Object3D, Vector3 } from "three"
import { useMediaQuery } from "~/lib/media"
import { themeableColorRegex } from "~/lib/tailwind"
import { colors } from "../../../../tailwind.config"

const COUNT = 500
const XY_BOUNDS = 40
const Z_BOUNDS = 125
const MAX_SPEED_FACTOR = 2
const MAX_SCALE_FACTOR = 50

function parseColor(color: string) {
  const match = color.match(themeableColorRegex)

  if (!match) {
    throw Error(`Invalid color "${color}"`)
  }

  const [, r, g, b] = match

  return [
    parseInt(String(r)) / 255,
    parseInt(String(g)) / 255,
    parseInt(String(b)) / 255,
  ] as const
}

const COLORS = [
  parseColor(colors["arpeggio-black"][500]),
  parseColor(colors["smiley-yellow"][200]),
  parseColor(colors["microscopic-green"][300]),
]

const temp = new Matrix4()
const tempPos = new Vector3()
const tempObject = new Object3D()
const tempColor = new Color()

function Scene() {
  const ref = useRef<InstancedMesh>(null)
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion)")

  useEffect(() => {
    if (!ref.current) return

    const t = new Object3D()
    let j = 0
    let rnd = 0
    for (let i = 0; i < COUNT * 3; i += 3) {
      t.position.x = (Math.random() - 0.5) * XY_BOUNDS
      t.position.y = (Math.random() - 0.5) * XY_BOUNDS
      t.position.z = (Math.random() - 0.5) * Z_BOUNDS
      t.updateMatrix()
      tempColor.setRGB(...COLORS[rnd]!)
      rnd = ++rnd % COLORS.length
      ref.current.setMatrixAt(j++, t.matrix)
      ref.current.setColorAt(j, tempColor)
    }
  }, [])

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
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 size-full h-[100lvh] overflow-hidden pr-scrollbar"
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
