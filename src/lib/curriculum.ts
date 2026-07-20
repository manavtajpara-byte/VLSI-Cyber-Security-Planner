// ═══════════════════════════════════════════════════════════════
// 3-YEAR VLSI + CYBER SECURITY ROADMAP CURRICULUM
// 156 Weeks | VLSI Primary Track | Cyber Security Backup Track
// Hackathons, Competitions & Monthly Tests Included
// ═══════════════════════════════════════════════════════════════

export interface Task {
  id: string;
  title: string;
  description: string;
  track: 'vlsi' | 'cyber' | 'general';
  type: 'learn' | 'practice' | 'project' | 'hackathon' | 'test';
  resource?: string;
  estimatedTime?: string;
}

export interface WeekPlan {
  weekIndex: number;
  month: number; // 1-36
  year: number;  // 1-3
  title: string;
  theme: string;
  tasks: Task[];
  isTestWeek?: boolean;
  hackathonAlert?: {
    name: string;
    platform: string;
    url: string;
    description: string;
  };
}

function generateWeeks(): WeekPlan[] {
  const weeks: WeekPlan[] = [];
  let weekIndex = 0;

  // ═════════════════════════════════════════════
  // YEAR 1 (Months 1-12, Weeks 1-52)
  // "Rock-Solid Fundamentals & Linux Mastery"
  // ═════════════════════════════════════════════

  // Month 1: Linux CLI Basics
  for (let w = 0; w < 4; w++) {
    weeks.push({
      weekIndex: weekIndex++,
      month: 1, year: 1,
      title: `Linux CLI Foundations - Week ${w + 1}`,
      theme: '🐧 Linux Mastery',
      tasks: [
        { id: `y1m1w${w}-1`, title: 'Install Ubuntu via WSL or Dual Boot', description: 'Set up your Linux development environment. Stop doing engineering work on Windows.', track: 'general', type: 'practice' },
        { id: `y1m1w${w}-2`, title: `Linux CLI: ${['File System Navigation (ls, cd, pwd, mkdir)', 'File Operations (cp, mv, rm, chmod, chown)', 'Text Processing (grep, sed, awk, cat, head, tail)', 'Process Management (ps, top, kill, cron)'][w]}`, description: 'Master the Linux command line one concept at a time.', track: 'general', type: 'learn' },
        { id: `y1m1w${w}-3`, title: 'Kali Linux Exploration', description: 'Install Kali Linux in a VM and explore its pre-installed security tools.', track: 'cyber', type: 'practice' },
      ],
    });
  }

  // Month 2: Python Scripting
  for (let w = 0; w < 4; w++) {
    weeks.push({
      weekIndex: weekIndex++,
      month: 2, year: 1,
      title: `Python Scripting - Week ${w + 1}`,
      theme: '🐍 Scripting Power',
      tasks: [
        { id: `y1m2w${w}-1`, title: `Python: ${['Variables, Data Types & Control Flow', 'Functions, Modules & File I/O', 'OOP Basics (Classes, Inheritance)', 'Regex & Text Parsing'][w]}`, description: 'Build scripting skills that are essential for both VLSI automation and cyber security.', track: 'general', type: 'learn' },
        { id: `y1m2w${w}-2`, title: 'Bash Scripting Basics', description: 'Write shell scripts to automate daily Linux tasks.', track: 'general', type: 'practice' },
        { id: `y1m2w${w}-3`, title: 'Python Mini-Project', description: 'Build a small automation script (file organizer, log parser, or port scanner).', track: 'general', type: 'project' },
      ],
    });
  }

  // Month 3: Advanced Scripting + TCL
  for (let w = 0; w < 4; w++) {
    const isTestWeek = w === 3;
    weeks.push({
      weekIndex: weekIndex++,
      month: 3, year: 1,
      title: `Advanced Scripting & TCL - Week ${w + 1}`,
      theme: '⚡ Tool Command Language',
      tasks: [
        { id: `y1m3w${w}-1`, title: `TCL/TK: ${['Syntax, Variables & Lists', 'Procedures & String Operations', 'File I/O & Regular Expressions', 'Integration with EDA Tools'][w]}`, description: 'TCL is the scripting language of the semiconductor industry. Cadence & Synopsys tools use it extensively.', track: 'vlsi', type: 'learn' },
        { id: `y1m3w${w}-2`, title: 'Network Fundamentals', description: `Cyber: ${['OSI Model & TCP/IP Stack', 'Subnetting & IP Addressing', 'DNS, DHCP & ARP', 'Wireshark Packet Analysis'][w]}`, track: 'cyber', type: 'learn' },
        ...(isTestWeek ? [{ id: `y1m3w${w}-test`, title: '📝 MONTHLY TEST: Linux, Python, TCL & Networking', description: 'Assess your understanding of the first 3 months of learning.', track: 'general' as const, type: 'test' as const }] : []),
      ],
      isTestWeek,
    });
  }

  // Month 4-5: Digital Logic Design
  for (let m = 4; m <= 5; m++) {
    for (let w = 0; w < 4; w++) {
      const topics4 = ['Number Systems & Boolean Algebra', 'Logic Gates & Karnaugh Maps', 'Combinational Circuits (Mux, Decoder, Adder)', 'Sequential Circuits (Flip-Flops, Counters)'];
      const topics5 = ['Finite State Machines (Moore & Mealy)', 'State Minimization & Encoding', 'Timing Analysis (Setup/Hold Time)', 'Clock Domain Crossing Basics'];
      const isTestWeek = m === 5 && w === 3;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 1,
        title: `Digital Logic Design - Month ${m} Week ${w + 1}`,
        theme: '🔌 Digital Foundations',
        tasks: [
          { id: `y1m${m}w${w}-1`, title: `DLD: ${m === 4 ? topics4[w] : topics5[w]}`, description: 'Build an unshakeable foundation in digital electronics. This is what interviewers at Intel and Qualcomm test most.', track: 'vlsi', type: 'learn' },
          { id: `y1m${m}w${w}-2`, title: 'CMOS VLSI Basics', description: `${['MOSFET Operation', 'CMOS Inverter Design', 'Power Dissipation', 'Propagation Delay'][w]}`, track: 'vlsi', type: 'learn' },
          { id: `y1m${m}w${w}-3`, title: 'Cyber: Network Security', description: `${['Firewall Concepts', 'VPN & Tunneling', 'IDS/IPS Basics', 'Network Scanning with Nmap'][w]}`, track: 'cyber', type: 'learn' },
          ...(isTestWeek ? [{ id: `y1m${m}w${w}-test`, title: '📝 MONTHLY TEST: Digital Logic & CMOS', description: 'Test your DLD and CMOS fundamentals.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
      });
    }
  }

  // Month 6: CMOS Deep Dive
  for (let w = 0; w < 4; w++) {
    const isTestWeek = w === 3;
    weeks.push({
      weekIndex: weekIndex++,
      month: 6, year: 1,
      title: `CMOS VLSI Deep Dive - Week ${w + 1}`,
      theme: '🧬 CMOS Mastery',
      tasks: [
        { id: `y1m6w${w}-1`, title: `CMOS: ${['Static CMOS Logic Design', 'Dynamic Logic & Domino Logic', 'Memory Design (SRAM, DRAM)', 'I/O Pads & ESD Protection'][w]}`, description: 'Study from "CMOS VLSI Design" by Weste & Harris.', track: 'vlsi', type: 'learn' },
        { id: `y1m6w${w}-2`, title: 'Linux Administration', description: 'Advanced Linux: users, permissions, systemd services, and cron jobs.', track: 'general', type: 'practice' },
        ...(isTestWeek ? [{ id: `y1m6w${w}-test`, title: '📝 MONTHLY TEST: CMOS & Advanced Linux', description: 'Comprehensive test on CMOS design and Linux skills.', track: 'general' as const, type: 'test' as const }] : []),
      ],
      isTestWeek,
    });
  }

  // Month 7-9: Verilog HDL
  for (let m = 7; m <= 9; m++) {
    for (let w = 0; w < 4; w++) {
      const topics7 = ['Verilog Basics: Modules, Ports & Data Types', 'Combinational Design in Verilog (assign, always @*)', 'Sequential Design (always @posedge clk)', 'Parameterized Modules & Generate'];
      const topics8 = ['Testbench Writing: $display, $monitor, $dumpvars', 'Task & Function in Verilog', 'Design: ALU & Shift Register', 'Design: FIFO Buffer'];
      const topics9 = ['Design: Traffic Light Controller FSM', 'Design: UART Transmitter', 'Design: UART Receiver', 'Full UART Integration & Testing'];
      const isTestWeek = w === 3 && (m === 7 || m === 9);
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 1,
        title: `Verilog HDL - Month ${m} Week ${w + 1}`,
        theme: '💻 Hardware Description Language',
        tasks: [
          { id: `y1m${m}w${w}-1`, title: `Verilog: ${m === 7 ? topics7[w] : m === 8 ? topics8[w] : topics9[w]}`, description: 'Use Icarus Verilog for simulation and GTKWave for waveform viewing.', track: 'vlsi', type: m <= 8 ? 'learn' : 'project' },
          { id: `y1m${m}w${w}-2`, title: 'GitHub Portfolio', description: 'Push all Verilog designs with clean README.md files to your GitHub.', track: 'general', type: 'practice' },
          { id: `y1m${m}w${w}-3`, title: 'Cyber: Python for Security', description: `${['Socket Programming', 'Building a Port Scanner', 'Building a Keylogger (ethical lab)', 'Web Scraping with Requests/BS4'][w]}`, track: 'cyber', type: 'practice' },
          ...(isTestWeek ? [{ id: `y1m${m}w${w}-test`, title: `📝 MONTHLY TEST: Verilog ${m === 7 ? 'Basics' : 'Projects'}`, description: 'Test your Verilog coding and debugging skills.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
        ...(m === 9 && w === 0 ? {
          hackathonAlert: {
            name: 'PicoCTF (Beginner CTF)',
            platform: 'picoCTF',
            url: 'https://picoctf.org/',
            description: '🚨 CHALLENGE: Register for PicoCTF! Test your Linux, crypto, and web skills.',
          },
        } : {}),
      });
    }
  }

  // Month 10-12: Advanced Verilog + First Big Project
  for (let m = 10; m <= 12; m++) {
    for (let w = 0; w < 4; w++) {
      const topics10 = ['Verilog: Synthesis vs Simulation Constructs', 'Verilog: Coding for Synthesis (RTL Style)', 'Verilog: Clock Gating & Reset Strategies', 'Verilog: Lint Checking & Code Quality'];
      const topics11 = ['Project: SPI Master Design', 'Project: SPI Slave Design', 'Project: SPI Full Duplex Integration', 'Project: SPI Testbench & Verification'];
      const topics12 = ['I2C Protocol Study', 'I2C Master Design in Verilog', 'I2C Testbench & Waveform Analysis', 'Year 1 Portfolio Review & GitHub Cleanup'];
      const isTestWeek = w === 3 && (m === 10 || m === 12);
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 1,
        title: `${m === 10 ? 'Advanced Verilog' : m === 11 ? 'SPI Project' : 'I2C Project'} - Week ${w + 1}`,
        theme: m <= 10 ? '🔧 RTL Engineering' : '🏗️ Protocol Projects',
        tasks: [
          { id: `y1m${m}w${w}-1`, title: m === 10 ? topics10[w] : m === 11 ? topics11[w] : topics12[w], description: 'Build industry-standard protocol controllers for your portfolio.', track: 'vlsi', type: m >= 11 ? 'project' : 'learn' },
          { id: `y1m${m}w${w}-2`, title: 'OWASP Top 10 Study', description: `Cyber: ${['SQL Injection', 'Cross-Site Scripting (XSS)', 'Broken Authentication', 'Security Misconfiguration'][w]}`, track: 'cyber', type: 'learn' },
          ...(isTestWeek ? [{ id: `y1m${m}w${w}-test`, title: `📝 ${m === 12 ? 'YEAR 1 FINAL TEST' : 'MONTHLY TEST'}: ${m === 10 ? 'RTL Coding' : 'Year 1 Comprehensive'}`, description: m === 12 ? 'Comprehensive test covering all Year 1 topics.' : 'Test advanced Verilog concepts.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
        ...(m === 11 && w === 0 ? {
          hackathonAlert: {
            name: 'IIT Bombay Techfest - Circuit Design',
            platform: 'Techfest',
            url: 'https://techfest.org/',
            description: '🚨 CHALLENGE: Register for Techfest circuit design competitions to test your DLD and Verilog skills!',
          },
        } : {}),
      });
    }
  }

  // ═════════════════════════════════════════════
  // YEAR 2 (Months 13-24, Weeks 53-104)
  // "SystemVerilog, Architecture & Portfolio"
  // ═════════════════════════════════════════════

  // Month 13-14: Computer Architecture
  for (let m = 13; m <= 14; m++) {
    for (let w = 0; w < 4; w++) {
      const topics13 = ['Instruction Set Architecture (ISA)', 'Single-Cycle Processor Design', 'Multi-Cycle Processor Design', 'Pipelining Basics'];
      const topics14 = ['Pipeline Hazards (Data, Control, Structural)', 'Forwarding & Stalling', 'Cache Memory (Direct-Mapped, Set-Associative)', 'Virtual Memory & TLBs'];
      const isTestWeek = w === 3 && m === 14;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 2,
        title: `Computer Architecture - Month ${m - 12} of Y2, Week ${w + 1}`,
        theme: '🖥️ Processor Design',
        tasks: [
          { id: `y2m${m}w${w}-1`, title: `Architecture: ${m === 13 ? topics13[w] : topics14[w]}`, description: 'Study from "Computer Organization & Design" by Patterson & Hennessy.', track: 'vlsi', type: 'learn' },
          { id: `y2m${m}w${w}-2`, title: 'RISC-V ISA Study', description: `${['RISC-V Base Integer Instructions', 'RISC-V Assembly Programming', 'RISC-V Privileged Architecture', 'RISC-V Toolchain Setup'][w]}`, track: 'vlsi', type: 'learn' },
          { id: `y2m${m}w${w}-3`, title: 'Web Application Security', description: `Cyber: ${['HTTP Protocol Deep Dive', 'Burp Suite Setup & Proxy', 'SQL Injection Hands-on', 'XSS Attack & Defense'][w]}`, track: 'cyber', type: 'practice' },
          ...(isTestWeek ? [{ id: `y2m${m}w${w}-test`, title: '📝 MONTHLY TEST: Computer Architecture & RISC-V', description: 'Test your knowledge of processor design and pipelining.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
      });
    }
  }

  // Month 15-16: SystemVerilog Basics
  for (let m = 15; m <= 16; m++) {
    for (let w = 0; w < 4; w++) {
      const topics15 = ['SV: Data Types (logic, bit, enum, struct)', 'SV: Arrays (Dynamic, Associative, Queues)', 'SV: OOP - Classes & Objects', 'SV: OOP - Inheritance & Polymorphism'];
      const topics16 = ['SV: Randomization & Constraints', 'SV: Functional Coverage', 'SV: Assertions (SVA) - Immediate', 'SV: Assertions (SVA) - Concurrent'];
      const isTestWeek = w === 3 && m === 16;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 2,
        title: `SystemVerilog - Month ${m - 12} of Y2, Week ${w + 1}`,
        theme: '🚀 SystemVerilog Mastery',
        tasks: [
          { id: `y2m${m}w${w}-1`, title: m === 15 ? topics15[w] : topics16[w], description: 'SystemVerilog is the industry standard. Master it.', track: 'vlsi', type: 'learn' },
          { id: `y2m${m}w${w}-2`, title: 'SV Practice Problems', description: 'Solve coding exercises on ChipVerify and Verification Guide.', track: 'vlsi', type: 'practice' },
          { id: `y2m${m}w${w}-3`, title: 'TryHackMe Practice', description: `Cyber: ${['Intro to Offensive Security', 'Web Exploitation Room', 'Network Exploitation', 'Privilege Escalation'][w]}`, track: 'cyber', type: 'practice' },
          ...(isTestWeek ? [{ id: `y2m${m}w${w}-test`, title: '📝 MONTHLY TEST: SystemVerilog Fundamentals', description: 'Test SV data types, OOP, randomization and assertions.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
      });
    }
  }

  // Month 17-18: SV Advanced + AMBA Protocols
  for (let m = 17; m <= 18; m++) {
    for (let w = 0; w < 4; w++) {
      const topics17 = ['SV: Interfaces & Modports', 'SV: Clocking Blocks', 'SV: Program Blocks & Scheduling', 'SV: Inter-Process Communication (Mailbox, Semaphore, Event)'];
      const topics18 = ['AMBA APB Protocol Specification', 'AMBA AHB Protocol Specification', 'AMBA AXI Protocol Specification', 'AXI4 Channel Signals Deep Dive'];
      const isTestWeek = w === 3 && m === 18;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 2,
        title: `${m === 17 ? 'Advanced SV' : 'AMBA Protocols'} - Week ${w + 1}`,
        theme: m === 17 ? '⚙️ Advanced SystemVerilog' : '🔗 Bus Protocols',
        tasks: [
          { id: `y2m${m}w${w}-1`, title: m === 17 ? topics17[w] : topics18[w], description: m === 18 ? 'Understanding AMBA protocols is mandatory for any VLSI design/verification role.' : 'Master advanced SV concepts for verification.', track: 'vlsi', type: 'learn' },
          { id: `y2m${m}w${w}-2`, title: 'Hands-on Coding', description: 'Write SV testbenches using interfaces and clocking blocks for your previous Verilog designs.', track: 'vlsi', type: 'practice' },
          { id: `y2m${m}w${w}-3`, title: 'CTF Practice', description: `Cyber: ${['Cryptography Challenges', 'Reverse Engineering Basics', 'Forensics Challenges', 'Binary Exploitation Intro'][w]}`, track: 'cyber', type: 'practice' },
          ...(isTestWeek ? [{ id: `y2m${m}w${w}-test`, title: '📝 MONTHLY TEST: Advanced SV & AMBA', description: 'Test on AMBA protocols and advanced SystemVerilog.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
      });
    }
  }

  // Month 19-20: APB/AHB Project
  for (let m = 19; m <= 20; m++) {
    for (let w = 0; w < 4; w++) {
      const topics19 = ['Design: APB Slave (Register File)', 'Design: APB Master', 'SV Testbench: APB Directed Tests', 'SV Testbench: APB Constrained Random Tests'];
      const topics20 = ['Design: AHB Slave', 'Design: AHB-to-APB Bridge', 'SV Testbench: Bridge Verification', 'Coverage Analysis & Bug Fixing'];
      const isTestWeek = w === 3 && m === 20;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 2,
        title: `AMBA Project - Month ${m - 12} of Y2, Week ${w + 1}`,
        theme: '🏗️ AMBA Design & Verification',
        tasks: [
          { id: `y2m${m}w${w}-1`, title: m === 19 ? topics19[w] : topics20[w], description: 'Build a real AMBA subsystem. This is a top-tier portfolio project.', track: 'vlsi', type: 'project' },
          { id: `y2m${m}w${w}-2`, title: 'GitHub Documentation', description: 'Write detailed README with architecture diagrams and waveform screenshots.', track: 'general', type: 'practice' },
          ...(isTestWeek ? [{ id: `y2m${m}w${w}-test`, title: '📝 MONTHLY TEST: AMBA Design & Verification', description: 'Test your AMBA design and SV testbench skills.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
        ...(m === 19 && w === 0 ? {
          hackathonAlert: {
            name: 'Swadeshi Microprocessor Challenge',
            platform: 'Govt of India',
            url: 'https://www.iitm.ac.in/shakti',
            description: '🚨 CHALLENGE: Register for the Swadeshi Microprocessor Challenge! Design solutions using indigenous processors.',
          },
        } : {}),
      });
    }
  }

  // Month 21-22: Intermediate Projects
  for (let m = 21; m <= 22; m++) {
    for (let w = 0; w < 4; w++) {
      const topics21 = ['SPI Controller: Full SV Testbench', 'I2C Controller: Full SV Testbench', 'UART: Full SV Testbench with Coverage', 'Cross-Protocol Integration Testing'];
      const topics22 = ['FIFO Design: Synchronous', 'FIFO Design: Asynchronous (CDC)', 'Memory Controller: Basic SRAM Interface', 'Arbiter Design: Round-Robin'];
      const isTestWeek = w === 3 && m === 22;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 2,
        title: `Portfolio Projects - Month ${m - 12} of Y2, Week ${w + 1}`,
        theme: '📁 Portfolio Building',
        tasks: [
          { id: `y2m${m}w${w}-1`, title: m === 21 ? topics21[w] : topics22[w], description: 'Rewrite all previous projects with professional SV testbenches.', track: 'vlsi', type: 'project' },
          { id: `y2m${m}w${w}-3`, title: 'Cyber: CTF Competitions', description: `${['Join a CTF team', 'Practice on HackTheBox', 'Write CTF write-ups for blog', 'Participate in a weekend CTF event'][w]}`, track: 'cyber', type: 'hackathon' },
          ...(isTestWeek ? [{ id: `y2m${m}w${w}-test`, title: '📝 MONTHLY TEST: Portfolio Review & CDC', description: 'Test on async FIFO design and clock domain crossing.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
        ...(m === 21 && w === 0 ? {
          hackathonAlert: {
            name: 'e-Yantra by IIT Bombay',
            platform: 'e-Yantra',
            url: 'https://www.e-yantra.org/',
            description: '🚨 CHALLENGE: Register for e-Yantra robotics & embedded systems competition!',
          },
        } : {}),
      });
    }
  }

  // Month 23-24: Interview Prep + Year 2 Wrap
  for (let m = 23; m <= 24; m++) {
    for (let w = 0; w < 4; w++) {
      const topics23 = ['Interview Prep: Digital Design Questions', 'Interview Prep: SV/Verification Questions', 'Interview Prep: CMOS & Timing Analysis', 'Interview Prep: Protocol Questions'];
      const topics24 = ['LinkedIn Profile Optimization', 'Resume Building for VLSI/Cyber', 'Mock Interviews with Peers', 'Year 2 Final Portfolio Review'];
      const isTestWeek = w === 3 && m === 24;
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 2,
        title: `${m === 23 ? 'Interview Preparation' : 'Year 2 Wrap-Up'} - Week ${w + 1}`,
        theme: m === 23 ? '🎯 Interview Ready' : '📊 Year 2 Review',
        tasks: [
          { id: `y2m${m}w${w}-1`, title: m === 23 ? topics23[w] : topics24[w], description: m === 24 ? 'Polish your online presence and prepare for the final push.' : 'Start practicing common VLSI interview questions.', track: 'vlsi', type: m === 23 ? 'practice' : 'general' === 'general' ? 'practice' : 'practice' },
          { id: `y2m${m}w${w}-2`, title: 'Cyber: Certification Study', description: `${['CompTIA Security+ Overview', 'Security+ Study: Threats & Attacks', 'Security+ Study: Technologies & Tools', 'Security+ Study: Risk Management'][w]}`, track: 'cyber', type: 'learn' },
          ...(isTestWeek ? [{ id: `y2m${m}w${w}-test`, title: '📝 YEAR 2 FINAL TEST: Comprehensive Assessment', description: 'Comprehensive test covering all Year 2 topics.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
      });
    }
  }

  // ═════════════════════════════════════════════
  // YEAR 3 (Months 25-36, Weeks 105-156)
  // "UVM, Capstone & Job Hunting"
  // ═════════════════════════════════════════════

  // Month 25-28: UVM
  for (let m = 25; m <= 28; m++) {
    for (let w = 0; w < 4; w++) {
      const topics25 = ['UVM: Architecture & Philosophy', 'UVM: Components (uvm_driver, uvm_monitor)', 'UVM: Sequencer & Sequences', 'UVM: Agent & Environment'];
      const topics26 = ['UVM: Scoreboard & Comparators', 'UVM: TLM Ports & Analysis Ports', 'UVM: Configuration Database', 'UVM: Factory Overrides'];
      const topics27 = ['UVM: Register Abstraction Layer (RAL)', 'UVM: Callbacks & Virtual Sequences', 'UVM: Coverage Integration', 'UVM: Phase Control & Objection Mechanism'];
      const topics28 = ['UVM Project: APB Monitor + Scoreboard', 'UVM Project: AXI Driver + Sequencer', 'UVM Project: Full AXI UVM Env', 'UVM Project: Regression & Coverage Closure'];
      const isTestWeek = w === 3 && (m === 26 || m === 28);
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 3,
        title: `UVM ${m <= 27 ? 'Learning' : 'Project'} - Month ${m - 24} of Y3, Week ${w + 1}`,
        theme: '🏆 UVM - The Golden Ticket',
        tasks: [
          { id: `y3m${m}w${w}-1`, title: m === 25 ? topics25[w] : m === 26 ? topics26[w] : m === 27 ? topics27[w] : topics28[w], description: m <= 27 ? 'Study from Verification Academy by Siemens/Mentor.' : 'Build a complete UVM environment from scratch.', track: 'vlsi', type: m <= 27 ? 'learn' : 'project' },
          { id: `y3m${m}w${w}-2`, title: 'Cyber: Advanced Topics', description: `${['Active Directory Basics', 'Penetration Testing Methodology', 'Privilege Escalation Techniques', 'Report Writing for Pen Tests'][w]}`, track: 'cyber', type: 'learn' },
          ...(isTestWeek ? [{ id: `y3m${m}w${w}-test`, title: `📝 MONTHLY TEST: UVM ${m === 26 ? 'Fundamentals' : 'Project Assessment'}`, description: `Test your UVM ${m === 26 ? 'concepts' : 'practical implementation'}.`, track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
      });
    }
  }

  // Month 29-32: Capstone Project
  for (let m = 29; m <= 32; m++) {
    for (let w = 0; w < 4; w++) {
      const topics29 = ['Capstone: RISC-V Core - Fetch Stage', 'Capstone: RISC-V Core - Decode Stage', 'Capstone: RISC-V Core - Execute Stage', 'Capstone: RISC-V Core - Memory & Writeback'];
      const topics30 = ['Capstone: Pipeline Integration', 'Capstone: Hazard Detection Unit', 'Capstone: Forwarding Unit', 'Capstone: Branch Prediction'];
      const topics31 = ['Capstone: UVM Env for RISC-V', 'Capstone: Instruction-Level Verification', 'Capstone: Coverage-Driven Verification', 'Capstone: Regression Suite'];
      const topics32 = ['Capstone: Documentation & Architecture Diagrams', 'Capstone: Demo Video Recording', 'Capstone: GitHub Showcase Page', 'Capstone: Final Review & Portfolio Polish'];
      const isTestWeek = w === 3 && (m === 30 || m === 32);
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 3,
        title: `Capstone Project - Month ${m - 24} of Y3, Week ${w + 1}`,
        theme: '🚀 The "Hire Me" Project',
        tasks: [
          { id: `y3m${m}w${w}-1`, title: m === 29 ? topics29[w] : m === 30 ? topics30[w] : m === 31 ? topics31[w] : topics32[w], description: 'Build a 5-stage pipelined RISC-V processor with full UVM verification. This is your crown jewel.', track: 'vlsi', type: 'project' },
          { id: `y3m${m}w${w}-2`, title: 'Cyber: Lab Projects', description: `${['AD Home Lab Setup', 'AD Attack Simulation', 'Incident Response Practice', 'Security Audit Report'][w]}`, track: 'cyber', type: 'project' },
          ...(isTestWeek ? [{ id: `y3m${m}w${w}-test`, title: `📝 ${m === 32 ? 'YEAR 3 FINAL TEST' : 'MONTHLY TEST'}: Capstone & Job Readiness`, description: m === 32 ? 'Final comprehensive test across all 3 years.' : 'Test your RISC-V design and UVM implementation.', track: 'general' as const, type: 'test' as const }] : []),
        ],
        isTestWeek,
        ...(m === 29 && w === 0 ? {
          hackathonAlert: {
            name: 'Cadence / Synopsys Design Contest',
            platform: 'Industry',
            url: 'https://www.cadence.com/',
            description: '🚨 CHALLENGE: Look for Cadence/Synopsys student design contests. Winning = guaranteed interview!',
          },
        } : {}),
        ...(m === 31 && w === 0 ? {
          hackathonAlert: {
            name: 'Bug Bounty Programs',
            platform: 'HackerOne / Bugcrowd',
            url: 'https://www.hackerone.com/',
            description: '🚨 CYBER CHALLENGE: Start hunting real bugs on HackerOne or Bugcrowd!',
          },
        } : {}),
      });
    }
  }

  // Month 33-36: Job Hunting
  for (let m = 33; m <= 36; m++) {
    for (let w = 0; w < 4; w++) {
      const topics33 = ['Networking: Connect with 50 VLSI engineers on LinkedIn', 'Networking: Send 10 cold messages for referrals', 'Networking: Attend online VLSI webinars/meetups', 'Networking: Reach out to BVM alumni in semiconductor'];
      const topics34 = ['Apply: Intel Off-Campus', 'Apply: Qualcomm Off-Campus', 'Apply: NVIDIA Off-Campus', 'Apply: AMD / Texas Instruments / Broadcom'];
      const topics35 = ['Interview Prep: Mock Technical Interviews', 'Interview Prep: VLSI Design Puzzles', 'Interview Prep: SV/UVM Deep-Dive Questions', 'Interview Prep: Behavioral & HR Questions'];
      const topics36 = ['Final: Backup Plan Activation (if needed)', 'Final: Apply to Cyber Security Firms (CrowdStrike, Palo Alto)', 'Final: Follow up on all applications', 'Final: 🎉 YOU ARE READY - EXECUTE!'];
      weeks.push({
        weekIndex: weekIndex++,
        month: m, year: 3,
        title: `${m === 33 ? 'Networking Blitz' : m === 34 ? 'Application Phase' : m === 35 ? 'Interview Prep' : 'Final Execution'} - Week ${w + 1}`,
        theme: m <= 34 ? '🌐 Network & Apply' : m === 35 ? '🎤 Interview Mode' : '🎯 FINAL PHASE',
        tasks: [
          { id: `y3m${m}w${w}-1`, title: m === 33 ? topics33[w] : m === 34 ? topics34[w] : m === 35 ? topics35[w] : topics36[w], description: 'Execute aggressively. Every week counts now.', track: 'general', type: m <= 34 ? 'practice' : m === 35 ? 'practice' : 'practice' },
          { id: `y3m${m}w${w}-2`, title: 'Daily LeetCode/VLSI Practice', description: 'Solve 2 VLSI interview problems or coding challenges every single day.', track: 'vlsi', type: 'practice' },
        ],
      });
    }
  }

  // Assign estimated times dynamically
  weeks.forEach(w => {
    w.tasks.forEach(t => {
      if (!t.estimatedTime) {
        switch (t.type) {
          case 'learn': t.estimatedTime = '1.5h'; break;
          case 'practice': t.estimatedTime = '45m'; break;
          case 'project': t.estimatedTime = '3h'; break;
          case 'test': t.estimatedTime = '2h'; break;
          case 'hackathon': t.estimatedTime = '48h'; break;
          default: t.estimatedTime = '1h'; break;
        }
      }
    });
  });

  return weeks;
}

export const CURRICULUM: WeekPlan[] = generateWeeks();

// Monthly Test Questions Bank
export interface TestQuestion {
  id: string;
  monthIndex: number;
  question: string;
  options: string[];
  correctIndex: number;
  track: 'vlsi' | 'cyber' | 'general';
  topic: string;
}

export const TEST_BANK: TestQuestion[] = [
  // Month 3 Test
  { id: 'q-m3-1', monthIndex: 3, question: 'What command is used to change file permissions in Linux?', options: ['chmod', 'chown', 'chgrp', 'chperm'], correctIndex: 0, track: 'general', topic: 'Linux' },
  { id: 'q-m3-2', monthIndex: 3, question: 'Which layer of the OSI model handles routing?', options: ['Data Link', 'Transport', 'Network', 'Session'], correctIndex: 2, track: 'cyber', topic: 'Networking' },
  { id: 'q-m3-3', monthIndex: 3, question: 'What does TCL stand for?', options: ['Tool Control Language', 'Tool Command Language', 'Text Command Language', 'Terminal Control Language'], correctIndex: 1, track: 'vlsi', topic: 'TCL' },
  { id: 'q-m3-4', monthIndex: 3, question: 'Which Python data structure is immutable?', options: ['List', 'Dictionary', 'Set', 'Tuple'], correctIndex: 3, track: 'general', topic: 'Python' },
  { id: 'q-m3-5', monthIndex: 3, question: 'What is the default shell in most Linux distributions?', options: ['zsh', 'fish', 'bash', 'tcsh'], correctIndex: 2, track: 'general', topic: 'Linux' },

  // Month 5 Test
  { id: 'q-m5-1', monthIndex: 5, question: 'A flip-flop that toggles its output on every clock edge is called?', options: ['D Flip-Flop', 'SR Flip-Flop', 'JK Flip-Flop', 'T Flip-Flop'], correctIndex: 3, track: 'vlsi', topic: 'DLD' },
  { id: 'q-m5-2', monthIndex: 5, question: 'What is the minimum number of NAND gates needed to implement an inverter?', options: ['1', '2', '3', '4'], correctIndex: 0, track: 'vlsi', topic: 'DLD' },
  { id: 'q-m5-3', monthIndex: 5, question: 'Setup time violation occurs when?', options: ['Data arrives too late', 'Data arrives too early', 'Clock is too fast', 'Reset is asserted'], correctIndex: 0, track: 'vlsi', topic: 'Timing' },
  { id: 'q-m5-4', monthIndex: 5, question: 'Which logic family has the lowest static power consumption?', options: ['TTL', 'NMOS', 'CMOS', 'ECL'], correctIndex: 2, track: 'vlsi', topic: 'CMOS' },
  { id: 'q-m5-5', monthIndex: 5, question: 'In a Moore FSM, the output depends on?', options: ['Current state only', 'Current state and inputs', 'Previous state', 'Next state'], correctIndex: 0, track: 'vlsi', topic: 'FSM' },

  // Month 6 Test
  { id: 'q-m6-1', monthIndex: 6, question: 'In CMOS, what causes short-circuit power dissipation?', options: ['Leakage current', 'Both PMOS and NMOS on simultaneously', 'Charging load capacitance', 'Clock skew'], correctIndex: 1, track: 'vlsi', topic: 'CMOS' },
  { id: 'q-m6-2', monthIndex: 6, question: 'SRAM cell typically uses how many transistors?', options: ['1T', '3T', '6T', '8T'], correctIndex: 2, track: 'vlsi', topic: 'Memory' },
  { id: 'q-m6-3', monthIndex: 6, question: 'What is the purpose of ESD protection circuits?', options: ['Reduce power', 'Protect against electrostatic discharge', 'Improve speed', 'Reduce area'], correctIndex: 1, track: 'vlsi', topic: 'CMOS' },

  // Month 7 Test
  { id: 'q-m7-1', monthIndex: 7, question: 'In Verilog, "assign" is used for?', options: ['Sequential logic', 'Continuous assignment', 'Procedural assignment', 'Task call'], correctIndex: 1, track: 'vlsi', topic: 'Verilog' },
  { id: 'q-m7-2', monthIndex: 7, question: 'Which Verilog block is used for combinational logic?', options: ['always @(posedge clk)', 'always @(*)', 'initial', 'generate'], correctIndex: 1, track: 'vlsi', topic: 'Verilog' },
  { id: 'q-m7-3', monthIndex: 7, question: 'Blocking assignment in Verilog uses which operator?', options: ['<=', '=', ':=', '=='], correctIndex: 1, track: 'vlsi', topic: 'Verilog' },

  // Month 9 Test
  { id: 'q-m9-1', monthIndex: 9, question: 'In UART, what does the start bit signify?', options: ['End of frame', 'Beginning of data transmission', 'Parity check', 'Stop condition'], correctIndex: 1, track: 'vlsi', topic: 'Protocols' },
  { id: 'q-m9-2', monthIndex: 9, question: 'An FSM-based traffic light controller is best implemented using?', options: ['Combinational logic only', 'Moore or Mealy FSM', 'Look-up tables', 'PLA'], correctIndex: 1, track: 'vlsi', topic: 'FSM' },

  // Month 10 Test
  { id: 'q-m10-1', monthIndex: 10, question: 'Which Verilog construct is NOT synthesizable?', options: ['assign', 'always @(posedge clk)', 'initial', 'generate'], correctIndex: 2, track: 'vlsi', topic: 'RTL' },
  { id: 'q-m10-2', monthIndex: 10, question: 'Clock gating is used primarily to?', options: ['Increase frequency', 'Reduce dynamic power', 'Improve setup time', 'Fix hold violations'], correctIndex: 1, track: 'vlsi', topic: 'RTL' },

  // Month 12 (Year 1 Final)
  { id: 'q-m12-1', monthIndex: 12, question: 'SPI communication is?', options: ['Half-duplex only', 'Full-duplex', 'Simplex', 'None of the above'], correctIndex: 1, track: 'vlsi', topic: 'Protocols' },
  { id: 'q-m12-2', monthIndex: 12, question: 'I2C uses how many wires?', options: ['1', '2', '3', '4'], correctIndex: 1, track: 'vlsi', topic: 'Protocols' },
  { id: 'q-m12-3', monthIndex: 12, question: 'Which SQL injection type returns data directly in the response?', options: ['Blind', 'Time-based', 'Union-based', 'Boolean-based'], correctIndex: 2, track: 'cyber', topic: 'WebSec' },

  // Month 14 Test
  { id: 'q-m14-1', monthIndex: 14, question: 'In a 5-stage pipeline, a data hazard occurs when?', options: ['Branch is taken', 'Two instructions need the same resource', 'An instruction depends on the result of a previous one', 'Cache miss occurs'], correctIndex: 2, track: 'vlsi', topic: 'Architecture' },
  { id: 'q-m14-2', monthIndex: 14, question: 'Forwarding/Bypassing helps resolve?', options: ['Control hazards', 'Structural hazards', 'Data hazards', 'Memory hazards'], correctIndex: 2, track: 'vlsi', topic: 'Architecture' },

  // Month 16 Test
  { id: 'q-m16-1', monthIndex: 16, question: 'In SystemVerilog, which data type has 4-state values?', options: ['bit', 'logic', 'int', 'byte'], correctIndex: 1, track: 'vlsi', topic: 'SystemVerilog' },
  { id: 'q-m16-2', monthIndex: 16, question: 'Constrained randomization in SV uses which keyword?', options: ['random', 'rand', 'randomize', 'constrain'], correctIndex: 1, track: 'vlsi', topic: 'SystemVerilog' },

  // Month 18 Test
  { id: 'q-m18-1', monthIndex: 18, question: 'In AXI protocol, how many independent channels are there?', options: ['2', '3', '4', '5'], correctIndex: 3, track: 'vlsi', topic: 'AMBA' },
  { id: 'q-m18-2', monthIndex: 18, question: 'AXI uses which type of handshake?', options: ['2-wire (VALID/READY)', '3-wire', '4-phase', 'No handshake'], correctIndex: 0, track: 'vlsi', topic: 'AMBA' },

  // Month 20 Test
  { id: 'q-m20-1', monthIndex: 20, question: 'An APB transfer takes a minimum of how many clock cycles?', options: ['1', '2', '3', '4'], correctIndex: 1, track: 'vlsi', topic: 'AMBA' },

  // Month 22 Test
  { id: 'q-m22-1', monthIndex: 22, question: 'In an asynchronous FIFO, what technique prevents metastability?', options: ['Clock gating', 'Gray code pointers', 'Double buffering', 'Priority encoding'], correctIndex: 1, track: 'vlsi', topic: 'CDC' },

  // Month 24 (Year 2 Final)
  { id: 'q-m24-1', monthIndex: 24, question: 'Functional coverage in SV measures?', options: ['Code execution', 'Feature exercise', 'Timing closure', 'Power consumption'], correctIndex: 1, track: 'vlsi', topic: 'Verification' },

  // Month 26 Test
  { id: 'q-m26-1', monthIndex: 26, question: 'In UVM, the uvm_driver is responsible for?', options: ['Collecting coverage', 'Driving transactions to the DUT', 'Monitoring DUT outputs', 'Comparing results'], correctIndex: 1, track: 'vlsi', topic: 'UVM' },
  { id: 'q-m26-2', monthIndex: 26, question: 'UVM Factory is used for?', options: ['Creating objects', 'Type overriding without code change', 'Both A and B', 'Configuration'], correctIndex: 2, track: 'vlsi', topic: 'UVM' },

  // Month 28 Test
  { id: 'q-m28-1', monthIndex: 28, question: 'UVM RAL stands for?', options: ['Register Abstraction Layer', 'Random Access Layer', 'Register Access Logic', 'Runtime Abstraction Layer'], correctIndex: 0, track: 'vlsi', topic: 'UVM' },

  // Month 30 Test
  { id: 'q-m30-1', monthIndex: 30, question: 'In a RISC-V pipeline, which stage handles ALU operations?', options: ['Fetch', 'Decode', 'Execute', 'Memory'], correctIndex: 2, track: 'vlsi', topic: 'RISC-V' },

  // Month 32 (Year 3 Final)
  { id: 'q-m32-1', monthIndex: 32, question: 'Coverage closure in verification means?', options: ['All code is written', 'All planned scenarios have been tested', 'All bugs are fixed', 'Timing is met'], correctIndex: 1, track: 'vlsi', topic: 'Verification' },
];
