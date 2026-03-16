
import { GoogleGenAI, Type } from "@google/genai";
import { TargetAudience, StrategyResponse, CharacterConfig, BorderStyle } from "../types";

export const ensureApiKey = async (): Promise<void> => {
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }
};

const getClient = () => {
  // Use the API key from the environment variable (injected by AI Studio after selection)
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다. 상단의 'API 키 선택' 버튼을 통해 키를 설정해주세요.");
  }

  return new GoogleGenAI({ apiKey });
};

/**
 * Generates the thumbnail strategy with TWO distinct options (Option A vs Option B).
 * Now supports File Content analysis and Detailed Character Configuration.
 */
export const generateThumbnailStrategy = async (
  topicOrScript: string,
  fileContent: string | null,
  audience: TargetAudience,
  characterConfig: CharacterConfig
): Promise<StrategyResponse> => {
  const ai = getClient();

  // Construct Character Prompt Section
  let characterInstruction = "";
  if (characterConfig.include) {
    if (characterConfig.type === 'person') {
      characterInstruction = `
      [Character Requirement - MANDATORY]
      - Subject: A REALISTIC PERSON
      - Gender: ${characterConfig.gender || 'Not specified'}
      - Ethnicity: ${characterConfig.ethnicity || 'Korean'}
      - Age: ${characterConfig.age || 'Not specified'}
      - Expression: Must be highly expressive (e.g., Shocked, Excited, Crying, Determined) depending on the context.
      `;
    } else if (characterConfig.type === 'animal') {
      characterInstruction = `
      [Character Requirement - MANDATORY]
      - Subject: ANIMAL
      - Detail: ${characterConfig.description || 'Cute animal related to topic'}
      `;
    } else {
      characterInstruction = `
      [Character Requirement - MANDATORY]
      - Subject: OBJECT / ITEM
      - Detail: ${characterConfig.description || 'Key item related to topic'}
      `;
    }
  } else {
    characterInstruction = `
    [Character Requirement]
    - Do NOT feature a specific person/character as the main subject. Focus on text, graphics, or abstract representation of the topic.
    `;
  }

  const systemInstruction = `
    당신은 네이버 블로그와 티스토리 등 블로그 썸네일 트렌드를 선도하는 '전문 아트 디렉터'입니다.
    사용자의 블로그 제목과 첨부된 문서를 분석하여 **두 가지 서로 다른 접근 방식(Option A, Option B)**의 텍스트 전략을 제안해야 합니다.

    [타겟 분석: ${audience}]
    - 이 독자층이 반응하는 키워드와 디자인 스타일을 적용하십시오.

    ${characterInstruction}

    [전략 생성 목표]
    **Option 1 (A안): 직관/정보/팩트 중심**
    - 내용을 명확하게 전달하고, 구체적인 숫자나 이득(Benefit)을 강조합니다.
    - 예: "5분 만에 완성하는 레시피", "이것만 알면 블로그 지수 상승"

    **Option 2 (B안): 호기심/감성/충격 중심**
    - 궁금증을 유발하거나 감정을 자극하는 질문, 의문문, 강렬한 단어를 사용합니다.
    - 예: "아직도 이걸 모르시나요?", "나만 알고 싶은 맛집"

    [공통 규칙: 블로그 성공 공식]
    - 메인 텍스트는 가독성이 좋고 명확하게(3~5단어).
    - 서브 텍스트는 메인을 보조하되 필수적으로 작성(숫자, 꿀팁, 기간 등).
    - 시각적 연출: "Clean", "Aesthetic", "High Contrast", "Soft Lighting", "Professional Photography".

    [출력 요구사항 (JSON)]
    - strategySummary: 전체적인 기획 의도 3줄 요약.
    - imagePrompt: 배경, 인물(설정된 캐릭터), 조명 등을 묘사한 영어 프롬프트 (텍스트 제외, 이미지 생성 엔진용).
    - imagePromptKo: 위 imagePrompt 내용을 한글로 번역한 텍스트 (사용자 표시용).
    - option1: A안 (직관형) 데이터 객체.
    - option2: B안 (호기심형) 데이터 객체.
  `;

  // Combine topic and file content
  let combinedContent = `주제/요청사항: ${topicOrScript}`;
  if (fileContent) {
    combinedContent += `\n\n[첨부 문서 내용 시작]\n${fileContent.substring(0, 30000)}\n[첨부 문서 내용 끝]`; // Limit context window safety
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: combinedContent,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategySummary: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          imagePromptKo: { type: Type.STRING },
          option1: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "전략 이름 (예: 직관형)" },
              hookMainText: { type: Type.STRING },
              hookSubText: { type: Type.STRING },
              textStyleSuggestion: { type: Type.STRING, description: "색상, 폰트 분위기 추천" }
            },
            required: ["label", "hookMainText", "hookSubText", "textStyleSuggestion"]
          },
          option2: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "전략 이름 (예: 호기심형)" },
              hookMainText: { type: Type.STRING },
              hookSubText: { type: Type.STRING },
              textStyleSuggestion: { type: Type.STRING, description: "색상, 폰트 분위기 추천" }
            },
            required: ["label", "hookMainText", "hookSubText", "textStyleSuggestion"]
          }
        },
        required: ["strategySummary", "imagePrompt", "imagePromptKo", "option1", "option2"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as StrategyResponse;
  }
  
  throw new Error("전략 생성에 실패했습니다.");
};

