import { useState } from 'react'

export default function LoginModal({ isOpen, onClose, onLogin, action }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const connectWallet = async () => {
        setLoading(true)
        setError('')

        if (typeof window.ethereum === 'undefined') {
            setError("No wallet found. Please install MetaMask.")
            setLoading(false)
            return
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            if (accounts.length > 0) {
                onLogin(accounts[0])
            } else {
                setError("No accounts found.")
            }
        } catch (err) {
            console.error(err)
            setError("Connection rejected.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark border-secondary shadow-lg">

                    <div className="modal-header border-secondary border-0 pb-0">
                        <h5 className="modal-title fw-bold text-white">Connect Wallet</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4 pt-2">
                        <p className="text-muted small mb-4">
                            Please sign in with your blockchain wallet to {action === 'commit' ? 'commit logs' : 'upload files'}.
                        </p>

                        <div className="d-grid gap-3">
                            <button
                                onClick={connectWallet}
                                disabled={loading}
                                className="btn btn-primary py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        Connect MetaMask
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="alert alert-danger py-2 small mb-0 text-center fw-bold" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* DEV BYPASS */}
                            <div className="border-top border-secondary pt-3 mt-1">
                                <button
                                    type="button"
                                    onClick={() => onLogin("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")}
                                    className="btn btn-link btn-sm w-100 text-decoration-none text-muted font-monospace small"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    [DEV] Simulate Connection (0xf39F...)
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
