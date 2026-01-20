import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal'

export default function Home() {
    const navigate = useNavigate()

    // State
    const [source, setSource] = useState('SRV-001')
    const [status, setStatus] = useState('INFO')
    const [message, setMessage] = useState('System initialization sequence started...')
    const [importedLogs, setImportedLogs] = useState(null)

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [authAction, setAuthAction] = useState(null)

    const handleCommitClick = () => {
        if (!source || !message) {
            alert("Please fill in Source and Message fields")
            return
        }
        setAuthAction('commit')
        setIsModalOpen(true)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (ev) => {
            try {
                const logs = JSON.parse(ev.target.result)
                if (!Array.isArray(logs)) throw new Error("File must be an array")
                setImportedLogs(logs)
                setAuthAction('upload')
                setIsModalOpen(true)
            } catch (err) {
                alert("Invalid JSON file: " + err.message)
            }
        }
        reader.readAsText(file)
    }

    const handleLogin = async (identity) => {
        setIsModalOpen(false)
        try {
            if (authAction === 'commit') {
                await fetch('http://localhost:3000/api/logs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source, message, status })
                })
                navigate('/dashboard', { state: { identity, action: 'commit', success: true } })
            } else if (authAction === 'upload' && importedLogs) {
                for (const log of importedLogs) {
                    await fetch('http://localhost:3000/api/logs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            source: log.source,
                            message: log.message,
                            status: log.status || 'INFO'
                        })
                    })
                }
                navigate('/dashboard', { state: { identity, action: 'upload', success: true } })
            }
        } catch (err) {
            alert("Error: " + err.message)
        }
    }

    return (
        <div className="bg-dark min-vh-100 text-light py-5">
            <div className="container">

                {/* HEADER */}
                <header className="mb-5 border-bottom border-secondary pb-3">
                    <h1 className="fw-bold">
                        BlockLog<span className="text-primary">.Pro</span>
                    </h1>
                    <p className="text-light small text-uppercase mb-0">
                        Enterprise Audit Trail
                    </p>
                </header>

                {/* MAIN CARD */}
                <div className="card bg-secondary bg-opacity-10 border-secondary shadow-lg">
                    <div className="card-body p-5">
                        <div className="row g-5">

                            {/* LEFT : FORM */}
                            <div className="col-lg-8 border-end border-secondary pe-lg-5">
                                <h2 className="h4 mb-2 text-white">New Log Entry</h2>
                                <p className="text-light small mb-4">
                                    Record a new secure event into the immutable ledger
                                </p>

                                {/* SOURCE */}
                                <div className="mb-4">
                                    <label className="form-label text-uppercase small text-light fw-bold">Source Identifier</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-light border-secondary"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                        placeholder="SRV-001"
                                    />
                                </div>

                                {/* STATUS */}
                                <div className="mb-4">
                                    <label className="form-label text-uppercase small text-light fw-bold">Event Status</label>
                                    <select
                                        className="form-select bg-dark text-light border-secondary"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="INFO">INFO - General Information</option>
                                        <option value="WARN">WARN - Warning Event</option>
                                        <option value="ERROR">ERROR - System Error</option>
                                    </select>
                                </div>

                                {/* MESSAGE */}
                                <div className="mb-0">
                                    <label className="form-label text-uppercase small text-light fw-bold">Log Message</label>
                                    <textarea
                                        className="form-control bg-dark text-light border-secondary font-monospace"
                                        rows="5"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="System initialization sequence started..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* RIGHT : ACTIONS */}
                            <div className="col-lg-4 d-flex flex-column justify-content-center">
                                <div className="d-grid gap-3">

                                    <button
                                        onClick={handleCommitClick}
                                        className="btn btn-primary btn-lg py-3 fw-bold shadow"
                                    >
                                        Commit Log
                                    </button>

                                    <label className="btn btn-outline-light btn-lg py-3 fw-bold" style={{ cursor: 'pointer' }}>
                                        Upload from File
                                        <input type="file" accept=".json" onChange={handleFileUpload} className="d-none" />
                                    </label>

                                </div>

                                <div className="mt-4 text-center text-light small">
                                    <p className="mb-1"><i className="bi bi-shield-lock"></i> Requires wallet signature</p>
                                    <p className="mb-0">Files are hashed before signing</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <LoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLogin={handleLogin}
                action={authAction}
            />
        </div>
    );
}
