import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Upload, FileText, CheckCircle, AlertCircle, Star } from 'lucide-react'
import CorrectionsModal from '../components/CorrectionsModal'

const API_BASE = 'http://localhost:8000'

type ScoreBreakdown = {
  keyword_match: number
  formatting: number
  sections: number
  contact: number
  length: number
}

type ScoreResponse = {
  ats_score: number
  breakdown: ScoreBreakdown
  suggestions: string[]
  extracted?: Record<string, string>
  // Simplified always-present fields
  resume_text?: string
  matched_keywords?: string[]
  missing_keywords?: string[]
  sections_present?: Record<string, boolean>
  word_count?: number
  top_keywords?: { word: string; count: number }[]
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScoreResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentJd, setCurrentJd] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [showCorrections, setShowCorrections] = useState(false)

  const canSubmit = useMemo(() => !!file && !loading, [file, loading])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    setCurrentJd(jd) // Store the job description for the visualizer
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('job_description', jd)
      const { data } = await axios.post(`${API_BASE}/api/score`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (err: any) {
      console.error('API Error:', err)
      setError(err?.response?.data?.detail || err?.message || 'Failed to score resume')
    } finally {
      setLoading(false)
    }
  }

  // Create a blob URL for PDF preview when a PDF is selected
  useEffect(() => {
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
    setPdfUrl(null)
  }, [file])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">ATS Resume</span>
            <br />
            <span className="text-gray-900 dark:text-white">Analyzer</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your resume analyzed by our AI-powered ATS system. Receive detailed scores, 
            suggestions, and optimize your resume for better job application success.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>PDF & DOCX Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Industry Analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Upload Your Resume</h2>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resume File (PDF, DOCX, TXT)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description (Optional)
                </label>
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  className="w-full h-32 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-sm bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Paste the target job description to improve keyword matching and get more accurate ATS scores..."
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Results Section */}
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Analysis Results</h2>
              </div>
              {result && (
                <button
                  type="button"
                  onClick={() => setShowCorrections(true)}
                  className="btn-secondary"
                >
                  View Corrections in Resume
                </button>
              )}
            </div>

            {!result ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Upload your resume to see detailed ATS analysis and optimization suggestions.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall ATS Score</p>
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreBg(result.ats_score)} ${getScoreColor(result.ats_score)}`}>
                    {result.ats_score}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {result.ats_score >= 80 ? 'Excellent' : result.ats_score >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>

                {/* Breakdown */}
                <div>
                  <h3 className="font-semibold mb-4">Score Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.breakdown).map(([key, value]) => (
                      <div key={key} className={`p-4 rounded-lg border ${getScoreBg(value)}`}>
                        <div className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                          {key.replace('_', ' ')}
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Optimization Suggestions</h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extracted Info */}
                {result.extracted && Object.keys(result.extracted).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Extracted Information</h3>
                    <div className="space-y-2">
                      {Object.entries(result.extracted).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="font-medium capitalize text-gray-600 dark:text-gray-400">
                            {key}:
                          </span>
                          <span className="text-gray-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simple Resume Preview, PDF Viewer, and Findings */}
                {(result.resume_text || result.matched_keywords || result.sections_present) && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Resume Text */}
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold mb-3">Resume Preview</h3>
                      {pdfUrl && (
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-between">
                            <span>PDF preview (local file)</span>
                            <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Open in new tab</a>
                          </div>
                          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                            <iframe src={pdfUrl} title="Resume PDF" className="w-full" style={{ height: 480 }} />
                          </div>
                        </div>
                      )}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">{result.resume_text || 'No extracted text available.'}</pre>
                      </div>
                      {typeof result.word_count === 'number' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Word count: {result.word_count}</p>
                      )}
                    </div>

                    {/* Findings */}
                    <div className="space-y-6">
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowCorrections(true)}
                          className="btn-secondary w-full"
                        >
                          View Corrections in Resume
                        </button>
                      </div>
                      {result.matched_keywords && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Matched Keywords</h4>
                          <div className="flex flex-wrap gap-1">
                            {result.matched_keywords.slice(0, 20).map((kw, i) => (
                              <span key={i} className="px-2 py-1 bg-white/80 dark:bg-gray-800/60 rounded text-xs text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700">{kw}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.missing_keywords && result.missing_keywords.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Missing Keywords</h4>
                          <div className="flex flex-wrap gap-1">
                            {result.missing_keywords.slice(0, 20).map((kw, i) => (
                              <span key={i} className="px-2 py-1 bg-white/80 dark:bg-gray-800/60 rounded text-xs text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700">{kw}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.sections_present && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Sections</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(result.sections_present).map(([name, present]) => (
                              <div key={name} className="flex items-center justify-between bg-white/70 dark:bg-gray-800/50 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                                <span className="capitalize text-gray-700 dark:text-gray-300">{name.replace('_',' ')}</span>
                                <span className={`${present ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                                  {present ? 'Present' : 'Missing'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* No extra banners or dependency on detailed_analysis */}
      </main>
      {/* Corrections Modal */}
      <CorrectionsModal
        open={showCorrections && !!result}
        onClose={() => setShowCorrections(false)}
        resumeText={result?.resume_text}
        matchedKeywords={result?.matched_keywords}
        missingKeywords={result?.missing_keywords}
        sectionsPresent={result?.sections_present}
        file={file}
        jobDescription={currentJd}
      />
    </div>
  )
}