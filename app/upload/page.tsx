"use client";

import { ClipLoader } from "react-spinners";
import { useState, useRef } from "react";
import Dropzone from "@/components/Dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Analysis = {
  summary: string;
  email: string;
  skills: string[];
  score: number;
  improve: string;
} | null;

export default function UploadPage() {
  const [analysis, setAnalysis] = useState<Analysis>(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null); // ✅ Ref inside the component

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setAnalysis({
      summary: json.summary,
      email: json.email,
      skills: json.skills,
      score: Number(json.score), // ensure number
      improve: json.improve,
    });

    setLoading(false);
  };

  const downloadPdf = async () => {
    if (reportRef.current) {
      const html2pdf = (await import("html2pdf.js")).default;

      html2pdf()
        .set({
          margin: 0.5,
          filename: "resume-analysis.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(reportRef.current)
        .save();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>
      <Dropzone onFileAccepted={handleFileUpload} />
      {loading && (
        <div className="flex flex-col items-center justify-center mt-8 space-y-3">
          <ClipLoader size={50} color="#3B82F6" /> {/* Tailwind blue-500 */}
          <p className="text-sm text-gray-600">Analyzing your resume...</p>
        </div>
      )}

      {analysis && (
        <>
          <div className="flex justify-end mt-4">
            <button
              onClick={downloadPdf}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>

          <div
            ref={reportRef}
            className="mt-6 p-6 bg-white rounded-xl shadow-md space-y-6"
          >
            {/* Summary */}
            <div>
              <h2 className="text-xl font-semibold">Resume Summary</h2>
              <p>{analysis.summary || "No summary available."}</p>
            </div>

            {/* Score Meter */}
            <div>
              <h3 className="text-lg font-semibold mt-4">Your Score</h3>
              {typeof analysis.score === "number" && (
                <div className="w-32 h-32 mx-auto mt-4">
                  <CircularProgressbar
                    value={analysis.score}
                    text={`${analysis.score}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor:
                        analysis.score >= 80
                          ? "#22c55e"
                          : analysis.score >= 50
                          ? "#facc15"
                          : "#ef4444",
                      textColor: "#111827",
                      trailColor: "#e5e7eb",
                    })}
                  />
                </div>
              )}
            </div>

            {/* Improvement Suggestions */}
            <div>
              <h3 className="text-lg font-semibold mt-4">Improvement</h3>
              {analysis.improve ? (
                <p>{analysis.improve}</p>
              ) : (
                <p className="text-gray-500">Improvement unavailable</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
