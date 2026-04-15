import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API Key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a cosmic guardian from the PromptVerse. Your tone is fun, mystical, and on-brand. You speak as if you are a representative of the universe itself, sending galactic messages. Use cosmic metaphors. Keep responses relatively concise but impactful.',
          },
          ...messages,
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
       console.error('DeepSeek API Error:', data.error);
       return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ 
       content: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
