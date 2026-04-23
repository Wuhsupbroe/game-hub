import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
);

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      // Mock for when API key is not ready
      console.warn('No HF API key found. Returning mock image url.');
      return NextResponse.json({ 
        url: `https://api.dicebear.com/7.x/bottts/svg?seed=${prompt}&backgroundColor=12001a` 
      });
    }

    // Call Hugging Face API to generate the image
    const imageBlob = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-2', // or any preferred model
      parameters: {
        negative_prompt: 'blurry, bad art, poorly drawn',
      }
    });

    // Upload to Supabase Storage
    const fileName = `${userId}-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
