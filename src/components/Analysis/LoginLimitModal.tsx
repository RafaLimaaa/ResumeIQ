import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface Props {
  open: boolean
  onClose: () => void
  onSignIn: () => void
}

export function LoginLimitModal({ open, onClose, onSignIn }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Limite atingido">
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Você utilizou todas as suas análises gratuitas. Faça login com Google para continuar com
          análises ilimitadas.
        </p>
        <Button className="w-full" onClick={() => { onClose(); onSignIn() }}>
          Entrar com Google
        </Button>
        <button
          onClick={onClose}
          className="w-full text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  )
}
