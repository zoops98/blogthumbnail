import React, { useState, useRef } from 'react';
import { ArrowRight, Paperclip, FileText, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface TopicInputProps {
  onSubmit: (topic: string, file: UploadedFile | null) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || uploadedFile) {
      onSubmit(input, uploadedFile);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple text-based reading for now. 
    // In a full app, we might need pdf-parse for PDFs.
    // For now, we support text, md, json, csv, js, etc.
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadedFile({
        name: file.name,
        content: content,
        type: file.type
      });
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-slide-up px-4">
      <h1 className="text-4xl md:text-6xl font-black text-center mb-6 leading-tight text-naver-text tracking-tighter">
        클릭을 부르는<br />
        <span className="text-naver-green bg-naver-green/5 px-4 py-1 rounded-2xl inline-block mt-2">
          블로그 썸네일 기획
        </span>
      </h1>
      <p className="text-naver-muted text-base md:text-lg mb-12 text-center max-w-lg font-medium">
        블로그 <strong>제목</strong>을 입력하거나 관련 <strong>문서</strong>를 업로드하세요.<br />
        AI가 내용을 분석하여 최적의 썸네일을 제안합니다.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
        <div className="relative bg-white border border-naver-border rounded-3xl p-1 shadow-elevated flex flex-col overflow-hidden transition-all duration-500 group-focus-within:border-naver-green group-focus-within:shadow-green-glow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: [영어공부] 스스로 집에서 영어숙제를 하게 하는 마법"
            className="w-full bg-transparent text-naver-text text-xl px-8 py-10 outline-none placeholder-gray-300 resize-none min-h-[160px] max-h-[400px] font-medium leading-relaxed"
            rows={4}
            autoFocus
          />
          
          {/* File Preview Area */}
          {uploadedFile && (
            <div className="mx-6 mb-4 p-5 bg-naver-light/50 rounded-2xl flex items-center justify-between border border-naver-border animate-fade-in">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-naver-border shadow-sm">
                  <FileText className="w-6 h-6 text-naver-green" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-naver-text truncate">{uploadedFile.name}</span>
                  <span className="text-xs text-naver-muted font-mono uppercase tracking-tighter">{(uploadedFile.content.length / 1024).toFixed(1)} KB analyzed</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={clearFile}
                className="p-2 hover:bg-white rounded-full text-naver-muted hover:text-red-500 transition-all shadow-sm hover:shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center p-4 bg-naver-light/30 rounded-b-[2.5rem] border-t border-naver-border">
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".txt,.md,.csv,.json,.js,.ts,.tsx,.py,.c,.cpp,.h,.java"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-naver-muted hover:text-naver-green px-6 py-3 rounded-xl hover:bg-white transition-all text-sm font-bold border border-transparent hover:border-naver-border shadow-sm hover:shadow-md"
                title="문서 파일 업로드 (.txt, .md 등)"
              >
                <Paperclip className="w-5 h-5" />
                <span className="hidden sm:inline">문서 업로드</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!input.trim() && !uploadedFile}
              className="flex items-center gap-3 bg-naver-green hover:bg-naver-darkGreen disabled:bg-gray-200 disabled:text-gray-400 text-white px-10 py-3.5 rounded-xl transition-all duration-300 font-black shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              다음 단계 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};