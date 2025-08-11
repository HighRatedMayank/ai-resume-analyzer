"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  Download, 
  RefreshCw,
  Cloud,
  AlertCircle,
  Star,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import Dropzone from "@/components/Dropzone";

type Analysis = {
  summary: string;
  email: string;
  skills: string[];
  score: number;
  improve: string;
} | null;

type Step = "upload" | "analyzing" | "results";

export default function UploadPage() {
  const [analysis, setAnalysis] = useState<Analysis>(null);
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFileName(file.name);
    setCurrentStep("analyzing");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      
      // Log the response to debug the format
      console.log('API Response:', json);
      
      setAnalysis({
        summary: json.summary || "No summary available",
        email: json.email || null,
        skills: Array.isArray(json.skills) ? json.skills : [],
        score: Number(json.score) || 0,
        improve: json.improve || "No improvement suggestions available",
      });
      
      setCurrentStep("results");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setCurrentStep("upload");
    }
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

  const resetAnalysis = () => {
    setAnalysis(null);
    setCurrentStep("upload");
    setUploadedFileName("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 50) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return "ring-green-500";
    if (score >= 50) return "ring-yellow-500";
    return "ring-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Get instant insights and improvement suggestions for your resume
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: "upload", label: "Upload", icon: Upload },
              { step: "analyzing", label: "Analyzing", icon: Brain },
              { step: "results", label: "Results", icon: CheckCircle },
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep === step
                      ? "border-blue-600 bg-blue-600 text-white"
                      : index < ["upload", "analyzing", "results"].indexOf(currentStep)
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep === step
                      ? "text-blue-600"
                      : index < ["upload", "analyzing", "results"].indexOf(currentStep)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {index < 2 && (
                  <div
                    className={`ml-4 w-16 h-0.5 transition-all duration-300 ${
                      index < ["upload", "analyzing", "results"].indexOf(currentStep)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Upload Step */}
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Cloud className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Your Resume
                  </h2>
                  <p className="text-gray-600">
                    Drop your PDF resume here for instant AI analysis
                  </p>
                </div>
                
                <Dropzone onFileAccepted={handleFileUpload} />
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Supported format: PDF only
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {currentStep === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-12 h-12 text-blue-600" />
                  </motion.div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Analyzing Your Resume
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Our AI is carefully reviewing &quot;{uploadedFileName}&quot;
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Extracting text and structure</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Analyzing content and skills</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Generating insights</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Step */}
          {currentStep === "results" && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={resetAnalysis}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Another Resume</span>
                </button>
                
                <button
                  onClick={downloadPdf}
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resume Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Resume Summary</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {analysis.summary || "No summary available."}
                    </p>
                  </div>
                </div>

                {/* Score Meter */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold text-gray-900">Your Score</h3>
                      </div>
                      
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className={`w-full h-full rounded-full ${getScoreBgColor(analysis.score)} flex items-center justify-center`}>
                          <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                            {analysis.score}%
                          </span>
                        </div>
                        <div className={`absolute inset-0 rounded-full ring-4 ${getScoreRingColor(analysis.score)} ring-opacity-20`} />
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${getScoreBgColor(analysis.score)} ${getScoreColor(analysis.score)}`}>
                        {analysis.score >= 80 ? "Excellent" : analysis.score >= 50 ? "Good" : "Needs Improvement"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Improvement Suggestions</h3>
                </div>
                
                {analysis.improve ? (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="space-y-3">
                        {typeof analysis.improve === 'string' 
                          ? analysis.improve.split('\n').map((suggestion, index) => (
                              suggestion.trim() && (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  <p className="text-gray-700">{suggestion.trim()}</p>
                                </div>
                              )
                            ))
                          : (
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-gray-700">{String(analysis.improve)}</p>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Improvement suggestions unavailable</p>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              {analysis.skills && analysis.skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Key Skills Identified</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden div for PDF generation */}
              <div
                ref={reportRef}
                className="hidden"
              >
                <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">Resume Analysis Report</h1>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Summary</h2>
                    <p>{analysis.summary}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Score: {analysis.score}%</h2>
                    <p>Performance: {analysis.score >= 80 ? "Excellent" : analysis.score >= 50 ? "Good" : "Needs Improvement"}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Improvement Suggestions</h2>
                    <p>{analysis.improve}</p>
                  </div>
                  
                  {analysis.skills && analysis.skills.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Skills</h2>
                      <p>{analysis.skills.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sticky Download Button */}
        {currentStep === "results" && analysis && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden">
            <div className="flex gap-3">
              <button
                onClick={resetAnalysis}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Another</span>
              </button>
              
              <button
                onClick={downloadPdf}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
