import React, { useMemo, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

type ScoreBreakdown = {
  keyword_match: number
  formatting: number
  sections: number
  contact: number
  length: number
  overall?: number
}

type ScoreResponse = {
  ats_score: number
  breakdown: ScoreBreakdown
  suggestions: string[]
  extracted?: Record<string, string>
}

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScoreResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => !!file && !loading, [file, loading])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('job_description', jd)
      const { data } = await axios.post(`${API_BASE}/api/score`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to score resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">ATS Resume Scorer</h1>
          <a className="text-sm text-blue-600 hover:underline" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 grid gap-6 md:grid-cols-2">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
          <form onSubmit={onSubmit} className="grid gap-4">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Job Description (optional)</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="w-full h-32 rounded border p-2 text-sm"
                placeholder="Paste the target role description to improve keyword matching"
              />
            </div>
            <button
              className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              disabled={!canSubmit}
            >
              {loading ? 'Scoring…' : 'Score Resume'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          {!result && <p className="text-sm text-slate-600">Upload a resume to see the ATS score and suggestions.</p>}
          {result && (
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-slate-600">Overall ATS Score</p>
                <p className="text-4xl font-bold">{result.ats_score}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(result.breakdown).map(([k, v]) => (
                  <div key={k} className="rounded border p-3">
                    <div className="font-medium capitalize">{k.replace('_', ' ')}</div>
                    <div className="text-xl font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              {!!result.suggestions.length && (
                <div>
                  <div className="font-medium mb-2">Suggestions</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {result.extracted && (
                <div>
                  <div className="font-medium mb-2">Extracted Contact</div>
                  <div className="text-sm text-slate-700">
                    {Object.entries(result.extracted).map(([k, v]) => (
                      <div key={k}><span className="capitalize font-medium">{k}:</span> {v}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-slate-500">
        Built with React + FastAPI. ATS scoring is heuristic, not a guarantee.
      </footer>
    </div>
  )
}


