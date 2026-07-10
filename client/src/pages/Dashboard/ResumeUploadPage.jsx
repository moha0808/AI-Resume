import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiCheck, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { resumeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Only PDF and DOCX files are accepted (max 10MB)');
      return;
    }
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(p => { if (p >= 85) { clearInterval(progressInterval); return p; } return p + 5; });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await resumeAPI.upload(formData);
      clearInterval(progressInterval);
      setProgress(100);
      setUploaded(true);
      setUploadedResume(res.data.resume);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      clearInterval(progressInterval);
      toast.error(err.response?.data?.message || 'Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedResume) return;
    try {
      await resumeAPI.analyze(uploadedResume._id);
      navigate(`/dashboard/analysis/${uploadedResume._id}`);
    } catch {
      navigate(`/dashboard/analysis/${uploadedResume._id}`);
    }
  };

  const fileSize = file ? (file.size / 1024 / 1024).toFixed(2) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-white mb-1">Upload Resume</h1>
        <p className="text-slate-400">Upload your PDF or DOCX resume to get AI-powered analysis and scoring.</p>
      </motion.div>

      {!uploaded ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center ${
              isDragActive
                ? 'border-primary bg-primary/10 scale-[1.02]'
                : file ? 'border-accent/50 bg-accent/5' : 'border-white/20 hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {isDragActive ? (
                <motion.div key="drag" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <FiUpload size={32} className="text-primary" />
                  </div>
                  <p className="text-primary font-semibold text-lg">Drop your resume here!</p>
                </motion.div>
              ) : file ? (
                <motion.div key="file" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex items-center gap-4 justify-center">
                  <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                    <FiFile size={24} className="text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm">{fileSize} MB · {file.type.includes('pdf') ? 'PDF' : 'DOCX'}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-auto p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiX size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <FiUpload size={32} className="text-slate-400" />
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">Drag & Drop your resume here</p>
                  <p className="text-slate-400 text-sm mb-4">or <span className="text-primary underline">click to browse</span></p>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FiCheck size={12} className="text-green-500" /> PDF</span>
                    <span className="flex items-center gap-1"><FiCheck size={12} className="text-green-500" /> DOCX</span>
                    <span className="flex items-center gap-1"><FiAlertCircle size={12} className="text-amber-500" /> Max 10MB</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upload Progress & Button */}
          {uploading && (
            <div className="mt-4 glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white font-medium">Uploading...</span>
                <span className="text-sm text-primary">{progress}%</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
          )}

          <AnimatePresence>
            {file && !uploading && (
              <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                onClick={handleUpload}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 mt-4 text-base"
              >
                <FiUpload size={18} /> Upload & Prepare Analysis
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <FiCheck size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Resume Uploaded Successfully!</h2>
          <p className="text-slate-400 mb-6">Your resume is ready for AI analysis. Click below to get your ATS score and detailed feedback.</p>
          <button onClick={handleAnalyze} className="btn-primary flex items-center justify-center gap-2 mx-auto px-8 py-4 text-base">
            Analyze with AI <FiArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">💡 Tips for Best Results</h3>
        <ul className="space-y-2">
          {[
            'Use a single-column or two-column ATS-friendly layout',
            'Include relevant keywords from the job description',
            'Quantify achievements with numbers and percentages',
            'Keep your resume to 1-2 pages',
            'Use standard section headings: Experience, Education, Skills',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
              <FiCheck size={14} className="text-primary mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default ResumeUploadPage;
