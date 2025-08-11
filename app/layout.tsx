import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ResumeAI - AI-Powered Resume Analysis",
  description: "Transform your resume with AI-powered analysis. Get instant feedback, scoring, and improvement suggestions to land more interviews.",
  keywords: "resume analysis, AI resume, resume optimization, job search, career advice",
  authors: [{ name: "ResumeAI Team" }],
  openGraph: {
    title: "ResumeAI - AI-Powered Resume Analysis",
    description: "Transform your resume with AI-powered analysis. Get instant feedback, scoring, and improvement suggestions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI - AI-Powered Resume Analysis",
    description: "Transform your resume with AI-powered analysis. Get instant feedback, scoring, and improvement suggestions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
