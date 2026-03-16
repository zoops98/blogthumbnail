import React, { useState } from 'react';
import { CharacterConfig, CharacterType } from '../types';
import { User, Cat, Box, Check, ArrowRight } from 'lucide-react';

interface CharacterSettingsProps {
  onComplete: (config: CharacterConfig) => void;
}

export const CharacterSettings: React.FC<CharacterSettingsProps> = ({ onComplete }) => {
  const [include, setInclude] = useState<boolean>(true);
  const [type, setType] = useState<CharacterType>('person');
  
  // Person Config
  const [gender, setGender] = useState<string>('여성');
  const [ethnicity, setEthnicity] = useState<string>('한국인 (Korean)');
  const [age, setAge] = useState<string>('20대 (Young Adult)');

  // Other Config
  const [description, setDescription] = useState<string>('');

  const handleSubmit = () => {
    onComplete({
      include,
      type: include ? type : undefined,
      gender: include && type === 'person' ? gender : undefined,
      ethnicity: include && type === 'person' ? ethnicity : undefined,
      age: include && type === 'person' ? age : undefined,
      description: include && type !== 'person' ? description : undefined,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-fade-in max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-2 text-naver-text">썸네일 등장 인물 설정</h2>
      <p className="text-naver-muted mb-8 text-center">
        썸네일에 들어갈 메인 피사체를 설정해주세요.
      </p>

      <div className="w-full bg-white border border-naver-border rounded-2xl overflow-hidden p-6 md:p-8 shadow-lg">
        
        {/* Toggle Include */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-naver-border">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-naver-text">캐릭터/피사체 포함</span>
            <span className="text-sm text-naver-muted">인물이나 특정 사물을 썸네일에 등장시킵니다.</span>
          </div>
          <button 
            onClick={() => setInclude(!include)}
            className={`w-14 h-8 rounded-full transition-colors relative ${include ? 'bg-naver-green' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${include ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {include ? (
          <div className="space-y-8 animate-fade-in">
            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'person', label: '사람', icon: <User className="w-6 h-6" /> },
                { id: 'animal', label: '동물', icon: <Cat className="w-6 h-6" /> },
                { id: 'object', label: '사물', icon: <Box className="w-6 h-6" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setType(item.id as CharacterType)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    type === item.id 
                      ? 'border-naver-green bg-naver-green/5 text-naver-green' 
                      : 'border-naver-border bg-naver-light text-naver-muted hover:bg-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Detailed Config */}
            <div className="bg-naver-light p-6 rounded-xl border border-naver-border space-y-5">
              {type === 'person' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs text-naver-muted font-bold block">성별</label>
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-white border border-naver-border rounded-lg px-4 py-3 text-naver-text focus:border-naver-green outline-none appearance-none cursor-pointer font-medium"
                      >
                        <option>남성</option>
                        <option>여성</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-naver-muted font-bold block">연령대</label>
                      <select 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-white border border-naver-border rounded-lg px-4 py-3 text-naver-text focus:border-naver-green outline-none appearance-none cursor-pointer font-medium"
                      >
                        <option>10대 (Teen)</option>
                        <option>20대 (Young Adult)</option>
                        <option>30-40대 (Adult)</option>
                        <option>50대 이상 (Senior)</option>
                        <option>어린이 (Child)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-naver-muted font-bold block">인종 / 국적</label>
                    <select 
                      value={ethnicity} 
                      onChange={(e) => setEthnicity(e.target.value)}
                      className="w-full bg-white border border-naver-border rounded-lg px-4 py-3 text-naver-text focus:border-naver-green outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option>한국인 (Korean)</option>
                      <option>백인 (Caucasian)</option>
                      <option>흑인 (Black/African)</option>
                      <option>동양인 (East Asian)</option>
                      <option>히스패닉 (Hispanic)</option>
                      <option>다문화/판타지</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs text-naver-muted font-bold block">
                    {type === 'animal' ? '동물 종류' : '사물 종류'}
                  </label>
                  <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={type === 'animal' ? "예: 귀여운 골든 리트리버, 화난 고양이" : "예: 최신형 아이폰 15, 맛있는 파스타 접시"}
                    className="w-full bg-white border border-naver-border rounded-lg px-4 py-3 text-naver-text focus:border-naver-green outline-none font-medium"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-naver-muted bg-naver-light rounded-xl border border-naver-border border-dashed">
            캐릭터나 특정 피사체 없이, <strong>텍스트나 그래픽 위주</strong>로 썸네일을 구성합니다.
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-naver-green hover:bg-[#02b350] text-white px-8 py-3 rounded-lg transition-all duration-200 font-bold text-lg shadow-sm"
          >
            설정 완료 <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};