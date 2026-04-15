import { useContext } from 'react'
import { useModalContext } from './ModalProvider'

const useModal = () => {
  const ctx = useModalContext()
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return ctx
}

export default useModal
