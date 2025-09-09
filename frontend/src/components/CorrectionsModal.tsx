import React, { useEffect, useMemo, useState } from 'react'
import * as mammoth from 'mammoth'

type Props = {
	open: boolean
	onClose: () => void
	resumeText?: string
	matchedKeywords?: string[]
	missingKeywords?: string[]
	sectionsPresent?: Record<string, boolean>
	file?: File | null
	jobDescription?: string
}

function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function CorrectionsModal({ open, onClose, resumeText = '', matchedKeywords = [], missingKeywords = [], sectionsPresent = {}, file = null, jobDescription = '' }: Props) {
	const [docxHtml, setDocxHtml] = useState<string | null>(null)

	// Convert DOCX to HTML when supplied
	useEffect(() => {
		let cancelled = false
		async function run() {
			if (file && (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx'))) {
				try {
					const arrayBuffer = await file.arrayBuffer()
					const { value } = await mammoth.convertToHtml({ arrayBuffer })
					if (!cancelled) setDocxHtml(value)
				} catch (_e) {
					if (!cancelled) setDocxHtml(null)
				}
			} else {
				setDocxHtml(null)
			}
		}
		run()
		return () => { cancelled = true }
	}, [file])
	// Plain text from DOCX HTML (strip tags)
	const docxPlainText = useMemo(() => {
		if (!docxHtml) return ''
		const tmp = document.createElement('div')
		tmp.innerHTML = docxHtml
		return (tmp.textContent || '').replace(/\s+/g, ' ').trim()
	}, [docxHtml])

	// Choose best available source text for analysis/highlights
	const sourceText = useMemo(() => {
		if (resumeText && resumeText.trim().length > 0) return resumeText
		if (docxPlainText && docxPlainText.length > 0) return docxPlainText
		return ''
	}, [resumeText, docxPlainText])

	const highlightedHtml = useMemo(() => {
		let html = sourceText || ' '
		// If backend didn't compute keywords, derive from jobDescription
		let derivedMatched = matchedKeywords
		let derivedMissing = missingKeywords
		if ((!matchedKeywords?.length && !missingKeywords?.length) && jobDescription) {
			const jdWords = Array.from(new Set((jobDescription.toLowerCase().match(/[a-zA-Z]+/g) || []).filter(w => w.length > 2)))
			const resumeWords = new Set((sourceText.toLowerCase().match(/[a-zA-Z]+/g) || []).filter(w => w.length > 2))
			derivedMatched = jdWords.filter(w => resumeWords.has(w))
			derivedMissing = jdWords.filter(w => !resumeWords.has(w)).slice(0, 50)
		}
		// Highlight missing keywords first (red)
		derivedMissing.forEach((kw) => {
			if (!kw) return
			const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'gi')
			html = html.replace(
				re,
				(match) => `<span class="bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 px-1 rounded">${match}</span>`
			)
		})
		// Then matched keywords (green)
		derivedMatched.forEach((kw) => {
			if (!kw) return
			const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'gi')
			html = html.replace(
				re,
				(match) => `<span class="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 px-1 rounded">${match}</span>`
			)
		})
		// Emphasize section headings we recognize
		Object.keys(sectionsPresent).forEach((section) => {
			const re = new RegExp(`(^|\n)\s*(${escapeRegex(section)})\s*(:)?`, 'gi')
			html = html.replace(
				re,
				(_m, p1, p2, p3) => `${p1}<span class="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold px-1 rounded">${p2}</span>${p3 || ''}`
			)
		})
		return html
	}, [sourceText, matchedKeywords, missingKeywords, sectionsPresent, jobDescription])

	// If we have DOCX HTML, apply same highlighting replacements to it
	const highlightedDocxHtml = useMemo(() => {
		if (!docxHtml) return null
		let html = docxHtml
		let derivedMatched = matchedKeywords
		let derivedMissing = missingKeywords
		if ((!matchedKeywords?.length && !missingKeywords?.length) && jobDescription) {
			const jdWords = Array.from(new Set((jobDescription.toLowerCase().match(/[a-zA-Z]+/g) || []).filter(w => w.length > 2)))
			const resumeWords = new Set((sourceText.toLowerCase().match(/[a-zA-Z]+/g) || []).filter(w => w.length > 2))
			derivedMatched = jdWords.filter(w => resumeWords.has(w))
			derivedMissing = jdWords.filter(w => !resumeWords.has(w)).slice(0, 50)
		}
		derivedMissing.forEach((kw) => {
			const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'gi')
			html = html.replace(re, (m) => `<span style="background:#fecaca;color:#7f1d1d;border-radius:4px;padding:0 2px;">${m}</span>`)
		})
		derivedMatched.forEach((kw) => {
			const re = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'gi')
			html = html.replace(re, (m) => `<span style="background:#bbf7d0;color:#064e3b;border-radius:4px;padding:0 2px;">${m}</span>`)
		})
		Object.keys(sectionsPresent).forEach((section) => {
			const re = new RegExp(`(^|\n)\\s*(${escapeRegex(section)})\\s*(:)?`, 'gi')
			html = html.replace(re, (_m, p1, p2, p3) => `${p1}<span style="background:#bfdbfe;color:#1e3a8a;border-radius:4px;padding:0 2px;font-weight:600;">${p2}</span>${p3 || ''}`)
		})
		return html
	}, [docxHtml, matchedKeywords, missingKeywords, sectionsPresent, sourceText, jobDescription])

	if (!open) return null

	const missingSections = Object.entries(sectionsPresent)
		.filter(([, present]) => !present)
		.map(([name]) => name)

	// Build a PDF blob URL if file is PDF
	let pdfUrl: string | null = null
	if (file && file.type === 'application/pdf') {
		pdfUrl = URL.createObjectURL(file)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div className="relative glass max-w-5xl w-[95%] rounded-xl p-6 shadow-2xl border border-white/10 dark:border-gray-700">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold">Corrections in Resume</h3>
					<button onClick={onClose} className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-800/60">
						Close
					</button>
				</div>

				{/* Quick issues summary */}
				<div className="grid md:grid-cols-2 gap-4 mb-4">
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
						<div className="font-semibold text-red-800 dark:text-red-200 mb-1">Missing Keywords</div>
						<div className="flex flex-wrap gap-1 text-xs">
							{(missingKeywords?.length ? missingKeywords : (jobDescription ? Array.from(new Set((jobDescription.toLowerCase().match(/[a-zA-Z]+/g) || []).filter(w => w.length>2 && !(sourceText.toLowerCase().includes(w))))).slice(0,30) : [])).length
								? (missingKeywords?.length ? missingKeywords : Array.from(new Set((jobDescription.toLowerCase().match(/[a-zA-Z]+/g) || []).filter(w => w.length>2 && !(sourceText.toLowerCase().includes(w))))).slice(0,30)).map((kw, i) => (
								<span key={i} className="px-2 py-0.5 bg-white/80 dark:bg-gray-800/60 rounded border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200">{kw}</span>
							)) : <span className="text-gray-500">None</span>}
						</div>
					</div>
					<div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-3">
						<div className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Missing Sections</div>
						<div className="flex flex-wrap gap-1 text-xs">
							{missingSections.length ? missingSections.map((s, i) => (
								<span key={i} className="px-2 py-0.5 bg-white/80 dark:bg-gray-800/60 rounded border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-200 capitalize">{s.replace('_',' ')}</span>
							)) : <span className="text-gray-500">None</span>}
						</div>
					</div>
				</div>

				{/* For now, only show issues list; remove full preview. Keep highlighted text for context only if DOCX not present */}
				{!docxHtml && (
					<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-[50vh] overflow-auto border border-gray-200 dark:border-gray-700">
						<pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
					</div>
				)}

				{/* Download refined version */}
				<div className="mt-4 flex justify-end">
					<button type="button" className="btn-primary" onClick={async () => {
						if (!file) { alert('Upload a file first.'); return; }
						const form = new FormData()
						form.append('file', file)
						form.append('job_description', jobDescription || '')
						const resp = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/refine`, { method: 'POST', body: form })
						if (!resp.ok) { alert('Failed to generate refined resume'); return }
						const blob = await resp.blob()
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = `refined_${file.name.replace(/\.[^.]+$/, '')}.docx`
						a.click()
						URL.revokeObjectURL(url)
					}}>
						Download Suggested Changes
					</button>
				</div>
			</div>
		</div>
	)
}


