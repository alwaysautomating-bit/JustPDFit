
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

export interface DocumentPayload {
  data: string;
  mimeType: string;
  isText: boolean;
}

interface EnhancedDocument {
  title: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  summary: string;
}

export const aiEnhanceDocument = async (payload: DocumentPayload): Promise<EnhancedDocument> => {
  // Initialize AI client right before the call as per best practices
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const instruction = `
    I am providing a document (it may be text, a PDF, or a legacy Word binary). 
    Please transform this into a high-quality, professional, structured business document.
    
    1. Extract a clear, impactful title.
    2. Analyze the content structure and organize it into logical sections with clear headings.
    3. Proofread and refine the language to be professional, concise, and enterprise-ready.
    4. Provide a 1-sentence executive summary reflecting the core value proposition of the document.
    5. If the document is a legacy .doc binary, ensure all meaningful textual data is recovered and restructured.
  `;

  const contents = {
    parts: [
      { text: instruction },
      payload.isText 
        ? { text: `Document Content:\n${payload.data}` } 
        : { inlineData: { data: payload.data, mimeType: payload.mimeType } }
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: contents,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  body: { type: Type.STRING }
                },
                required: ["heading", "body"]
              }
            }
          },
          required: ["title", "summary", "sections"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as EnhancedDocument;
  } catch (error) {
    console.error("Gemini AI Transformation Error:", error);
    return {
      title: "Transformed Document",
      summary: "This document was converted without AI enhancement due to a processing issue.",
      sections: [{ heading: "Main Content", body: payload.isText ? payload.data : "Content extraction failed for this specific binary format." }]
    };
  }
};
