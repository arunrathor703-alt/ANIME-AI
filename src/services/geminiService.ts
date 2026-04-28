import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TransformationResult {
  imageUrl: string;
  description: string;
}

export interface VoiceResult {
  audioUrl: string;
}

export interface VideoResult {
  videoUrl: string;
}

export type AnimeStyle = "cyberpunk" | "ghibli" | "shonen" | "shinkai" | "vintage";

const STYLE_PROMPTS: Record<AnimeStyle, string> = {
  cyberpunk: "Transform this image into a high-octane cyberpunk anime style. Use vibrant neon lights (pink, blue, purple), futuristic streetwear, rain-slicked city streets, and sharp, cinematic lighting. Masterpiece, 4k, neon glitch aesthetic, Ghost in the Shell vibe.",
  ghibli: "Transform this image into a peaceful, hand-painted Studio Ghibli style. Use soft colors, lush green nature, warm sunset lighting, and an ethereal, nostalgic mood. Masterpiece, high quality, soft brushstrokes, My Neighbor Totoro aesthetic.",
  shonen: "Transform this image into an intense, high-energy shonen battle anime style. Add a powerful glowing aura, dramatic dynamic pose lines, energy effects, and sharp, high-contrast lighting. Masterpiece, 4k, Dragon Ball Z or Naruto aesthetic.",
  shinkai: "Transform this image into a breathtaking, ultra-detailed Makoto Shinkai style. Focus on stunning skies, incredible light reflections, high fidelity details, and a melancholic yet beautiful atmosphere. Your Name aesthetic, 4k, masterpiece.",
  vintage: "Transform this image into a classic 80s or 90s vintage anime style. Use soft glow, grain effects, specific cel-shaded look, and retro color palettes. Sailor Moon or Cowboy Bebop aesthetic, nostalgic, high quality."
};

/**
 * Image-to-Anime Transformation
 */
export async function transformImageToAnime(
  base64Image: string,
  mimeType: string,
  style: AnimeStyle
): Promise<TransformationResult> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const prompt = STYLE_PROMPTS[style];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(",")[1] || base64Image, mimeType: mimeType } },
          { text: prompt },
        ],
      },
    });

    let imageUrl = "";
    let description = "";

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          description += part.text;
        }
      }
    }

    if (!imageUrl) throw new Error("No image was generated.");
    return { imageUrl, description };
  } catch (error) {
    console.error("Error in transformImageToAnime:", error);
    throw error;
  }
}

/**
 * Text-to-Anime Generation
 */
export async function generateAnimeFromText(prompt: string, style: AnimeStyle): Promise<TransformationResult> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const styleContext = STYLE_PROMPTS[style];
  const finalPrompt = `Create a new anime image: ${prompt}. ${styleContext}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: finalPrompt }] },
    });

    let imageUrl = "";
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (!imageUrl) throw new Error("No image was generated.");
    return { imageUrl, description: "Generated from text prompt" };
  } catch (error) {
    console.error("Error in generateAnimeFromText:", error);
    throw error;
  }
}

/**
 * Voice Generation (TTS)
 */
export async function generateAnimeSpeech(text: string, voiceName: 'Kore' | 'Zephyr' | 'Puck' | 'Charon' = 'Kore'): Promise<VoiceResult> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with emotion: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio was generated.");

    // Convert base64 to Blob URL for playback
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    return { audioUrl: URL.createObjectURL(blob) };
  } catch (error) {
    console.error("Error in generateAnimeSpeech:", error);
    throw error;
  }
}

/**
 * Video Generation (Cinematic Motion)
 */
export async function generateAnimeVideo(imagePrompt: string, onProgress?: (status: string) => void): Promise<VideoResult> {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key is not configured.");
  
  // Re-initialize to ensure we use the latest API key (paid key if selected)
  const videoAi = new GoogleGenAI({ apiKey });

  try {
    if (onProgress) onProgress("Initializing Cinematic Engine...");
    
    let operation = await videoAi.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: `Breathtaking cinematic anime motion: ${imagePrompt}. Dynamic camera pan, particles floating, vibrant colors, 4k. High quality animation.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    if (onProgress) onProgress("Synthesizing anime frames (this may take up to 2 minutes)...");

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await videoAi.operations.getVideosOperation({ operation });
      if (onProgress) onProgress("Rendering digital universe...");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No output URI found.");

    if (onProgress) onProgress("Finalizing cinematic sequence...");

    // Fetch the video with the API key header
    const response = await fetch(downloadLink, {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!response.ok) throw new Error(`Failed to download video: ${response.statusText}`);

    const blob = await response.blob();
    const videoUrl = URL.createObjectURL(blob);

    return { videoUrl };
  } catch (error: any) {
    console.error("Error in generateAnimeVideo:", error);
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("BILLING_REQUIRED");
    }
    throw error;
  }
}
