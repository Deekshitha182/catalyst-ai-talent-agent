# Catalyst: AI-Powered Talent Scouting & Engagement Agent

This project is a working prototype for the Catalyst challenge. It helps recruiters move from a plain Job Description (JD) to a ranked, actionable shortlist of candidates.

The agent performs:
- JD understanding
- candidate matching
- conversational interest estimation (simulated)
- explainable ranking output

## Problem

Recruiters spend hours manually screening profiles and following up with candidates to check real intent. This project automates that workflow and produces two decision-friendly scores:

- **Match Score**: how closely a candidate aligns with the JD
- **Interest Score**: how likely the candidate is genuinely interested

## End-to-End Workflow

1. **JD Parsing**
   - Extract role, skills, experience requirements, and constraints.
2. **Candidate Discovery**
   - Fetch relevant candidate profiles from the available candidate data source.
3. **Matching with Explainability**
   - Score candidates with a reasoned breakdown (skills, experience, relevance).
4. **Conversational Outreach (Simulated)**
   - Run AI-based dialogue simulation to infer intent signals.
5. **Ranking**
   - Generate Match Score, Interest Score, and final combined rank.

## Scoring Logic

### Match Score (0-100)
Typical factors:
- required skill overlap
- preferred skill overlap
- years-of-experience fit
- domain/role relevance

### Interest Score (0-100)
Typical factors:
- positive intent in responses
- engagement quality
- alignment with role expectations

### Final Score
Example weighted formula:

`Final Score = 0.70 * Match Score + 0.30 * Interest Score`

Weights can be tuned based on recruiter preference.

## Tech Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express
- **AI:** Google Gemini (`@google/genai`)
- **UI:** Tailwind CSS, Motion, Lucide

## Local Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm

### Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open:
   [http://localhost:3000](http://localhost:3000)

## Build Commands

```bash
npm run build
npm run preview
```

## Sample Input

**Job Description**  
`Looking for a Frontend Engineer with 3+ years experience in React, TypeScript, and performance optimization. Strong communication and product mindset preferred.`

## Sample Output (Illustrative)

| Candidate | Match Score | Interest Score | Final Score | Explanation |
|---|---:|---:|---:|---|
| Candidate A | 88 | 76 | 84.4 | Strong skill overlap and positive outreach signals |
| Candidate B | 81 | 85 | 82.2 | Good technical fit and high intent |
| Candidate C | 79 | 62 | 73.9 | Good profile fit but moderate interest |


