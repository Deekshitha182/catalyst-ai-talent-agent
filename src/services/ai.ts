import { Candidate, mockCandidates } from "../data/candidates";

export interface MatchResult {
  candidateId: string;
  matchScore: number; // 0-100
  rationale: string;
}

export interface EngagementResult {
  candidateId: string;
  interestScore: number; // 0-100
  simulatedChatLog: { speaker: string; message: string }[];
  interestRationale: string;
}

// A simple delay function to simulate AI processing time
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function matchCandidatesToJD(jdText: string): Promise<MatchResult[]> {
  await delay(1200); // Simulate processing delay
  const jdLower = jdText.toLowerCase();

  return mockCandidates.map((candidate) => {
    let score = 40; // Base baseline score
    let matchedSkills: string[] = [];
    let missingSkills: string[] = [];

    // 1. Skill Matching
    candidate.skills.forEach(skill => {
      // Basic text matching
      if (jdLower.includes(skill.toLowerCase())) {
        score += 12;
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // 2. Role Matching
    const roleTokens = candidate.role.toLowerCase().split(' ');
    roleTokens.forEach(token => {
      if (token.length > 3 && jdLower.includes(token)) {
        score += 8;
      }
    });

    // 3. Experience Matching
    const jdHasSenior = jdLower.includes("senior") || jdLower.includes("lead") || jdLower.includes("staff") || jdLower.includes("principal");
    const candidateIsSenior = candidate.experience >= 5 || candidate.role.toLowerCase().includes("senior") || candidate.role.toLowerCase().includes("lead");
    
    if (jdHasSenior && candidateIsSenior) {
      score += 15;
    } else if (jdHasSenior && !candidateIsSenior) {
      score -= 15;
    }

    // Add a tiny bit of random noise for heuristic variance in demos
    score += Math.floor(Math.random() * 6) - 3; 

    // Cap score safely between 15 and 98
    score = Math.min(Math.max(score, 15), 98);

    // Generate deterministic Rationale based on rules
    let rationale = "";
    if (score >= 80) {
      rationale = `Excellent match. Strong overlap in core skills like ${matchedSkills.slice(0, 3).join(', ')}. Solid role alignment.`;
    } else if (score >= 60) {
      if (matchedSkills.length > 0) {
        rationale = `Good potential match. Has relevant background in ${matchedSkills.slice(0, 2).join(', ')} but may require ramp-up in other areas.`;
      } else {
        rationale = `Moderate match based on experience level, though explicit skill crossover wasn't heavily detected in the JD.`;
      }
    } else {
      const topMissingInfo = ['AWS', 'React', 'Python', 'Go', 'TypeScript', 'Node.js']
        .find(k => jdLower.includes(k.toLowerCase()) && !candidate.skills.map(s=>s.toLowerCase()).includes(k.toLowerCase()));
      
      if (topMissingInfo) {
        rationale = `Lower alignment with JD. Profile lacks explicit mention of required skills like ${topMissingInfo}.`;
      } else {
        rationale = `Low match. Profile does not sufficiently map to the specific seniority or toolset requested.`;
      }
    }

    return {
      candidateId: candidate.id,
      matchScore: score,
      rationale
    };
  });
}

export async function simulateEngagement(candidate: Candidate, jdSummary: string): Promise<EngagementResult> {
  await delay(800); // Simulate conversational delay
  const traits = candidate.simulatedTraits;
  let interestScore = 0;
  let interestRationale = "";
  let chatLog: { speaker: string; message: string }[] = [];

  // Initial Outreach
  chatLog.push({
    speaker: "Agent",
    message: `Hi ${candidate.name.split(' ')[0]}, I came across your profile. We have an opening for a ${candidate.role} that aligns nicely with your experience. Are you open to a quick chat?`
  });

  if (traits.responsePersonality === 'unresponsive') {
    interestScore = 15;
    interestRationale = "Candidate did not respond to the initial outreach attempt.";
    // No further messages
    return { candidateId: candidate.id, interestScore, simulatedChatLog: chatLog, interestRationale };
  }

  if (!traits.openToNewOpportunities) {
    interestScore = 25;
    interestRationale = "Candidate indicated they are not currently open to leaving their current role.";
    chatLog.push({
      speaker: candidate.name,
      message: `Thanks for reaching out! I'm actually very happy at ${candidate.currentCompany} right now, but let's stay connected.`
    });
    chatLog.push({
      speaker: "Agent",
      message: "No problem at all. Best of luck and we'll keep in touch!"
    });
    return { candidateId: candidate.id, interestScore, simulatedChatLog: chatLog, interestRationale };
  }

  // If they are open
  if (traits.responsePersonality === 'enthusiastic') {
    interestScore = 85 + Math.floor(Math.random() * 10); // 85-94
    interestRationale = "Candidate is actively looking and highly enthusiastic about the role and stack.";
    chatLog.push({
      speaker: candidate.name,
      message: `Absolutely! I've been looking to work more with ${traits.preferredTechStack[0] || 'newer technologies'}. Could you share more details?`
    });
    chatLog.push({
      speaker: "Agent",
      message: `Great! The role involves leading efforts closely tied to those areas. Does a salary range around $${Math.floor(traits.desiredSalaryRange[0] / 1000)}k work for you?`
    });
    chatLog.push({
      speaker: candidate.name,
      message: "Yes, that's exactly within my expectations. Let's schedule a call."
    });
  } else {
    // Neutral or Reluctant
    interestScore = 55 + Math.floor(Math.random() * 15); // 55-69
    interestRationale = "Candidate is open to listening but cautious; wants more information before committing to a call.";
    chatLog.push({
      speaker: candidate.name,
      message: `I might be open to it, depending on the exact tech stack and compensation. Can you provide more info before jumping on a call?`
    });
    chatLog.push({
      speaker: "Agent",
      message: `Of course. We leverage modern tools heavily and the compensation is competitive for your tier. I can send over a full brief.`
    });
    chatLog.push({
      speaker: candidate.name,
      message: `Sure, please send it over and I'll take a look later this week.`
    });
  }

  return {
    candidateId: candidate.id,
    interestScore,
    simulatedChatLog: chatLog,
    interestRationale
  };
}
