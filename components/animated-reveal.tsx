"use client"
import { type ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface AnimatedRevealProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
  className?: string
}

export default function AnimatedReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className = "",
}: AnimatedRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Define the initial and animate values based on the direction
  const getDirectionValues = () => {
    switch (direction) {
      case "up":
        return { y: 20 }
      case "down":
        return { y: -20 }
      case "left":
        return { x: 20 }
      case "right":
        return { x: -20 }
      default:
        return { y: 20 }
    }
  }

  const directionValues = getDirectionValues()

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, ...directionValues }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionValues }}
        transition={{
          duration,
          delay,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
