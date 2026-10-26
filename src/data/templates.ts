import { Decision } from '../types/decision';

export const SAMPLE_DECISIONS: Decision[] = [
  {
    id: 'decision-startup-vs-bigtech',
    title: 'Accept Early-Stage AI Startup Offer vs Stay at Tier-1 Tech Company',
    context:
      'Mid-senior engineer with 6 years of tenure. Offered Founding Staff Engineer role with 1.2% equity and $175k base at a Series A AI company, versus current total compensation of $340k with high job stability, predictable hours, and pending promo cycle.',
    tag: 'Career & Wealth',
    createdAt: '2026-10-24T14:30:00Z',
    updatedAt: '2026-10-24T14:30:00Z',
    options: [
      {
        id: 'opt-startup',
        name: 'Join Series A AI Startup (Founding Staff)',
        summary:
          'High agency, immense technical learning velocity, and uncapped equity upside with significant compensation haircut and runway risk.',
        pros: [
          {
            id: 'p-s1',
            text: 'Direct technical ownership and architectural authority',
            category: 'Career',
            impact: 5,
            rationale:
              'No bureaucratic design reviews or committee approvals; you build zero-to-one infrastructure directly.',
          },
          {
            id: 'p-s2',
            text: 'Asymmetric equity upside if company scales',
            category: 'Financial',
            impact: 5,
            rationale:
              'A 1.2% stake in a breakout AI infrastructure business can generate generational wealth ($3M-$10M+ outcome).',
          },
          {
            id: 'p-s3',
            text: 'Exponential professional network expansion with founders and VCs',
            category: 'Career',
            impact: 4,
            rationale:
              'High visibility in the startup ecosystem creates lifetime recurring founder-tier opportunities.',
          },
          {
            id: 'p-s4',
            text: 'Escape corporate political stagnation',
            category: 'Emotional / Well-being',
            impact: 4,
            rationale:
              'Energy shifted from internal alignment meetings to tangible product shipments.',
          },
        ],
        cons: [
          {
            id: 'c-s1',
            text: '$165k immediate annual cash comp reduction',
            category: 'Financial',
            impact: 4,
            rationale:
              'Reduces discretionary cash flow and monthly savings rate, necessitating lifestyle budget discipline.',
          },
          {
            id: 'c-s2',
            text: '18-24 month runway risk and market volatility',
            category: 'Risk & Uncertainty',
            impact: 5,
            rationale:
              'Macro headwinds or missed product-market fit could force a down-round, layoff, or shutdown.',
          },
          {
            id: 'c-s3',
            text: 'Unbounded work hours and high baseline operational stress',
            category: 'Effort & Time',
            impact: 4,
            rationale:
              'On-call rotations, urgent client fire drills, and weekend deployments will erode work-life boundaries.',
          },
        ],
        swot: {
          strengths: [
            'Deep engineering sovereignty with modern AI/ML tech stack',
            'Direct alignment between effort and company enterprise value',
            'Accelerates path to VP of Engineering or future Founder status',
          ],
          weaknesses: [
            'Severe drop in immediate liquidity and guaranteed liquid RSUs',
            'Lean team means handling unglamorous devops, support, and triage',
            'No institutional safety net or HR mediation layers',
          ],
          opportunities: [
            'Riding the compounding wave of enterprise generative workflows',
            'Positioning yourself as a top-tier early AI systems architect',
            'Secondary liquidity events at Series B/C if revenue doubles',
          ],
          threats: [
            'Foundation model commodity squeeze or hyperscaler copycat tools',
            'Founder dilution and liquidation preferences reducing common stock',
            'Burnout from unrelenting sprint pace without vacation recovery',
          ],
        },
        keyAssumptions: [
          'The founders have genuine enterprise sales distribution, not just flashy demo tech.',
          'Your personal balance sheet can absorb 2 years of lower base salary without stress.',
        ],
      },
      {
        id: 'opt-bigtech',
        name: 'Stay at Tier-1 Tech Company (Promotion Track)',
        summary:
          'Maximized liquidity, predictable 40-hour weeks, robust benefits, but slower execution velocity and organizational friction.',
        pros: [
          {
            id: 'p-b1',
            text: 'Guaranteed $340k liquid compensation and robust 401(k) match',
            category: 'Financial',
            impact: 5,
            rationale:
              'Provides immediate mortgage payoff capacity, high index fund accumulation, and zero equity risk.',
          },
          {
            id: 'p-b2',
            text: 'Predictable work-life balance and psychological separation',
            category: 'Emotional / Well-being',
            impact: 4,
            rationale:
              'Evenings and weekends remain protected; ample PTO that you can take without guilt.',
          },
          {
            id: 'p-b3',
            text: 'Pending promotion to Principal/Staff with existing social capital',
            category: 'Career',
            impact: 3,
            rationale:
              'You already know the codebase, the reviewers, and the decision-makers to land the promotion.',
          },
        ],
        cons: [
          {
            id: 'c-b1',
            text: 'Bureaucratic friction and slow velocity',
            category: 'Effort & Time',
            impact: 4,
            rationale:
              'High percentage of weekly cycles spent on alignment docs, compliance, and multi-team approvals.',
          },
          {
            id: 'c-b2',
            text: 'Skill ossification on legacy proprietary frameworks',
            category: 'Career',
            impact: 4,
            rationale:
              'Internal tooling rarely transfers directly to modern open source or fast-paced industry standards.',
          },
          {
            id: 'c-b3',
            text: 'Persistent "what if" career regret',
            category: 'Emotional / Well-being',
            impact: 3,
            rationale:
              'Watching peers launch fast companies while feeling comfortable but intellectually under-stimulated.',
          },
        ],
        swot: {
          strengths: [
            'Rock-solid balance sheet resilience with public liquid stock',
            'Expansive internal mobility across dozens of teams and projects',
            'Strong brand pedigree on your resume',
          ],
          weaknesses: [
            'Fragmented impact diluted across thousands of internal peers',
            'Risk of organizational reshuffles canceling products after a year of work',
          ],
          opportunities: [
            'Leveraging internal compute resources to publish or lead enterprise AI initiatives',
            'Using stable free evenings to build side-projects or angel invest',
          ],
          threats: [
            'Corporate cost-cutting or restructuring cycles impacting headcount',
            'Becoming over-specialized in enterprise-specific operational mechanics',
          ],
        },
        keyAssumptions: [
          'The pending promotion has executive sponsor commitment, not just verbal praise.',
          'You can maintain passion and avoid quiet quitting despite institutional inertia.',
        ],
      },
    ],
    criteria: [
      {
        id: 'crit-comp',
        name: 'Guaranteed Liquidity & Financial Safety',
        description: 'Ability to fund living expenses, save cash, and protect downside risk',
        weight: 8,
        scores: [
          {
            optionName: 'Join Series A AI Startup (Founding Staff)',
            score: 4,
            rationale: '$175k base is livable but leaves little margin for high savings.',
          },
          {
            optionName: 'Stay at Tier-1 Tech Company (Promotion Track)',
            score: 9,
            rationale: '$340k total comp with liquid public stock offers premier safety.',
          },
        ],
      },
      {
        id: 'crit-upside',
        name: 'Long-Term Wealth Upside Potential',
        description: 'Possibility of life-changing capital gains over a 5-year horizon',
        weight: 8,
        scores: [
          {
            optionName: 'Join Series A AI Startup (Founding Staff)',
            score: 9,
            rationale: '1.2% equity in a breakthrough tech company has uncapped ceiling.',
          },
          {
            optionName: 'Stay at Tier-1 Tech Company (Promotion Track)',
            score: 5,
            rationale: 'Steady stock appreciation, but bounded return multiples.',
          },
        ],
      },
      {
        id: 'crit-velocity',
        name: 'Skill Compounding & Growth Velocity',
        description: 'Rate at which you become an exceptional, high-leverage operator',
        weight: 9,
        scores: [
          {
            optionName: 'Join Series A AI Startup (Founding Staff)',
            score: 10,
            rationale: 'Extreme ownership forces rapid mastery of end-to-end architecture.',
          },
          {
            optionName: 'Stay at Tier-1 Tech Company (Promotion Track)',
            score: 5,
            rationale: 'Deep specialization within walled gardens, slower feedback loops.',
          },
        ],
      },
      {
        id: 'crit-stress',
        name: 'Daily Peace of Mind & Sustainable Hours',
        description: 'Low cognitive dread, predictable nights/weekends, minimal panic',
        weight: 7,
        scores: [
          {
            optionName: 'Join Series A AI Startup (Founding Staff)',
            score: 4,
            rationale: 'Constant deadline pressure and firefighting.',
          },
          {
            optionName: 'Stay at Tier-1 Tech Company (Promotion Track)',
            score: 8,
            rationale: 'Predictable boundaries and easy coverage when taking time off.',
          },
        ],
      },
      {
        id: 'crit-reversibility',
        name: 'Reversibility & Optionality',
        description: 'How easily you can backtrack if the choice proves suboptimal',
        weight: 7,
        scores: [
          {
            optionName: 'Join Series A AI Startup (Founding Staff)',
            score: 8,
            rationale: 'Big tech companies enthusiastically re-hire former alumni after startup stints.',
          },
          {
            optionName: 'Stay at Tier-1 Tech Company (Promotion Track)',
            score: 6,
            rationale: 'Easy to stay, but startup hiring windows and appetite diminish with age/inertia.',
          },
        ],
      },
    ],
    ruling: {
      bottomLineVerdict:
        'Join the Series A AI Startup — but enforce a strict 18-month checkpoint contract with yourself.',
      recommendedOptionName: 'Join Series A AI Startup (Founding Staff)',
      confidenceLevel: 'High',
      rulingRationale:
        'At 6 years of experience, the market premium for early-stage zero-to-one builders in modern AI vastly outpaces incremental corporate promotions. Because former big tech engineers maintain high re-hire optionality (Door B is reversible), the asymmetric upside of equity combined with exponential skill compounding outweighs the temporary cash haircut.',
      ifThenRules: [
        {
          condition: 'If your household emergency fund has less than 9 months of liquid expenses or your spouse is in school',
          recommendedOption: 'Stay at Tier-1 Tech Company (Promotion Track)',
        },
        {
          condition: 'If your primary career objective over the next 5 years is becoming a CTO, Founder, or elite engineering leader',
          recommendedOption: 'Join Series A AI Startup (Founding Staff)',
        },
        {
          condition: 'If you dread ambiguity and prefer clear ticket specs with predictable sprint velocities',
          recommendedOption: 'Stay at Tier-1 Tech Company (Promotion Track)',
        },
      ],
      tenTenTen: {
        inTenMinutes:
          'Signing the startup offer will trigger a spike of nervous adrenaline; staying will bring immediate relief wrapped in mild stagnation.',
        inTenMonths:
          'At the startup, you will be exhausted but proud of tangible software shipped to real customers. At Big Tech, you will likely still be navigating the promotion packet review.',
        inTenYears:
          'Looking back, you will remember the intense startup crucible regardless of whether it IPOd or pivoted. Staying in the same seat risks blending into an indistinguishable corporate tenure.',
      },
      cognitiveBiases: [
        {
          biasName: 'Status Quo Bias',
          description:
            'You are treating staying at your current job as a "safe baseline" with zero risk, when in reality staying carries the silent risk of skill obsolescence and missed market timing.',
          reflectionQuestion:
            'If you were currently unemployed today, would you choose Big Tech or the AI Startup offer?',
        },
        {
          biasName: 'Focusing Illusion on Base Pay',
          description:
            'Over-indexing on the monthly paycheck difference ($165k pre-tax) while discounting the value of equity, network equity, and speed of learning.',
          reflectionQuestion:
            'How much would your lifestyle actually suffer with the startup salary, assuming sensible budgeting?',
        },
      ],
      lowStakesTest:
        'Spend this upcoming Saturday writing a 2-page architectural spec for the startup’s flagship problem, then do a 45-minute working session with the founder. If you leave energized, take the role; if you dread the conversation, stay.',
      preMortem: {
        worstCaseScenario:
          'Startup runs out of cash in 14 months after a failed pivot; common equity is wiped out in liquidation.',
        bestCaseScenario:
          'Startup product becomes standard developer tool; valuation grows 15x; you lead a 40-person team and vest $4M+.',
        preventativeStep:
          'Negotiate an extended 7-10 year post-termination exercise window for stock options so you don’t forfeit vested shares if you leave.',
      },
    },
  },
  {
    id: 'decision-buy-vs-rent',
    title: 'Buy a $750k Single-Family Home vs Continue Renting and Investing in S&P 500',
    context:
      '30-something couple with $180k saved for down payment. Current rent is $2,800/mo. Target home mortgage, property taxes, HOA, and maintenance will total roughly $5,200/mo.',
    tag: 'Personal Finance & Life',
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
    options: [
      {
        id: 'opt-buy',
        name: 'Purchase Single-Family Home ($750k)',
        summary:
          'Emotional grounding, locked-in living space, ability to renovate and plant roots, with higher unrecoverable monthly costs and illiquidity.',
        pros: [
          {
            id: 'p-home1',
            text: 'Full sovereignty over living space and customization',
            category: 'Emotional / Well-being',
            impact: 5,
            rationale:
              'No landlord inspections, arbitrary rent hikes, or restrictions on pets and renovations.',
          },
          {
            id: 'p-home2',
            text: 'Forced savings mechanism and leveraged real estate exposure',
            category: 'Financial',
            impact: 4,
            rationale:
              'Each monthly payment pays down principal with 5x leverage ($150k down on $750k asset).',
          },
          {
            id: 'p-home3',
            text: 'Neighborhood stability and long-term community anchoring',
            category: 'Emotional / Well-being',
            impact: 4,
            rationale:
              'Deeper relationships with neighbors, zoned schools, and stable social rhythms.',
          },
        ],
        cons: [
          {
            id: 'c-home1',
            text: '$2,400/mo higher cash outflow and unrecoverable friction costs',
            category: 'Financial',
            impact: 5,
            rationale:
              'Interest, property taxes, insurance, and maintenance are pure consumption costs that don’t build equity.',
          },
          {
            id: 'c-home2',
            text: 'Severe geographic lock-in and high transaction friction',
            category: 'Risk & Uncertainty',
            impact: 4,
            rationale:
              'Selling costs 6-8% in agent commissions and closing fees; moving for career opportunities becomes arduous.',
          },
          {
            id: 'c-home3',
            text: 'Time spent on weekend home maintenance and emergency repairs',
            category: 'Effort & Time',
            impact: 3,
            rationale:
              'HVAC replacements, lawn care, plumbing leaks, and contractor management require dedicated weekends.',
          },
        ],
        swot: {
          strengths: [
            'Fixed-rate hedge against long-term housing inflation',
            'Psychological peace of having a permanent home sanctuary',
          ],
          weaknesses: [
            'Depletes liquid emergency reserves for down payment & closing costs',
            'High concentration of net worth in a single illiquid geographical asset',
          ],
          opportunities: [
            'Refinancing if benchmark interest rates fall 150+ basis points',
            'Building equity appreciation if the metropolitan corridor expands',
          ],
          threats: [
            'Rising property tax assessments and escalating home insurance premiums',
            'Subdued housing appreciation trailing high-yield equities',
          ],
        },
        keyAssumptions: [
          'You plan to reside in this exact home for at least 7 to 10 continuous years.',
          'Household income will remain stable or increase to comfortably support the $5,200/mo carrying cost.',
        ],
      },
      {
        id: 'opt-rent',
        name: 'Rent at $2,800/mo & Aggressively Invest Difference',
        summary:
          'Maximum liquidity, ultimate career mobility, zero maintenance burden, and superior historical investment returns via broad-market index funds.',
        pros: [
          {
            id: 'p-rent1',
            text: 'Preserve $180k liquid capital in compounding broad index funds',
            category: 'Financial',
            impact: 5,
            rationale:
              'Historical returns of S&P 500 (10% annualized) historically outperform unleveraged residential real estate appreciation.',
          },
          {
            id: 'p-rent2',
            text: 'Extreme geographical agility for career or life transitions',
            category: 'Career',
            impact: 4,
            rationale:
              'Can relocate to another city or country with 30 days notice at the end of any lease without capital loss.',
          },
          {
            id: 'p-rent3',
            text: 'Zero unexpected capital expenditure calls',
            category: 'Emotional / Well-being',
            impact: 4,
            rationale:
              'A burst pipe or broken roof is the landlord’s financial problem; your housing costs are strictly capped.',
          },
        ],
        cons: [
          {
            id: 'c-rent1',
            text: 'Vulnerability to landlord termination or rent escalation',
            category: 'Risk & Uncertainty',
            impact: 4,
            rationale:
              'Forced relocations due to lease non-renewals can disrupt family routines.',
          },
          {
            id: 'c-rent2',
            text: 'Inability to alter or modernize interior spaces to taste',
            category: 'Emotional / Well-being',
            impact: 3,
            rationale:
              'Cannot knock down walls, customize kitchen cabinetry, or install permanent outdoor setups.',
          },
        ],
        swot: {
          strengths: [
            'Pristine balance sheet liquidity and flexibility',
            'Predictable monthly expense cap and effortless maintenance',
          ],
          weaknesses: [
            'No physical asset equity accumulation from monthly housing check',
            'Feeling of impermanence in rental decor and furnishings',
          ],
          opportunities: [
            'Seizing lucrative relocation job offers in other tech/finance capitals',
            'Opportunistically purchasing a property later during a buyer’s market slump',
          ],
          threats: [
            'Local rental market inflation outpacing salary growth',
            'Temptation to spend the $2,400 monthly difference rather than disciplined investing',
          ],
        },
        keyAssumptions: [
          'You will actually have the psychological discipline to auto-transfer the $2,400 monthly surplus into index funds.',
          'You are content with rental-grade finishes and space constraints.',
        ],
      },
    ],
    criteria: [
      {
        id: 'crit-wealth',
        name: 'Projected 10-Year Net Worth',
        description: 'Mathematical total asset accumulation accounting for compounding',
        weight: 9,
        scores: [
          {
            optionName: 'Purchase Single-Family Home ($750k)',
            score: 7,
            rationale: 'Solid equity build-down, but drag from transaction and maintenance fees.',
          },
          {
            optionName: 'Rent at $2,800/mo & Aggressively Invest Difference',
            score: 9,
            rationale: '$180k compounding at 9% + $2,400/mo invested creates superior wealth math.',
          },
        ],
      },
      {
        id: 'crit-emotional',
        name: 'Sense of Home, Pride & Sanctuary',
        description: 'Daily emotional fulfillment, nesting, and psychological security',
        weight: 8,
        scores: [
          {
            optionName: 'Purchase Single-Family Home ($750k)',
            score: 10,
            rationale: 'Ownership provides deeply rooted pride of place and autonomy.',
          },
          {
            optionName: 'Rent at $2,800/mo & Aggressively Invest Difference',
            score: 4,
            rationale: 'Rental restrictions and landlord friction create ongoing subtle friction.',
          },
        ],
      },
      {
        id: 'crit-flexibility',
        name: 'Career & Geographical Mobility',
        description: 'Ability to seize opportunities in other markets without penalty',
        weight: 7,
        scores: [
          {
            optionName: 'Purchase Single-Family Home ($750k)',
            score: 3,
            rationale: 'Selling within 3-4 years guarantees a net loss due to transaction costs.',
          },
          {
            optionName: 'Rent at $2,800/mo & Aggressively Invest Difference',
            score: 10,
            rationale: 'Pure agility to move across towns or states seamlessly.',
          },
        ],
      },
      {
        id: 'crit-maintenance',
        name: 'Time Freedom & Low Hassle',
        description: 'Weekends free of hardware store visits and emergency repair calls',
        weight: 6,
        scores: [
          {
            optionName: 'Purchase Single-Family Home ($750k)',
            score: 4,
            rationale: 'Homeownership is an ongoing part-time operational job.',
          },
          {
            optionName: 'Rent at $2,800/mo & Aggressively Invest Difference',
            score: 9,
            rationale: 'One phone call to property management solves every repair.',
          },
        ],
      },
    ],
    ruling: {
      bottomLineVerdict:
        'Continue Renting for the next 18 months, but run a dedicated "Homeownership Simulation" with automated investments.',
      recommendedOptionName: 'Rent at $2,800/mo & Aggressively Invest Difference',
      confidenceLevel: 'Moderate',
      rulingRationale:
        'With mortgage rates above 6.5%, the price-to-rent ratio heavily favors renting. The non-recoverable carrying costs (interest + taxes + maintenance) on a $750k purchase currently exceed your entire $2,800 rent! Unless you are 100% committed to a 10-year residency in this exact neighborhood, renting and investing the difference mathematically wins.',
      ifThenRules: [
        {
          condition: 'If you plan to have children within 24 months and need access to a specific public school district',
          recommendedOption: 'Purchase Single-Family Home ($750k)',
        },
        {
          condition: 'If career opportunities might require relocation within the next 4 years',
          recommendedOption: 'Rent at $2,800/mo & Aggressively Invest Difference',
        },
        {
          condition: 'If you view housing as a lifestyle expense rather than an investment',
          recommendedOption: 'Purchase Single-Family Home ($750k)',
        },
      ],
      tenTenTen: {
        inTenMinutes:
          'Deciding to buy brings immense excitement and pride; deciding to rent brings financial calm and zero closing-cost anxiety.',
        inTenMonths:
          'As a buyer, you will be deep in furniture purchases and property tax bills. As a renter, your investment portfolio will have grown significantly with zero plumbing headaches.',
        inTenYears:
          'If you bought, you have a paid-down home in a mature neighborhood. If you rented and diligently invested, you likely possess more liquid financial freedom to buy wherever you want in cash.',
      },
      cognitiveBiases: [
        {
          biasName: 'The "Renting is Throwing Away Money" Myth',
          description:
            'Ignoring the reality that buying a home involves massive "thrown away" non-recoverable money: mortgage interest, property taxes, HOA dues, closing costs, and insurance.',
          reflectionQuestion:
            'Did you know that over the first 5 years of a 30-year mortgage, ~80% of every payment is purely thrown away to the bank as interest and taxes?',
        },
      ],
      lowStakesTest:
        'Set up an automatic recurring transfer of $2,400/month (the exact difference between renting and buying) into a high-yield brokerage account for 6 months. If your lifestyle thrives without noticing the missing cash, you are ready to buy. If it feels painful, you saved yourself from a mortgage trap.',
      preMortem: {
        worstCaseScenario:
          'You buy, realize within 18 months that you hate the commute or the neighborhood, and are forced to sell at a 7% loss after fees.',
        bestCaseScenario:
          'You buy, refinance at lower rates in year 3, neighborhood thrives, and home becomes the emotional cornerstone of your family.',
        preventativeStep:
          'Rent an Airbnb in the target neighborhood for 2 full weeks before making any purchase offer to experience the real commute and noise.',
      },
    },
  },
];
