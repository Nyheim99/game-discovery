import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FiArrowUp } from 'react-icons/fi'

// A floating button that appears once the page is scrolled down (handy with the
// infinite-scroll grid) and jumps back to the top.
function BackToTop() {
  const [show, setShow] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
          }
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition hover:opacity-90"
        >
          <FiArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
