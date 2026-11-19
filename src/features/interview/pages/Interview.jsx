import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useInterview } from "../hooks/interview.api";
import "../style/interview.scss";

const QuestionSection = ({ id, title, questions }) => (
  <section className="report-section" id={id}>
    <header className="section-heading">
      <h1>{title}</h1>
      <span className="question-count">{questions.length} questions</span>
    </header>

    {questions.length ? (
      <div className="question-list">
        {questions.map((item, index) => (
          <details
            className="question-card"
            key={`${id}-${index}`}
            open={index < 2}
          >
            <summary>
              <span className="question-number">
                Q{String(index + 1).padStart(2, "0")}
              </span>
              <span className="question-title">{item.question}</span>
              <svg className="question-chevron" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="question-content">
              {item.intention && (
                <div className="question-answer">
                  <span className="answer-label intention-label">Intention</span>
                  <p>{item.intention}</p>
                </div>
              )}
              {item.answer && (
                <div className="question-answer">
                  <span className="answer-label model-answer-label">Model answer</span>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    ) : (
      <p className="empty-message">No {title.toLowerCase()} available.</p>
    )}
  </section>
);

const Interview = () => {
  const { interviewId } = useParams();
  const { report, getReportById, downloadReport } = useInterview();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadError("");

    try {
      await downloadReport(interviewId, report.title);
    } catch {
      setDownloadError("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const interview = report;

  if (!interview) {
    return (
      <main className="interview-report">
        <p className="empty-message report-empty">
          Your interview report will appear here once it is available.
        </p>
      </main>
    );
  }

  const technicalQuestions = interview.technicalQuestions ?? [];
  const behavioralQuestions = interview.behavioralQuestions ?? [];
  const skillGaps = interview.skillGaps ?? [];
  const preparationPlan = interview.preparationPlan ?? [];
  const matchScore = Number(interview.matchScore) || 0;
  const matchLabel =
    matchScore >= 80 ? "Strong match for this role" : matchScore >= 60 ? "Good match for this role" : "Room to grow for this role";

  return (
    <main className="interview-report">
      <div className="report-layout">
        <aside className="report-sidebar">
          <p className="sidebar-heading">Sections</p>
          <nav aria-label="Interview report sections">
            <a className="sidebar-link active" href="#technical-questions">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m8 5-7 7 7 7 1.4-1.4L3.8 12l5.6-5.6L8 5Zm8 0-1.4 1.4 5.6 5.6-5.6 5.6L16 19l7-7-7-7ZM13.2 3l-4 18h2.1l4-18h-2.1Z" />
              </svg>
              <span>Technical Questions</span>
            </a>
            <a className="sidebar-link" href="#behavioral-questions">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16v13H8l-4 3V4Zm3 4v2h10V8H7Zm0 4v2h7v-2H7Z" />
              </svg>
              <span>Behavioral Questions</span>
            </a>
            <a className="sidebar-link" href="#preparation-plan">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m3 17 6-6 4 4 8-9v4h2V3h-7v2h3.6L13 12l-4-4-7 7 1 2Z" />
              </svg>
              <span>Road Map</span>
            </a>
          </nav>
        </aside>

        <div className="report-main">
          <QuestionSection
            id="technical-questions"
            title="Technical Questions"
            questions={technicalQuestions}
          />

          <QuestionSection
            id="behavioral-questions"
            title="Behavioral Questions"
            questions={behavioralQuestions}
          />

          <section className="report-section roadmap-section" id="preparation-plan">
            <header className="section-heading">
              <h2>Road Map</h2>
              <span className="question-count">{preparationPlan.length} days</span>
            </header>
            {preparationPlan.length ? (
              <div className="roadmap-list">
                {preparationPlan.map((day) => (
                  <article className="roadmap-card" key={`day-${day.day}`}>
                    <span className="day-number">DAY {day.day}</span>
                    <div>
                      <h3>{day.focus}</h3>
                      <ul>
                        {(day.tasks ?? []).map((task, index) => (
                          <li key={`${day.day}-${index}`}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-message">No preparation plan available.</p>
            )}
          </section>

          <div className="report-download">
            <button
              type="button"
              className="button primary-button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? "Generating PDF..." : "Download PDF"}
            </button>
            {downloadError && (
              <p className="download-error">{downloadError}</p>
            )}
          </div>
        </div>

        <aside className="report-aside">
          <section className="match-panel" aria-label="Match score">
            <h2 className="aside-heading">Match Score</h2>
            <div
              className="score-ring"
              style={{ "--score": `${Math.min(Math.max(matchScore, 0), 100)}%` }}
              aria-label={`Match score ${matchScore}%`}
              role="img"
            >
              <span className="score-number">{matchScore}</span>
              <span className="score-percent">%</span>
            </div>
            <p className="match-label">{matchLabel}</p>
          </section>

          <section className="skill-panel">
            <h2 className="aside-heading">Skill Gaps</h2>
            {skillGaps.length ? (
              <ul className="skill-list">
                {skillGaps.map((gap, index) => {
                  const severity = ["high", "medium", "low"].includes(
                    gap.severity?.toLowerCase(),
                  )
                    ? gap.severity.toLowerCase()
                    : "medium";

                  return (
                    <li
                      className={`skill-chip skill-${severity}`}
                      key={`${gap.skill}-${index}`}
                    >
                      {gap.skill}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="empty-message">No skill gaps found.</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
