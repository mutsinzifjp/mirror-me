// Advanced multi-theoretical framework for self-discovery
// Moving beyond superficial adjectives to deep inquiry questions

export const theoreticalFrameworks = {
  johari: {
    name: "Johari Window",
    philosopher: "Joseph Luft & Harry Ingham",
    description: "Explores the relationship between self-knowledge and social awareness through four quadrants of known and unknown aspects of self.",
    insight: "The goal is not to eliminate all blind spots or hidden areas, but to increase the open arena where authentic relationship can flourish.",
    quadrants: ["Arena", "Blind Spot", "Façade", "Unknown"],
    purpose: "Understanding the dynamics between what we know and what others perceive"
  },
  
  buber: {
    name: "I-Thou Relationship",
    philosopher: "Martin Buber", 
    description: "The quality of encounter between self and other as fundamental to authentic identity formation and genuine meeting.",
    insight: "You become who you are through authentic encounter with others. Your identity is not fixed but emerges in the sacred space between I and Thou.",
    dimensions: ["I-Thou (authentic encounter)", "I-It (objectified relating)", "Genuine Meeting", "Mutual Recognition"],
    purpose: "Exploring how authentic relationship shapes who we become"
  },
  
  lacan: {
    name: "Mirror Stage Theory",
    philosopher: "Jacques Lacan",
    description: "How we form identity through reflection and external recognition, exploring the relationship between self-image and social mirroring.",
    insight: "The self is always already relational - formed through the gaze and recognition of others. Identity exists in the gap between how we see ourselves and how we are seen.",
    stages: ["Imaginary Self", "Symbolic Recognition", "Real Self", "Unconscious Structures"],
    purpose: "Understanding how external reflection shapes internal identity"
  },
  
  existential: {
    name: "Existential Perspective",
    philosopher: "Various Existentialist Thinkers",
    description: "Your identity is not a fixed entity but an ongoing project of becoming, shaped by your choices, relationships, and the meaning you create.",
    insight: "You are fundamentally free to create yourself through your choices and responses to life's situations.",
    dimensions: ["Freedom", "Responsibility", "Authenticity", "Meaning-Making"],
    purpose: "Understanding identity as an ongoing creative process"
  },
  
  disc_leadership: {
    name: "DISC Behavioral Styles",
    philosopher: "William Moulton Marston",
    description: "How we naturally respond to challenges, influence, stability, and compliance",
    insight: "Behavioral preferences are tools for understanding communication patterns, not fixed limitations on who you can become.",
    dimensions: ["Dominance", "Influence", "Steadiness", "Conscientiousness"],
    purpose: "Understanding behavioral preferences and communication styles"
  }
};

