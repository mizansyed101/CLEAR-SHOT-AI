import { NextRequest, NextResponse } from 'next/server';
import { ENHANCEMENT_PROMPT } from '@/lib/enhancePrompt';

export const maxDuration = 10; // set max duration depending on Vercel plan, but typical response is fast

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY');
      return NextResponse.json({ error: 'API Configuration Error' }, { status: 500 });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: ENHANCEMENT_PROMPT }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT']
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      const specificErrorMessage = errorData?.error?.message || 'Failed to enhance image with Gemini API';
      return NextResponse.json({ error: specificErrorMessage }, { status: 500 });
    }

    const data = await geminiResponse.json();

    // Extract image from response
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { mimeType?: string, data?: string } }) => p.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart) {
      return NextResponse.json({ error: 'No image returned by the AI' }, { status: 500 });
    }

    return NextResponse.json({ enhancedBase64: imagePart.inlineData.data });
  } catch (error) {
    console.error('API Enhancing Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
