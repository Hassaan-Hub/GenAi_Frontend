import { InterviewContext } from "../interview.context";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  downloadInterviewReportPdf,
} from "../services/interview.api";
import { useContext } from "react";

export const useInterview = ()=>{
    const context = useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an interviewProvider")
    }
    
    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async ({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true)
        try {
            const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
            setReports((prevReports) => [response.interviewReport, ...prevReports])
            return response.interviewReport
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const getReportById = async (interview) =>{
        setLoading(true)
        try {
            const response = await getInterviewReportById(interview)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const getReports = async () =>{
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    // Downloads the report PDF and triggers a browser download with a safe filename.
    const downloadReport = async (interviewId, reportTitle) => {
        const blob = await downloadInterviewReportPdf(interviewId)

        const safeTitle =
            String(reportTitle ?? "")
                .trim()
                .replace(/[^a-z0-9]+/gi, "-")
                .replace(/^-+|-+$/g, "")
                .toLowerCase() || "interview-report"

        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.download = `${safeTitle}-interview-report.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(blobUrl)
    }

    return {loading,report,reports, generateReport, getReportById, getReports, downloadReport}
}