// Deep inquiry questions that reveal authentic human complexity
export const reflectionQuestions = {
  relational_contexts: {
    name: "How You Relate",
    subtitle: "Your patterns of connection across different relationships",
    description: "These questions explore how your authentic self emerges through various forms of human connection.",
    framework: "buber",
    questions: [
      {
        id: "conflict_response",
        question: "When someone you care about is upset with you, what do you find yourself doing first?",
        context: "This reveals your instinctive patterns in vulnerable moments",
        reflection: "Notice not what you think you should do, but what you actually find yourself doing"
      },
      {
        id: "support_offering",
        question: "Describe a recent time when someone was struggling. How did you show up for them?",
        context: "This shows your natural way of caring for others",
        reflection: "Consider what felt most authentic about your response"
      },
      {
        id: "boundary_expression",
        question: "Think of a situation where you felt your boundaries were crossed. How did you respond, and what did you learn about yourself?",
        context: "This reveals how you protect and honor yourself in relationship",
        reflection: "What does this tell you about your relationship with your own needs?"
      },
      {
        id: "authentic_moments",
        question: "Describe a moment when you felt most authentically yourself with another person. What made that possible?",
        context: "This illuminates the conditions where your true self emerges",
        reflection: "What elements of safety, acceptance, or understanding were present?"
      }
    ]
  },

  philosophical_orientations: {
    name: "Your Inner Compass", 
    subtitle: "How you navigate meaning, purpose, and life's deeper questions",
    description: "These questions explore your relationship with meaning, suffering, and what matters most to you.",
    framework: "existential",
    questions: [
      {
        id: "meaning_source",
        question: "When you feel most alive and purposeful, what are you usually doing or experiencing?",
        context: "This reveals what genuinely energizes and fulfills you",
        reflection: "Notice the quality of aliveness, not just the activity itself"
      },
      {
        id: "difficulty_response",
        question: "Describe how you've grown from a difficult experience. What did it teach you about yourself?",
        context: "This shows your relationship with suffering and growth",
        reflection: "How do you transform challenges into wisdom?"
      },
      {
        id: "legacy_vision",
        question: "If someone were describing the impact you've had on their life, what would you hope they'd say?",
        context: "This reveals your deeper values and desired contribution",
        reflection: "What kind of difference do you want to make in the world?"
      },
      {
        id: "moral_compass",
        question: "Describe a time when you had to choose between what was easy and what felt right. What guided your decision?",
        context: "This illuminates your ethical foundation and decision-making process",
        reflection: "What principles emerge when you're tested?"
      }
    ]
  },

  unconscious_patterns: {
    name: "Hidden Patterns",
    subtitle: "The aspects of yourself that operate below conscious awareness",
    description: "These questions invite you to explore patterns that others might notice more easily than you do.",
    framework: "lacan", 
    questions: [
      {
        id: "stress_patterns",
        question: "When you're under pressure, what do people around you start to notice? What behaviors emerge that you might not be fully aware of?",
        context: "This reveals your unconscious coping strategies",
        reflection: "How do you protect yourself when feeling vulnerable?"
      },
      {
        id: "repeated_feedback",
        question: "What feedback do you keep receiving from different people in your life? What patterns do they point out?",
        context: "This shows your impact on others that you might not fully see",
        reflection: "What might this feedback be telling you about your unconscious influence?"
      },
      {
        id: "energy_shifts",
        question: "In what situations do you notice your energy dramatically shift - either becoming more alive or more withdrawn?",
        context: "This reveals unconscious triggers and sources of vitality",
        reflection: "What environments or interactions activate different aspects of who you are?"
      },
      {
        id: "unexpressed_aspects",
        question: "What part of yourself do you feel hasn't been fully seen or expressed in your current relationships or roles?",
        context: "This illuminates hidden potentials and suppressed aspects",
        reflection: "What wants to emerge in you that hasn't found its place yet?"
      }
    ]
  }
};

// Questions for others to answer about you (for the feedback portal)
export const feedbackQuestions = {
  relational_perspective: [
    {
      id: "support_style",
      question: "How does this person show up when you need support?",
      context: "Think about their natural way of caring and being present",
      placeholder: "Describe how they offer support..."
    },
    {
      id: "conflict_pattern", 
      question: "How do they handle disagreement or tension?",
      context: "Consider their approach to difficult conversations",
      placeholder: "Share what you've observed..."
    },
    {
      id: "authentic_moments",
      question: "When have you seen them most authentically themselves?", 
      context: "Describe a moment when their true self really shone through",
      placeholder: "Tell about a specific moment..."
    }
  ],
  
  impact_awareness: [
    {
      id: "positive_impact",
      question: "What positive impact has this person had on you or others?",
      context: "How do they contribute to the lives of people around them?",
      placeholder: "Describe their positive influence..."
    },
    {
      id: "unconscious_influence",
      question: "What do they do that they might not realize affects others?",
      context: "Consider both positive influences and potential blind spots",
      placeholder: "Share what you notice that they might not see..."
    },
    {
      id: "unique_qualities",
      question: "What makes this person unique in your experience?",
      context: "What sets them apart from others you know?",
      placeholder: "Describe what makes them special..."
    }
  ]
};

// Legacy compatibility for existing components
export const contextualTraits = reflectionQuestions;

// Philosophical disclaimer
export const philosophicalDisclaimer = {
  title: "On the Limits of Frameworks",
  text: `No framework, however sophisticated, can capture the full complexity of a human being. 
    You are unique—a dynamic, ever-changing constellation of experiences, relationships, 
    and potentials that cannot be reduced to categories or measurements.
    
    This tool offers one lens among many for self-exploration. Use it as an invitation 
    to deeper self-inquiry, not as a definitive statement about who you are. 
    
    The most profound self-knowledge often emerges not from analysis, but from 
    authentic encounter—with yourself, with others, and with life itself.`
};

// Helper functions
export const getAllQuestions = () => {
  const allQuestions = [];
  Object.values(reflectionQuestions).forEach(section => {
    if (section.questions) {
      allQuestions.push(...section.questions);
    }
  });
  return allQuestions;
};

export const getAllFeedbackQuestions = () => {
  const allQuestions = [];
  Object.values(feedbackQuestions).forEach(section => {
    allQuestions.push(...section);
  });
  return allQuestions;
};

export default getAllQuestions;
