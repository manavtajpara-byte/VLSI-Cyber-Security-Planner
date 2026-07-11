import { NextResponse } from 'next/server';

const EVENTS = [
  { name: 'PicoCTF 2026', category: 'CTF', url: 'https://picoctf.org/', description: 'Beginner-friendly CTF by Carnegie Mellon. Perfect for testing Linux, crypto, and web skills.' },
  { name: 'e-Yantra by IIT Bombay', category: 'Embedded', url: 'https://www.e-yantra.org/', description: 'National robotics & embedded systems competition. Great for hardware + software integration.' },
  { name: 'HackTheBox Challenges', category: 'CTF', url: 'https://www.hackthebox.com/', description: 'Ongoing penetration testing labs. Practice privilege escalation and exploit development.' },
  { name: 'IIT Bombay Techfest', category: 'Circuit Design', url: 'https://techfest.org/', description: 'Asia\'s largest science & tech festival. Circuit design and VLSI competitions.' },
  { name: 'Swadeshi Microprocessor Challenge', category: 'VLSI', url: 'https://www.iitm.ac.in/shakti', description: 'Government of India initiative for indigenous processor design using SHAKTI/RISC-V.' },
  { name: 'Cadence Design Contest', category: 'VLSI', url: 'https://www.cadence.com/', description: 'Industry-sponsored student design contest. Winning = guaranteed interview opportunity.' },
  { name: 'HackerOne Bug Bounties', category: 'Bug Bounty', url: 'https://www.hackerone.com/', description: 'Real-world bug bounty hunting. Earn money while building your cyber security portfolio.' },
  { name: 'TryHackMe Advent of Cyber', category: 'CTF', url: 'https://tryhackme.com/', description: 'Annual beginner-friendly cyber security event. Great for learning offensive and defensive skills.' },
];

export async function GET() {
  return NextResponse.json({ events: EVENTS });
}
