import { useRef, useState, useEffect, forwardRef } from 'react'
import Sidebar from '../components/Sidebar'
import html2canvas from 'html2canvas-pro'
import {jsPDF} from 'jspdf'

// TODO: point this at wherever your project already stores the backend URL
// (an .env var, an axios instance, etc). Left as a plain constant for now.
const API_BASE = 'http://localhost:5000'

const emptyEducation = () => ({ college: '', degree: '', department: '', startYear: '', endYear: '', score: '' })
const emptyProject = () => ({ name: '', description: '', technologies: '', github: '', demo: '' })
const emptyExperience = () => ({ company: '', role: '', startDate: '', endDate: '', description: '' })
const emptyCertification = () => ({ name: '', organization: '', date: '', url: '' })

// Wizard step labels, in order. Index into this array == currentStep.
const STEPS = ['Personal', 'Education', 'Skills', 'Projects', 'Experience', 'Certifications', 'Achievements', 'Preview']

function ResumeBuilder() {
  const [personal, setPersonal] = useState({
    fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '',
  })
  const [education, setEducation] = useState([emptyEducation()])
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [projects, setProjects] = useState([emptyProject()])
  const [experience, setExperience] = useState([])
  const [certifications, setCertifications] = useState([emptyCertification()])
  const [achievements, setAchievements] = useState([''])
  const [template, setTemplate] = useState('classic')
  const [aiLoading, setAiLoading] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef(null)

  // ---- UI-only state: sidebar visibility + wizard step ----
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  // Default the sidebar to hidden on small screens so the form has room.
  // This only sets the initial value on mount; it doesn't fight the user's toggle afterwards.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarVisible(false)
    }
  }, [])

  const updateList = (list, setList, index, field, value) => {
    const copy = [...list]
    copy[index] = { ...copy[index], [field]: value }
    setList(copy)
  }
  const addItem = (setList, emptyItem) => setList((prev) => [...prev, emptyItem()])
  const removeItem = (list, setList, index) => setList(list.filter((_, i) => i !== index))

  const addSkill = () => {
    const value = skillInput.trim()
    if (value && !skills.includes(value)) setSkills([...skills, value])
    setSkillInput('')
  }
  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill))

  const updateAchievement = (index, value) => {
    const copy = [...achievements]
    copy[index] = value
    setAchievements(copy)
  }

  const generateAI = async (section, input, applyResult) => {
    setAiLoading(section)
    try {
      const res = await fetch(`${API_BASE}/api/resume/generate-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'AI generation failed')
      applyResult(data.text)
    } catch (err) {
      alert(err.message || 'AI generation failed. Please try again.')
    } finally {
      setAiLoading(null)
    }
  }

  const downloadPDF = async () => {
    if (!previewRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = personal.fullName ? `${personal.fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf'
      pdf.save(fileName)
    } catch (err) {
      console.log(err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  // ---- Wizard navigation. All form data lives in state above, so switching
  // the visible step never touches or clears it. ----
  const isFirstStep = currentStep === 0
  const isLastDataStep = currentStep === STEPS.length - 2 // step just before Preview
  const isPreviewStep = currentStep === STEPS.length - 1

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0))

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      {/* NOTE: 4rem here assumes a 64px navbar. If your navbar is a different
          height, adjust the "4rem" in h-[calc(100vh-4rem)] below to match so
          this section fits exactly under it without page scroll. */}
      {/* ---------------- SIDEBAR (collapsible) ---------------- */}
      <div
        className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarVisible ? 'w-64' : 'w-0'
        }`}
      >
        <Sidebar />
      </div>

      {/* Single toggle button sitting on the sidebar/content border.
          Doubles as "Hide Sidebar" and "Show Sidebar" depending on state. */}
      <button
        type="button"
        onClick={() => setSidebarVisible((v) => !v)}
        title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        aria-label={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        className="flex items-center justify-center fixed top-6 z-30 w-7 h-7 rounded-full bg-white border border-gray-300 shadow text-indigo-600 hover:bg-indigo-50 transition-all duration-300 ease-in-out"
        style={{ left: sidebarVisible ? '244px' : '8px' }}
      >
        <span className="text-sm leading-none">{sidebarVisible ? '‹' : '›'}</span>
      </button>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Page heading — fixed, does not scroll */}
        <div className="shrink-0 px-4 md:px-8 pt-4 md:pt-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-indigo-700">Upload your details to build your resume</h1>
          <p className="text-xs font-medium text-indigo-500 mt-1">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep]}
          </p>
        </div>

        {/* Step card — fills remaining height, only its own body scrolls if a
            section genuinely doesn't fit (e.g. several education entries) */}
        <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto px-4 md:px-8 pb-4 flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl shadow flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
            {/* ---- Step 1: Personal Details ---- */}
            {currentStep === 0 && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Full Name" value={personal.fullName} onChange={(v) => setPersonal({ ...personal, fullName: v })} />
                  <Input label="Email" type="email" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} />
                  <Input label="Phone" value={personal.phone} onChange={(v) => setPersonal({ ...personal, phone: v })} />
                  <Input label="Location" value={personal.location} onChange={(v) => setPersonal({ ...personal, location: v })} />
                  <Input label="LinkedIn" value={personal.linkedin} onChange={(v) => setPersonal({ ...personal, linkedin: v })} />
                  <Input label="GitHub" value={personal.github} onChange={(v) => setPersonal({ ...personal, github: v })} />
                  <Input
                    label="Portfolio"
                    value={personal.portfolio}
                    onChange={(v) => setPersonal({ ...personal, portfolio: v })}
                    className="sm:col-span-2"
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-600">Professional Summary</label>
                    <AIButton
                      loading={aiLoading === 'summary'}
                      onClick={() =>
                        generateAI(
                          'summary',
                          { skills, experienceLevel: experience.length ? 'experienced' : 'fresher', extraContext: personal.summary },
                          (text) => setPersonal((p) => ({ ...p, summary: text }))
                        )
                      }
                    />
                  </div>
                  <textarea
                    className="w-full border p-3 rounded-lg h-24"
                    placeholder="A short 2-4 sentence summary about you (or click Generate with AI)"
                    value={personal.summary}
                    onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* ---- Step 2: Education ---- */}
            {currentStep === 1 && (
              <div>
                {education.map((edu, i) => (
                  <div key={i} className="border rounded-lg p-4 mb-3 relative">
                    {education.length > 1 && <RemoveButton onClick={() => removeItem(education, setEducation, i)} />}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="College"
                        value={edu.college}
                        onChange={(v) => updateList(education, setEducation, i, 'college', v)}
                        className="sm:col-span-2"
                      />
                      <Input label="Degree" value={edu.degree} onChange={(v) => updateList(education, setEducation, i, 'degree', v)} />
                      <Input label="Department" value={edu.department} onChange={(v) => updateList(education, setEducation, i, 'department', v)} />
                      <Input label="Start Year" value={edu.startYear} onChange={(v) => updateList(education, setEducation, i, 'startYear', v)} />
                      <Input label="End Year" value={edu.endYear} onChange={(v) => updateList(education, setEducation, i, 'endYear', v)} />
                      <Input
                        label="CGPA / Percentage"
                        value={edu.score}
                        onChange={(v) => updateList(education, setEducation, i, 'score', v)}
                        className="sm:col-span-2"
                      />
                    </div>
                  </div>
                ))}
                <AddButton label="Add Education" onClick={() => addItem(setEducation, emptyEducation)} />
              </div>
            )}

            {/* ---- Step 3: Skills ---- */}
            {currentStep === 2 && (
              <div>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input
                    className="flex-1 min-w-0 border p-3 rounded-lg"
                    placeholder="e.g. React, Python, DBMS"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <button type="button" onClick={addSkill} className="bg-indigo-600 text-white px-4 py-3 sm:py-0 rounded-lg hover:bg-indigo-700">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="text-indigo-500 hover:text-indigo-900">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ---- Step 4: Projects ---- */}
            {currentStep === 3 && (
              <div>
                {projects.map((proj, i) => (
                  <div key={i} className="border rounded-lg p-4 mb-3 relative">
                    {projects.length > 1 && <RemoveButton onClick={() => removeItem(projects, setProjects, i)} />}
                    <Input label="Project Name" value={proj.name} onChange={(v) => updateList(projects, setProjects, i, 'name', v)} className="mb-3" />
                    <Input
                      label="Technologies (comma separated)"
                      value={proj.technologies}
                      onChange={(v) => updateList(projects, setProjects, i, 'technologies', v)}
                      className="mb-3"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Input label="GitHub Link" value={proj.github} onChange={(v) => updateList(projects, setProjects, i, 'github', v)} />
                      <Input label="Live Demo" value={proj.demo} onChange={(v) => updateList(projects, setProjects, i, 'demo', v)} />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <AIButton
                        loading={aiLoading === `project-${i}`}
                        onClick={() =>
                          generateAI(
                            'project',
                            { projectName: proj.name, technologies: proj.technologies, roughDescription: proj.description },
                            (text) => updateList(projects, setProjects, i, 'description', text)
                          )
                        }
                      />
                    </div>
                    <textarea
                      className="w-full border p-3 rounded-lg h-24"
                      placeholder="Briefly describe what you built (or click Generate with AI)"
                      value={proj.description}
                      onChange={(e) => updateList(projects, setProjects, i, 'description', e.target.value)}
                    />
                  </div>
                ))}
                <AddButton label="Add Project" onClick={() => addItem(setProjects, emptyProject)} />
              </div>
            )}

            {/* ---- Step 5: Experience ---- */}
            {currentStep === 4 && (
              <div>
                <p className="text-sm text-gray-500 mb-3">Optional for freshers — skip ahead if you don't have any yet.</p>
                {experience.map((exp, i) => (
                  <div key={i} className="border rounded-lg p-4 mb-3 relative">
                    <RemoveButton onClick={() => removeItem(experience, setExperience, i)} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Input label="Company" value={exp.company} onChange={(v) => updateList(experience, setExperience, i, 'company', v)} />
                      <Input label="Role" value={exp.role} onChange={(v) => updateList(experience, setExperience, i, 'role', v)} />
                      <Input label="Start Date" value={exp.startDate} onChange={(v) => updateList(experience, setExperience, i, 'startDate', v)} />
                      <Input label="End Date" value={exp.endDate} onChange={(v) => updateList(experience, setExperience, i, 'endDate', v)} />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <AIButton
                        loading={aiLoading === `experience-${i}`}
                        onClick={() =>
                          generateAI(
                            'experience',
                            { company: exp.company, role: exp.role, roughDescription: exp.description },
                            (text) => updateList(experience, setExperience, i, 'description', text)
                          )
                        }
                      />
                    </div>
                    <textarea
                      className="w-full border p-3 rounded-lg h-24"
                      placeholder="Briefly describe your responsibilities (or click Generate with AI)"
                      value={exp.description}
                      onChange={(e) => updateList(experience, setExperience, i, 'description', e.target.value)}
                    />
                  </div>
                ))}
                <AddButton label="Add Experience" onClick={() => addItem(setExperience, emptyExperience)} />
              </div>
            )}

            {/* ---- Step 6: Certifications ---- */}
            {currentStep === 5 && (
              <div>
                {certifications.map((cert, i) => (
                  <div key={i} className="border rounded-lg p-4 mb-3 relative">
                    {certifications.length > 1 && <RemoveButton onClick={() => removeItem(certifications, setCertifications, i)} />}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Name" value={cert.name} onChange={(v) => updateList(certifications, setCertifications, i, 'name', v)} />
                      <Input
                        label="Organization"
                        value={cert.organization}
                        onChange={(v) => updateList(certifications, setCertifications, i, 'organization', v)}
                      />
                      <Input label="Date" value={cert.date} onChange={(v) => updateList(certifications, setCertifications, i, 'date', v)} />
                      <Input label="Credential URL" value={cert.url} onChange={(v) => updateList(certifications, setCertifications, i, 'url', v)} />
                    </div>
                  </div>
                ))}
                <AddButton label="Add Certification" onClick={() => addItem(setCertifications, emptyCertification)} />
              </div>
            )}

            {/* ---- Step 7: Achievements ---- */}
            {currentStep === 6 && (
              <div>
                {achievements.map((ach, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      className="flex-1 min-w-0 border p-3 rounded-lg"
                      placeholder="e.g. Winner - College Hackathon 2025"
                      value={ach}
                      onChange={(e) => updateAchievement(i, e.target.value)}
                    />
                    {achievements.length > 1 && (
                      <button type="button" onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))} className="text-red-500 px-2">
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <AddButton label="Add Achievement" onClick={() => setAchievements([...achievements, ''])} />
              </div>
            )}

            {/* ---- Step 8: Preview ---- */}
            {isPreviewStep && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex gap-2">
                    {['classic', 'modern', 'minimal'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTemplate(t)}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          template === t ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={downloadPDF}
                    disabled={downloading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {downloading ? 'Preparing PDF...' : 'Download Resume'}
                  </button>
                </div>

                <div className="shadow-lg rounded-xl overflow-hidden border max-h-[70vh] overflow-y-auto mx-auto max-w-full">
                  <div className="overflow-x-auto">
                    <ResumePreview
                      ref={previewRef}
                      template={template}
                      personal={personal}
                      education={education}
                      skills={skills}
                      projects={projects}
                      experience={experience}
                      certifications={certifications}
                      achievements={achievements}
                    />
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* ---- Navigation — fixed footer of the card, always visible ---- */}
            <div className="shrink-0 flex justify-between items-center px-4 md:px-6 py-3 border-t">
              {!isFirstStep ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {!isPreviewStep && (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {isLastDataStep ? 'Review Resume →' : 'Next →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- small form helpers ---------------- */

function Input({ label, value, onChange, type = 'text', className = '' }) {
  return (
    <div className={className}>
      {label && <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>}
      <input type={type} className="w-full border p-3 rounded-lg" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function AddButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-indigo-600 font-medium text-sm hover:underline">
      + {label}
    </button>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm">
      Remove
    </button>
  )
}

function AIButton({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 disabled:opacity-50"
    >
      {loading ? 'Generating...' : '✨ Generate with AI'}
    </button>
  )
}

/* ---------------- resume preview + templates ---------------- */

const ResumePreview = forwardRef(function ResumePreview(props, ref) {
  const { template } = props
  return (
    <div ref={ref} className="bg-white p-10 text-sm text-gray-800" style={{ minHeight: '297mm', width: '210mm' }}>
      {template === 'modern' && renderModern(props)}
      {template === 'minimal' && renderMinimal(props)}
      {(template === 'classic' || !template) && renderClassic(props)}
    </div>
  )
})

function contactLine(personal) {
  return [personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.portfolio]
    .filter(Boolean)
    .join('  |  ')
}

function EducationBlock({ education }) {
  return education
    .filter((e) => e.college || e.degree)
    .map((e, i) => (
      <div key={i} className="mb-2">
        <div className="flex justify-between font-medium">
          <span>{e.college}</span>
          <span>
            {e.startYear} — {e.endYear}
          </span>
        </div>
        <div className="text-gray-600">
          {[e.degree, e.department].filter(Boolean).join(', ')}
          {e.score ? `  ·  ${e.score}` : ''}
        </div>
      </div>
    ))
}

function ProjectsBlock({ projects }) {
  return projects
    .filter((p) => p.name)
    .map((p, i) => (
      <div key={i} className="mb-3">
        <div className="flex justify-between font-medium">
          <span>{p.name}</span>
          <span className="text-gray-500 text-xs">{[p.github, p.demo].filter(Boolean).join('  |  ')}</span>
        </div>
        {p.technologies && <div className="text-xs text-gray-500 mb-1">{p.technologies}</div>}
        <p className="text-gray-700 whitespace-pre-line">{p.description}</p>
      </div>
    ))
}

function ExperienceBlock({ experience }) {
  return experience
    .filter((e) => e.company || e.role)
    .map((e, i) => (
      <div key={i} className="mb-3">
        <div className="flex justify-between font-medium">
          <span>
            {e.role} {e.company ? `— ${e.company}` : ''}
          </span>
          <span className="text-gray-500 text-xs">
            {e.startDate} — {e.endDate}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-line">{e.description}</p>
      </div>
    ))
}

function CertificationsBlock({ certifications }) {
  return certifications
    .filter((c) => c.name)
    .map((c, i) => (
      <div key={i} className="mb-1 flex justify-between">
        <span>
          {c.name} {c.organization ? `— ${c.organization}` : ''}
        </span>
        <span className="text-gray-500 text-xs">{c.date}</span>
      </div>
    ))
}

function AchievementsBlock({ achievements }) {
  const list = achievements.filter(Boolean)
  if (!list.length) return null
  return (
    <ul className="list-disc list-inside text-gray-700">
      {list.map((a, i) => (
        <li key={i}>{a}</li>
      ))}
    </ul>
  )
}

function renderClassic({ personal, education, skills, projects, experience, certifications, achievements }) {
  return (
    <>
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-indigo-700">{personal.fullName || 'Your Name'}</h1>
        <p className="text-xs text-gray-500 mt-1">{contactLine(personal)}</p>
      </div>
      {personal.summary && (
        <Block title="Summary">
          <p className="text-gray-700">{personal.summary}</p>
        </Block>
      )}
      {!!skills.length && (
        <Block title="Skills">
          <p className="text-gray-700">{skills.join('  ·  ')}</p>
        </Block>
      )}
      <Block title="Education">
        <EducationBlock education={education} />
      </Block>
      <Block title="Projects">
        <ProjectsBlock projects={projects} />
      </Block>
      {!!experience.length && (
        <Block title="Experience">
          <ExperienceBlock experience={experience} />
        </Block>
      )}
      <Block title="Certifications">
        <CertificationsBlock certifications={certifications} />
      </Block>
      <Block title="Achievements">
        <AchievementsBlock achievements={achievements} />
      </Block>
    </>
  )
}

function renderModern(props) {
  const { personal, education, skills, projects, experience, certifications, achievements } = props
  return (
    <div className="flex gap-6 -m-10">
      <div className="w-1/3 bg-indigo-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-1">{personal.fullName || 'Your Name'}</h1>
        <p className="text-xs text-indigo-100 mb-6 whitespace-pre-line">
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.portfolio].filter(Boolean).join('\n')}
        </p>
        {!!skills.length && (
          <>
            <h3 className="uppercase text-xs tracking-wide font-semibold text-indigo-200 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1 mb-6">
              {skills.map((s) => (
                <span key={s} className="bg-indigo-600 text-xs px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
        <h3 className="uppercase text-xs tracking-wide font-semibold text-indigo-200 mb-2">Education</h3>
        <div className="text-xs">
          <EducationBlock education={education} />
        </div>
      </div>
      <div className="w-2/3 p-6 pl-0">
        {personal.summary && (
          <Block title="Summary">
            <p className="text-gray-700">{personal.summary}</p>
          </Block>
        )}
        <Block title="Projects">
          <ProjectsBlock projects={projects} />
        </Block>
        {!!experience.length && (
          <Block title="Experience">
            <ExperienceBlock experience={experience} />
          </Block>
        )}
        <Block title="Certifications">
          <CertificationsBlock certifications={certifications} />
        </Block>
        <Block title="Achievements">
          <AchievementsBlock achievements={achievements} />
        </Block>
      </div>
    </div>
  )
}

function renderMinimal(props) {
  const { personal, education, skills, projects, experience, certifications, achievements } = props
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{personal.fullName || 'Your Name'}</h1>
        <p className="text-xs text-gray-500 mt-1">{contactLine(personal)}</p>
      </div>
      {personal.summary && <p className="text-gray-700 mb-6">{personal.summary}</p>}
      <MinimalBlock title="Education">
        <EducationBlock education={education} />
      </MinimalBlock>
      <MinimalBlock title="Skills">
        <p className="text-gray-700">{skills.join(', ')}</p>
      </MinimalBlock>
      <MinimalBlock title="Projects">
        <ProjectsBlock projects={projects} />
      </MinimalBlock>
      {!!experience.length && (
        <MinimalBlock title="Experience">
          <ExperienceBlock experience={experience} />
        </MinimalBlock>
      )}
      <MinimalBlock title="Certifications">
        <CertificationsBlock certifications={certifications} />
      </MinimalBlock>
      <MinimalBlock title="Achievements">
        <AchievementsBlock achievements={achievements} />
      </MinimalBlock>
    </>
  )
}

function Block({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="uppercase text-xs tracking-wide font-semibold text-indigo-700 mb-2 border-b pb-1">{title}</h3>
      {children}
    </div>
  )
}

function MinimalBlock({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="uppercase text-xs tracking-widest font-medium text-gray-500 mb-2">{title}</h3>
      {children}
    </div>
  )
}

export default ResumeBuilder