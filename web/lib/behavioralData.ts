export interface BehavioralQuestion {
  id: string;
  question: string;
  category: string;
  principle: string;
  whyItMatters: string;
  tips: string[];
}

export const TOP_30_BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  {
    id: 'bq-conflict-technical',
    question: 'Tell me about a time you had a significant technical disagreement with a senior teammate or tech lead. How did you resolve it?',
    category: 'Conflict & Collaboration',
    principle: 'Have Backbone; Disagree and Commit',
    whyItMatters: 'Interviews evaluate if you can defend your technical convictions with data, benchmark tests, or prototypes without becoming defensive or toxic.',
    tips: [
      'Focus on objective data (load test numbers, memory footprint, benchmark results) rather than opinions.',
      'Show that you listened to their concerns and understood their reasoning.',
      'Highlight how the team committed together once a final decision was made.'
    ]
  },
  {
    id: 'bq-tight-deadline-compromise',
    question: 'Describe a situation where you had to deliver a critical project under an impossibly tight deadline. What tradeoffs did you make?',
    category: 'Execution & Deadlines',
    principle: 'Deliver Results & Bias for Action',
    whyItMatters: 'Tests how you prioritize MVP features, manage technical debt deliberately, and communicate timeline risks to stakeholders.',
    tips: [
      'Distinguish between P0 must-haves and P1/P2 nice-to-haves.',
      'Explain the explicit technical debt accepted and the timeline scheduled to remediate it.',
      'Mention proactive stakeholder alignment.'
    ]
  },
  {
    id: 'bq-production-outage-failure',
    question: 'Tell me about a time you caused or managed a major production outage. How did you handle the post-mortem and mitigation?',
    category: 'Failures & Outages',
    principle: 'Ownership & Dive Deep',
    whyItMatters: 'Great engineers take extreme ownership of failures, stay calm under pressure, and establish permanent architectural safeguards.',
    tips: [
      'Own the mistake without blaming others or third-party libraries.',
      'Walk through the 5-Whys root cause analysis.',
      'List the concrete automated tests, alerts, or circuit breakers implemented to ensure it never happens again.'
    ]
  },
  {
    id: 'bq-ambiguous-requirements',
    question: 'Tell me about a project where the requirements were extremely vague or constantly changing. How did you drive clarity?',
    category: 'Ambiguity & Architecture',
    principle: 'Bias for Action & Customer Obsession',
    whyItMatters: 'Mid/Senior engineers are expected to turn fuzzy business requirements into concrete architectural RFCs.',
    tips: [
      'Describe how you drafted an RFC/design doc with clear options and tradeoffs.',
      'Explain how you gathered user feedback through rapid prototyping or wireframes.'
    ]
  },
  {
    id: 'bq-mentoring-junior',
    question: 'Give an example of how you mentored a junior engineer or helped an underperforming teammate level up.',
    category: 'Leadership & Mentorship',
    principle: 'Earn Trust & Develop the Best',
    whyItMatters: 'Leadership rounds assess if you elevate the team around you through empathetic pairing, constructive PR reviews, and knowledge sharing.',
    tips: [
      'Highlight pair programming sessions and creating psychological safety.',
      'Mention measurable growth (e.g. they led their own project 3 months later).'
    ]
  },
  {
    id: 'bq-refactoring-legacy',
    question: 'Tell me about a time you championed a major refactor or modern tech migration that had no direct product feature request.',
    category: 'Technical Leadership',
    principle: 'Invent and Simplify & Dive Deep',
    whyItMatters: 'Demonstrates your ability to justify engineering health investments with business metrics (build times, crash rate, latency).',
    tips: [
      'Quantify the cost of the legacy codebase (e.g. 40min CI times, 20% crash rate).',
      'Describe phased, zero-downtime strangler-fig migration instead of risky big-bang rewrites.'
    ]
  },
  {
    id: 'bq-cross-functional-alignment',
    question: 'Describe a scenario where Product Management wanted a feature immediately, but Engineering knew it had critical security or scalability risks.',
    category: 'Cross-Functional Strategy',
    principle: 'Customer Obsession & Have Backbone',
    whyItMatters: 'Evaluates your ability to communicate complex technical risk in terms product managers and executives understand (data loss, SLA breach).',
    tips: [
      'Frame the conversation around protecting user trust rather than pure technical purity.',
      'Offer a phased compromise that unblocks initial business testing while preserving core safety.'
    ]
  },
  {
    id: 'bq-above-and-beyond',
    question: 'Tell me about a time you went significantly outside your formal job scope to solve an urgent organizational problem.',
    category: 'Ownership',
    principle: 'Ownership (Leaders never say "that’s not my job")',
    whyItMatters: 'Identifies high-agency self-starters who proactively identify and eliminate bottlenecks.',
    tips: [
      'Explain how you noticed an unowned issue impacting customers or developer productivity.',
      'Describe how you took initiative without waiting for management permission.'
    ]
  }
];

