import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

// A shared "Back" button. navigate(-1) goes back one entry in history — like
// the browser's back button — so the user returns wherever they came from.
function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-muted transition hover:border-accent/40 hover:text-accent"
    >
      <FiArrowLeft size={16} />
      Back
    </button>
  )
}

export default BackButton
