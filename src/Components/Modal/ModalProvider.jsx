import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const ModalContext = createContext(null)

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'info', resolve: null, timeout: 0 })
  const timerRef = useRef(null)

  useEffect(() => {
    if (modal.open && modal.timeout > 0) {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        // auto-close info modals (resolve true)
        if (modal.resolve) modal.resolve(true)
        setModal({ open: false, title: '', message: '', type: 'info', resolve: null, timeout: 0 })
      }, modal.timeout)
    }
    return () => clearTimeout(timerRef.current)
  }, [modal])

  // showAlert: message (string or JSX), title?, options?: { timeout }
  const showAlert = (message, title = 'Notice', options = {}) =>
    new Promise((res) => {
      setModal({ open: true, title, message, type: 'info', resolve: res, timeout: options.timeout || 0 })
    })

  const showConfirm = (message, title = 'Confirm', options = {}) =>
    new Promise((res) => {
      setModal({ open: true, title, message, type: 'confirm', resolve: res, timeout: options.timeout || 0 })
    })

  const close = (result = true) => {
    if (modal.resolve) modal.resolve(result)
    clearTimeout(timerRef.current)
    setModal({ open: false, title: '', message: '', type: 'info', resolve: null, timeout: 0 })
  }

  const Icon = ({ type }) => {
    if (type === 'confirm') {
      return (
        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      )
    }
    return (
      <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15H11v-2h2v2zm0-4H11V7h2v6z" />
      </svg>
    )
  }

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {modal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all duration-200 scale-100">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <Icon type={modal.type} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">{modal.title}</h3>
                    <button
                      onClick={() => close(false)}
                      className="text-slate-400 hover:text-slate-600 ml-3"
                      aria-label="Close modal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-2 text-sm text-slate-600">{modal.message}</div>

                  <div className="mt-5 flex justify-end gap-3">
                    {modal.type === 'confirm' && (
                      <button
                        className="px-4 py-2 rounded-lg bg-gray-100 text-slate-700"
                        onClick={() => close(false)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="px-4 py-2 rounded-lg bg-red-700 text-white shadow-sm hover:bg-red-800"
                      onClick={() => close(true)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)

export default ModalContext
