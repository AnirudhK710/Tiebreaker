import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for schema generation
const decisionAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    optionsAnalysis: {
      type: Type.ARRAY,
      description: 'Analysis for each option provided',
      items: {
        type: Type.OBJECT,
        properties: {
          optionName: { type: Type.STRING },
          summary: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                category: { 
                  type: Type.STRING, 
                  description: 'One of: Financial, Career, Emotional / Well-being, Effort & Time, Risk & Uncertainty, Other' 
                },
                impact: { 
                  type: Type.INTEGER, 
                  description: 'Impact score from 1 (minor upside) to 5 (transformative upside)' 
                },
                rationale: { type: Type.STRING, description: 'Deep reasoning behind why this pro matters' },
              },
              required: ['text', 'category', 'impact', 'rationale'],
            },
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                category: { 
                  type: Type.STRING, 
                  description: 'One of: Financial, Career, Emotional / Well-being, Effort & Time, Risk & Uncertainty, Other' 
                },
                impact: { 
                  type: Type.INTEGER, 
                  description: 'Severity score from 1 (mild nuisance) to 5 (dealbreaker/high risk)' 
                },
                rationale: { type: Type.STRING, description: 'Deep reasoning behind why this con is a hazard' },
              },
              required: ['text', 'category', 'impact', 'rationale'],
            },
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
          },
          keyAssumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Crucial hidden assumptions that this choice relies on',
          },
        },
        required: ['optionName', 'summary', 'pros', 'cons', 'swot', 'keyAssumptions'],
      },
    },
    criteria: {
      type: Type.ARRAY,
      description: '5-7 rigorous multi-criteria decision analysis factors',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'e.g. Financial Upside, Peace of Mind, Flexibility' },
          description: { type: Type.STRING, description: 'Why this criterion is pivotal to this decision' },
          defaultWeight: { type: Type.INTEGER, description: 'Importance weight from 1 to 10' },
          scores: {
            type: Type.ARRAY,
            description: 'Scores for each option on this criterion',
            items: {
              type: Type.OBJECT,
              properties: {
                optionName: { type: Type.STRING },
                score: { type: Type.INTEGER, description: 'Score from 1 to 10 for this option' },
                rationale: { type: Type.STRING, description: 'Short justification for the score' },
              },
              required: ['optionName', 'score', 'rationale'],
            },
          },
        },
        required: ['name', 'description', 'defaultWeight', 'scores'],
      },
    },
    ruling: {
      type: Type.OBJECT,
      description: 'The Tiebreaker final verdict and strategic frameworks',
      properties: {
        bottomLineVerdict: { type: Type.STRING, description: 'Decisive, clear, executive summary ruling' },
        recommendedOptionName: { type: Type.STRING, description: 'The leading option according to objective analysis' },
        confidenceLevel: { 
          type: Type.STRING, 
          description: 'High, Moderate, or Close Call' 
        },
        rulingRationale: { type: Type.STRING, description: 'Nuanced breakdown of trade-offs and core why' },
        ifThenRules: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              condition: { type: Type.STRING, description: 'e.g., If you value immediate financial security over long-term autonomy' },
              recommendedOption: { type: Type.STRING },
            },
            required: ['condition', 'recommendedOption'],
          },
        },
        tenTenTen: {
          type: Type.OBJECT,
          description: 'The Suzy Welch 10/10/10 rule analysis',
          properties: {
            inTenMinutes: { type: Type.STRING, description: 'Immediate emotional reaction / relief' },
            inTenMonths: { type: Type.STRING, description: 'Medium term execution reality' },
            inTenYears: { type: Type.STRING, description: 'Long term legacy and regret minimization' },
          },
          required: ['inTenMinutes', 'inTenMonths', 'inTenYears'],
        },
        cognitiveBiases: {
          type: Type.ARRAY,
          description: 'Blind spots detected in this decision',
          items: {
            type: Type.OBJECT,
            properties: {
              biasName: { type: Type.STRING, description: 'e.g. Sunk Cost Fallacy, Status Quo Bias, Loss Aversion, Focusing Illusion' },
              description: { type: Type.STRING, description: 'How this bias specifically threatens this user decision' },
              reflectionQuestion: { type: Type.STRING, description: 'A question to disarm the bias' },
            },
            required: ['biasName', 'description', 'reflectionQuestion'],
          },
        },
        lowStakesTest: {
          type: Type.STRING,
          description: 'An actionable 48-hour experiment or pre-commitment test to gather concrete signal before deciding',
        },
        preMortem: {
          type: Type.OBJECT,
          properties: {
            worstCaseScenario: { type: Type.STRING, description: 'If the chosen path failed catastrophically in 2 years, what was the cause?' },
            bestCaseScenario: { type: Type.STRING, description: 'If this turned into the best decision of your decade, what sparked it?' },
            preventativeStep: { type: Type.STRING, description: 'Concrete step to mitigate the worst-case right now' },
          },
          required: ['worstCaseScenario', 'bestCaseScenario', 'preventativeStep'],
        },
      },
      required: [
        'bottomLineVerdict',
        'recommendedOptionName',
        'confidenceLevel',
        'rulingRationale',
        'ifThenRules',
        'tenTenTen',
        'cognitiveBiases',
        'lowStakesTest',
        'preMortem',
      ],
    },
  },
  required: ['optionsAnalysis', 'criteria', 'ruling'],
};