export interface ReverseInterviewQuestion {
  id: string;
  category: string;
  question: string;
  whatItReveals: string;
  greenFlags: string;
  redFlags: string;
}

export const REVERSE_INTERVIEW_QUESTIONS: ReverseInterviewQuestion[] = [
  {
    id: 'rev-tech-debt',
    category: '🛠️ Engineering Practices & Tech Debt',
    question: 'How does the engineering team balance product roadmap features with refactoring and technical debt?',
    whatItReveals: 'Whether the company allocates dedicated engineering capacity (e.g. 20% time or dedicated maintenance sprints) or perpetually pushes hacks until systems fail.',
    greenFlags: 'Dedicated tech-debt backlog, engineering-led sprints, and metrics-driven refactoring.',
    redFlags: '"We fix it when we have extra time" (which means never).'
  },
  {
    id: 'rev-on-call',
    category: '🚨 On-Call & Production Incidents',
    question: 'What does the on-call rotation look like, how often are engineers paged after hours, and how are post-mortems conducted?',
    whatItReveals: 'Team work-life balance, system stability, and whether the team has a blameless engineering culture.',
    greenFlags: 'Blameless post-mortems, action items prioritized in the next sprint, secondary on-call support, compensatory time off.',
    redFlags: 'Frequent 2 AM pages, blaming individuals for outages, or no formal root-cause tracking.'
  },
  {
    id: 'rev-arch-decisions',
    category: '🏛️ Architecture & Decision Making',
    question: 'When senior engineers or leads have strong architectural disagreements (e.g., choosing a database or framework), how is the final decision made?',
    whatItReveals: 'Whether decisions are driven by RFCs (Request for Comments), prototypes, and data, or by executive fiat and office politics.',
    greenFlags: 'Written RFC process, proof-of-concept benchmarks, and "Disagree and Commit" culture.',
    redFlags: '"The director decides" or passive-aggressive gridlock.'
  },
  {
    id: 'rev-career-growth',
    category: '📈 Career Growth & Leveling',
    question: 'What distinguishes an engineer who meets expectations from someone who gets promoted to Senior/Staff on this team?',
    whatItReveals: 'Clear, transparent leveling expectations vs vague managerial favoritism.',
    greenFlags: 'Clear rubric based on technical scope, cross-team impact, system design ownership, and mentorship.',
    redFlags: '"Just work hard and we’ll see at annual review."'
  },
  {
    id: 'rev-day-to-day',
    category: '🤝 Day-to-Day Workflow & Autonomy',
    question: 'What does a typical day look like in terms of uninterrupted coding time vs meetings and syncs?',
    whatItReveals: 'Meeting overload and whether the engineering management protects maker time.',
    greenFlags: 'No-meeting days (e.g. Focus Wednesdays), async-first communication, short daily standups.',
    redFlags: '5+ hours of daily meetings with coding crammed in late evenings.'
  },
  {
    id: 'rev-biggest-challenge',
    category: '🏢 Company Strategy & Scale',
    question: 'What is the single biggest technical or scalability challenge this team must solve in the next 12 months?',
    whatItReveals: 'Whether the interviewer actually understands the team roadmap and if the upcoming work is interesting and challenging.',
    greenFlags: 'Specific, clear architectural goals (e.g. migrating from monolith to microservices, scaling to 10M QPS).',
    redFlags: 'Vague generic answers or complete lack of clarity on team vision.'
  }
];
