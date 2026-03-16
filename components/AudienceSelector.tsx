import React from 'react';
import { TargetAudience } from '../types';
import { Users, Briefcase, Glasses, Zap } from 'lucide-react';

interface AudienceSelectorProps {
  onSelect: (audience: TargetAudience) => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({ onSelect }) => {
  const options = [
    {
      type: TargetAudience.TEENS,
      label: "10대 ~ 20대 초반",
      desc: "트렌디한 감성, 감각적인 폰트, 인스타 스타일, 밈 활용",
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      bg: "bg-cyan-900/20 border-cyan-800 hover:border-cyan-500"
    },
    {
      type: TargetAudience.ADULTS,
      label: "20대 후반 ~ 40대",
      desc: "깔끔한 정보 전달, 신뢰감 있는 폰트, 미니멀한 구성",
      icon: <Briefcase className="w-8 h-8 text-blue-400" />,
      bg: "bg-blue-900/20 border-blue-800 hover:border-blue-500"
    },
    {
      type: TargetAudience.SENIORS,
      label: "50대 ~ 60대 이상",
      desc: "큰 글씨, 높은 명도 대비, 직관적인 이미지, 따뜻한 감성",
      icon: <Glasses className="w-8 h-8 text-yellow-400" />,
      bg: "bg-yellow-900/20 border-yellow-800 hover:border-yellow-500"
    },
    {
      type: TargetAudience.ALL,
      label: "전연령 (대중적 스타일)",
      desc: "누구나 읽기 쉬운 폰트, 명확한 주제 전달, 표준적인 블로그 썸네일",
      icon: <Zap className="w-8 h-8 text-red-500" />,
      bg: "bg-red-900/20 border-red-800 hover:border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.15)]"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-fade-in px-4">
      <h2 className="text-4xl font-black text-center mb-3 text-naver-text tracking-tight">
        주요 독자 타겟은 누구인가요?
      </h2>
      <p className="text-naver-muted mb-12 text-lg font-medium">
        독자층에 따라 선호하는 디자인과 텍스트 전략이 달라집니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {options.map((opt, idx) => (
          <button
            key={opt.type}
            onClick={() => onSelect(opt.type)}
            className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 bg-white border-naver-border hover:border-naver-green text-left flex flex-col h-full shadow-soft hover:shadow-elevated animate-slide-up`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="bg-naver-light w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                {opt.icon}
              </div>
              <h3 className="text-2xl font-black text-naver-text">{opt.label}</h3>
            </div>
            
            <p className="text-base text-naver-muted group-hover:text-naver-text transition-colors pl-1 leading-relaxed font-medium">
              {opt.desc}
            </p>
            <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 text-[10px] font-black text-naver-green tracking-[0.2em] uppercase">
              Select Target
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};