// 1. Analyze Decision Endpoint
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { title, context, options, customCriteria } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Please provide a decision title and at least 2 options to compare.',
      });
    }

    const optionsList = options.map((opt: string, idx: number) => `Option ${idx + 1}: "${opt}"`).join('\n');
    const criteriaHint = customCriteria && customCriteria.length > 0
      ? `Specific user-requested evaluation criteria:\n${customCriteria.join(', ')}\n`
      : '';

    const prompt = `You are "The Tiebreaker", an elite decision scientist and strategic counsel.
Analyze the following high-stakes decision with rigorous intellectual honesty, depth, and practical clarity.

DECISION TITLE:
"${title}"

CONTEXT & CONSTRAINTS:
"${context || 'No specific background provided by user. Infer likely practical, financial, emotional, and long-term implications.'}"

OPTIONS UNDER CONSIDERATION:
${optionsList}

${criteriaHint}

INSTRUCTIONS:
1. Provide a comprehensive, non-superficial Pros & Cons analysis for EACH option. Include realistic impact ratings (1 to 5) and categories.
2. Provide a full SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for EACH option.
3. Formulate a multi-criteria comparison matrix containing 5 to 7 key criteria. Rate each option 1-10 on each criterion with sharp, distinct rationales.
4. Deliver "The Ruling" - a decisive verdict that does not waffle, but clearly lays out "If you prioritize X, pick A; If you prioritize Y, pick B" rules, applies the 10/10/10 rule, flags cognitive biases (like Status Quo bias or Sunk Cost), and provides a 48-hour low-stakes test.
Ensure every option in the output matches the exact provided option names.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: decisionAnalysisSchema,
        temperature: 0.7,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('No response returned from decision analysis engine.');
    }

    const parsedData = JSON.parse(rawText);
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing decision:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

// 2. Suggest Options & Criteria from a question or vague prompt
app.post('/api/suggest-options', async (req, res) => {
  try {
    const { dilemma } = req.body;
    if (!dilemma || typeof dilemma !== 'string') {
      return res.status(400).json({ error: 'Please provide a dilemma or decision dilemma.' });
    }

    const prompt = `A user needs help making this decision: "${dilemma}".
Please propose:
1. A refined, crisp decision title.
2. 2 to 4 distinct, well-contrasted, mutually exclusive strategic options (e.g. not just Yes/No, but nuanced alternatives).
3. 4 to 6 crucial decision criteria they should evaluate (e.g. "Work-Life Balance", "Financial Upside", "Exit Difficulty").
4. A 1-2 sentence context summary defining what makes this decision tough.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedTitle: { type: Type.STRING },
            contextSummary: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedCriteria: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['refinedTitle', 'contextSummary', 'options', 'suggestedCriteria'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error('No suggestions returned');
    return res.json({ success: true, data: JSON.parse(rawText) });
  } catch (error: any) {
    console.error('Error suggesting options:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to suggest options.',
    });
  }
});

// 3. Brainstorm additional hidden pros & cons or devil's advocate points
app.post('/api/brainstorm-factors', async (req, res) => {
  try {
    const { title, optionName, existingFactors } = req.body;
    const prompt = `Decision: "${title}"
Specific Option: "${optionName}"
Existing points already considered:
${(existingFactors || []).join('\n')}

Identify 3 unconventional, non-obvious hidden PROS and 3 hidden CONS/RISKS that people commonly overlook when choosing this path (e.g., hidden emotional tolls, second-order consequences, opportunity costs, reversibility friction).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hiddenPros: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.INTEGER },
                  rationale: { type: Type.STRING },
                },
                required: ['text', 'category', 'impact', 'rationale'],
              },
            },
            hiddenCons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impact: { type: Type.INTEGER },
                  rationale: { type: Type.STRING },
                },
                required: ['text', 'category', 'impact', 'rationale'],
              },
            },
          },
          required: ['hiddenPros', 'hiddenCons'],
        },
      },
    });

    const raw = response.text;
    return res.json({ success: true, data: JSON.parse(raw || '{}') });
  } catch (error: any) {
    console.error('Error brainstorming factors:', error);
    return res.status(500).json({ error: error?.message || 'Failed to brainstorm factors.' });
  }
});

// Vite Middleware for development vs static build for production
if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`The Tiebreaker server running on http://0.0.0.0:${PORT}`);
});
