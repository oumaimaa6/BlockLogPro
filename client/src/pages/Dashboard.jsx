import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [logs, setLogs] = useState([])
    const [search, setSearch] = useState('')

    // Redirect if not authenticated
    useEffect(() => {
        if (!state?.identity) {
            navigate('/')
        }
    }, [state, navigate])

    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/logs')
            const data = await res.json()
            setLogs(data.reverse())
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchLogs()
        const i = setInterval(fetchLogs, 5000)
        return () => clearInterval(i)
    }, [])

    if (!state?.identity) return null

    // Helpers
    const formatTime = (ts) => new Date(ts * 1000).toLocaleString()

    const filteredLogs = logs.filter(log => {
        const s = search.toLowerCase()
        return (
            (log.source?.toLowerCase().includes(s)) ||
            (log.message?.toLowerCase().includes(s)) ||
            (log.status?.toLowerCase().includes(s))
        )
    })

    return (
        <div className="bg-dark min-vh-100 text-light d-flex flex-column">

            {/* NAVBAR */}
            <nav className="navbar navbar-expand navbar-dark bg-secondary bg-opacity-10 border-bottom border-secondary sticky-top px-4 py-3 shadow-sm">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold cursor-pointer" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        BlockLog<span className="text-primary">.Pro</span>
                        <span className="text-light small ms-3 border-start border-secondary ps-3 text-uppercase">Dashboard</span>
                    </span>

                    <div className="d-flex align-items-center gap-4">
                        <div className="text-end d-none d-sm-block">
                            <p className="text-uppercase fw-bold text-light small mb-0 spacing-wide" style={{ fontSize: '0.65rem' }}>Authenticated As</p>
                            <span className="badge bg-secondary bg-opacity-25 text-light font-monospace custom-badge">
                                {state.identity}
                            </span>
                        </div>
                        <div className="avatar bg-primary bg-opacity-25 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold border border-primary border-opacity-50" style={{ width: '40px', height: '40px' }}>
                            {state.identity[2]?.toUpperCase() || 'U'}
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-outline-danger btn-sm fw-bold ms-2"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow-1 container py-5">

                {/* STATS OVERVIEW */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card bg-secondary bg-opacity-10 border-secondary h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="small fw-bold text-light text-uppercase mb-1">Total Events</p>
                                    <h3 className="fw-bold mb-0 text-white">{logs.length}</h3>
                                </div>
                                <div className="p-3 bg-primary bg-opacity-10 rounded text-primary">
                                    <i className="bi bi-list-columns fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-secondary bg-opacity-10 border-secondary h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="small fw-bold text-light text-uppercase mb-1">System Status</p>
                                    <h3 className="fw-bold mb-0 text-success">Active</h3>
                                </div>
                                <div className="p-3 bg-success bg-opacity-10 rounded text-success">
                                    <i className="bi bi-activity fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-secondary bg-opacity-10 border-secondary h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="small fw-bold text-light text-uppercase mb-1">Last Sync</p>
                                    <h3 className="fw-bold mb-0 text-white">Just Now</h3>
                                </div>
                                <div className="p-3 bg-info bg-opacity-10 rounded text-info custom-pulse">
                                    <i className="bi bi-clock-history fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DATA TABLE CONTAINER */}
                <div className="card bg-secondary bg-opacity-10 border-secondary shadow">

                    {/* TOOLBAR */}
                    <div className="card-header bg-transparent border-secondary py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-light fw-bold">
                            <i className="bi bi-table me-2 text-light"></i>
                            Ledger Entries
                        </h5>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-secondary form-control-sm"
                                placeholder="Filter records..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: '250px' }}
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0 align-middle">
                            <thead className="bg-dark text-light small text-uppercase fw-bold">
                                <tr>
                                    <th className="ps-4 py-3">Status</th>
                                    <th className="py-3">Timestamp</th>
                                    <th className="py-3">Source ID</th>
                                    <th className="py-3 w-50">Message Payload</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {filteredLogs.map((log, i) => (
                                    <tr key={i}>
                                        <td className="ps-4 py-3">
                                            <span className={`badge rounded-pill fw-normal bg-opacity-25 border border-opacity-50
                                                ${log.status === 'ERROR' ? 'bg-danger text-danger border-danger' :
                                                    log.status === 'WARN' ? 'bg-warning text-warning border-warning' :
                                                        'bg-info text-info border-info'}`}>
                                                <i className={`bi me-1 ${log.status === 'ERROR' ? 'bi-x-circle' : log.status === 'WARN' ? 'bi-exclamation-circle' : 'bi-info-circle'}`}></i>
                                                {log.status || 'INFO'}
                                            </span>
                                        </td>
                                        <td className="py-3 small text-white-50 font-monospace text-nowrap">
                                            {formatTime(log.timestamp)}
                                        </td>
                                        <td className="py-3 small fw-bold text-light font-monospace">
                                            {log.source || 'UNK'}
                                        </td>
                                        <td className="py-3 small text-light">
                                            {log.message}
                                        </td>
                                    </tr>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted fst-italic">
                                            No records found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="card-footer bg-transparent border-secondary py-3 d-flex justify-content-between text-muted small">
                        <span>Displaying {filteredLogs.length} records</span>
                        <span>Blockchain Node: <span className="text-success fw-bold">Connected</span></span>
                    </div>
                </div>
            </main>
        </div>
    )
}
