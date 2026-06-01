import { motion, useReducedMotion } from 'motion/react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

interface Props {
  filled: boolean
  // Extra classes for the filled heart (e.g. a colour), since callers differ.
  filledClassName?: string
}

// The heart icon used in every favorite/wishlist button. Changing `filled`
// swaps the key, remounting the icon so it "pops" in via a spring.
function FavoriteHeart({ filled, filledClassName }: Props) {
  const reduce = useReducedMotion()
  // One object so the reduced-motion fork is a single branch.
  const pop = reduce
    ? {}
    : {
        initial: { scale: 0.5 },
        animate: { scale: 1 },
        transition: { type: 'spring' as const, stiffness: 600, damping: 15 },
      }

  return (
    <motion.span
      key={filled ? 'filled' : 'empty'}
      {...pop}
      className="inline-flex"
    >
      {filled ? <FaHeart className={filledClassName} /> : <FaRegHeart />}
    </motion.span>
  )
}

export default FavoriteHeart