/**
 * Generates the actual image using Gemini Nano Banana Pro.
 * Accepts custom style suggestions to differentiate the two options.
 */
export const generateThumbnailImage = async (
  prompt: string, 
  mainText: string, 
  subText: string,
  audience: TargetAudience,
  customStyle: string,
  borderStyle: BorderStyle,
  channelName?: string
): Promise<string> => {
  const ai = getClient();

  // Define audience-specific text rendering instructions
  let baseTextInstructions = "";

  if (audience === TargetAudience.SENIORS) {
    baseTextInstructions = `
    [SENIOR AUDIENCE MODE - MAXIMIZE VISIBILITY]
    - Font: COLOSSAL SIZE, EXTRA BOLD SANS-SERIF. Thick strokes are mandatory.
    - Contrast: MAXIMUM. Use Bright Yellow on Black, or White on Red.
    - Layout: Text must occupy 30-40% of the screen.
    `;
  } else {
    baseTextInstructions = `
    [GENERAL/TEEN AUDIENCE MODE]
    - Font: IMPACTFUL, DYNAMIC, HEAVY WEIGHT.
    - Style: Use gradients, strokes, or drop shadows to make it pop.
    - Layout: Balanced within the safe zone.
    `;
  }

  // Construct border and branding prompts
  let visualExtras = "";
  
  // Border Logic
  switch (borderStyle) {
    case 'solid':
      visualExtras += `
      - [BORDER]: Add a THICK, SOLID COLOR border (Bright Yellow or Red) around the ENTIRE edge of the thumbnail. It must be high-contrast and fully visible.
      `;
      break;
    case 'neon':
      visualExtras += `
      - [BORDER]: Add a GLOWING NEON border (Cyan, Magenta, or Lime Green) around the edges. Cyberpunk or gaming vibe.
      `;
      break;
    case 'sketch':
      visualExtras += `
      - [BORDER]: Add a ROUGH, HAND-DRAWN white scribble border around the edges. Casual, vlog, or diary aesthetic.
      `;
      break;
    case 'none':
    default:
      // No border instruction
      break;
  }

  if (channelName) {
    visualExtras += `
    - [BRANDING]: Include the blog name text "${channelName}" in a small, stylish font in one of the corners (Top-Left or Top-Right). It must be distinct from the main/sub text.
    `;
  }

  const finalPrompt = `
    [Role] Professional Blog Thumbnail Designer
    
    [Visual Prompt]
    ${prompt}
    
    [Specific Style & Atmosphere]
    ${customStyle}
    
    [Text Rendering - CRITICAL]
    Render the following text into the image.
    
    1. MAIN TEXT: "${mainText}"
    2. SUB TEXT: "${subText}"
    
    [Visual Extra Rules]
    ${visualExtras}

    [Text Rules]
    ${baseTextInstructions}
    - Ensure text is legible and does not cover the subject.
    - Text should be placed in the 'Negative Space' or Safe Zone (Center/Sides).
    - Lighting: Professional Photography Lighting, Soft Light.
    - Quality: High Quality, Aesthetic, Sharp focus.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: finalPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9", 
        imageSize: "2K"
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("이미지 생성에 실패했습니다.");
};

/**
 * Edits an existing thumbnail based on user instructions.
 */
export const editThumbnailImage = async (
  originalImageBase64: string,
  editInstruction: string
): Promise<string> => {
  const ai = getClient();

  // Strip data URI prefix to get raw base64
  const base64Data = originalImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data
          }
        },
        { text: `Modify this thumbnail image. Instruction: ${editInstruction}` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "2K"
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("이미지 수정에 실패했습니다.");
};
