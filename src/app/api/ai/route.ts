import { NextRequest, NextResponse } from 'next/server';

const MOCK_RESPONSES = [
  "Based on your recent tests, you should focus more on SystemVerilog Assertions.",
  "That's a great question about VLSI! In modern node technologies, leakage power is often a larger concern than dynamic power.",
  "Don't forget that Cyber Security is all about defense in depth. Have you reviewed the OWASP Top 10?",
  "Keep up the 24 LPA grind! 🚀 I recommend doing a 25-minute Pomodoro session on UVM tomorrow.",
  "Here is a mock interview question: Explain the difference between blocking and non-blocking assignments in Verilog."
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Simulate network delay for AI thinking
    await new Promise(r => setTimeout(r, 1500));

    // Pick a random mock response
    const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

    return NextResponse.json({ response: randomResponse });
  } catch (error) {
    console.error('AI Route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
