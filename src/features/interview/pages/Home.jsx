import React, { useEffect, useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/interview.api";
import {useNavigate} from 'react-router'

const formatRelativeTime = (value) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

const Home = () => {

  const { generateReport, reports, getReports } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const resumeInputRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    getReports()
  }, [])

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0]
    await generateReport({jobDescription, selfDescription, resumeFile})
  }

  const handleOpenReport = (reportId) => {
    if (reportId) {
      navigate(`/interview/${reportId}`)
    }
  }
  
  return (
    <main className="home">
      <header className="home-header">
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a
          <br className="desktop-break" /> winning strategy.
        </p>
      </header>

      <form className="interview-form">
        <section className="job-description-panel">
          <div className="section-heading">
            <h2>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 4h4l1.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5L10 4Z" />
              </svg>
              Target Job Description
            </h2>
            <span className="required-badge">Required</span>
          </div>

          <label className="visually-hidden" htmlFor="jobDescription">
            Target job description
          </label>
          <textarea
          onChange={(e)=> setJobDescription(e.target.value)}
            className="job-description-input"
            name="jobDescription"
            id="jobDescription"
            maxLength={5000}
            placeholder={
              "Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
            }
          />
          <span className="character-limit">Maximum 5,000 characters</span>
        </section>

        <section className="profile-panel">
          <div className="section-heading profile-heading">
            <h2>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
              </svg>
              Your Profile
            </h2>
          </div>

          <div className="profile-fields">
            <div className="input-group">
              <label className="field-label" htmlFor="resume">
                Upload Resume <span className="optional-label">(Optional)</span>
              </label>
              <label className="resume-upload" htmlFor="resume">
                <span className="upload-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M19.35 10.04A7.49 7.49 0 0 0 5 8a6 6 0 0 0 .5 12H19a5 5 0 0 0 .35-9.96ZM13 16v3h-2v-3H8l4-4 4 4h-3Z" />
                  </svg>
                </span>
                <strong>Click to upload or drag &amp; drop</strong>
                <span className="upload-hint">PDF or DOCX (Max 5MB)</span>
                <input
                  ref={resumeInputRef}
                  className="visually-hidden"
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>

            <div className="or-divider" aria-hidden="true">
              <span>OR</span>
            </div>

            <div className="input-group self-description-group">
              <label className="field-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
              onChange={(e)=> setSelfDescription(e.target.value)}
                className="self-description-input"
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <p className="form-note">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
              </svg>
              <span>
                Either a Resume or a Self Description is required to generate a
                personalized plan.
              </span>
            </p>
          </div>
        </section>

        <footer className="form-footer">
          <p>AI-Powered Strategy Generation <span>·</span> Approx. 30s</p>
          <button 
            onClick={handleGenerateReport} 
          className="button primary-button generate-button" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 12 .85 3.15L23 18l-3.15.85L19 22l-.85-3.15L15 18l3.15-.85L19 14Z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </footer>
      </form>

      <section className="saved-reports" aria-label="Your interview reports">
        <header className="saved-reports-heading">
          <h2>Your Interview Reports</h2>
          <span className="report-count">{reports.length}</span>
        </header>

        {reports.length ? (
          <ul className="report-list">
            {reports.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  className="report-item"
                  onClick={() => handleOpenReport(item._id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5Z" />
                  </svg>
                  <span className="report-item-title">{item.title}</span>
                  <span className="report-item-time">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-reports">
            No reports yet. Generate your first interview report above.
          </p>
        )}
      </section>
    </main>
  );
};

export default Home;
