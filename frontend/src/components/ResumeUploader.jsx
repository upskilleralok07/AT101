import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const ResumeUploader = ({ onAnalyze, loading }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('file'); // 'file' or 'text'
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = () => {
    if (mode === 'file' && !file) {
      alert("Please upload a PDF file first.");
      return;
    }
    if (mode === 'text' && !text.trim()) {
      alert("Please paste your resume text first.");
      return;
    }
    onAnalyze({ mode, file, text });
  };

  const clearFile = () => setFile(null);

  return (
    <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm">
      <div className="flex gap-4 mb-6 border-b border-slate-100 pb-2">
        <button
          onClick={() => setMode('file')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-all ${
            mode === 'file' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📄 PDF File Upload
        </button>
        <button
          onClick={() => setMode('text')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-all ${
            mode === 'text' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          ⌨️ Paste Resume Text
        </button>
      </div>

      {mode === 'file' ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={file ? undefined : onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleChange}
          />
          
          {file ? (
            <div className="flex items-center justify-between w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div className="text-left truncate">
                  <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">Drag and drop your PDF resume here</h4>
              <p className="text-xs text-slate-400 mt-1 font-medium">or click to browse from your device</p>
              <span className="text-[10px] text-slate-400 bg-slate-100 rounded px-2 py-0.5 mt-4">Only PDF supported</span>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your plain resume text here (Work history, Education, Projects, Skills...)"
          className="w-full h-48 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-all custom-scrollbar resize-none"
        ></textarea>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all mt-6 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Analyzing Resume...</span>
          </>
        ) : (
          <span>🔍 Analyze Resume</span>
        )}
      </button>
    </div>
  );
};

export default ResumeUploader;
