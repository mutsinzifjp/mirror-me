/**
 * Emotional Intelligence Engine
 * Extracts deep meaning from incomplete, short, or emotionally charged responses
 * Prioritizes emotional insight over grammatical perfection
 */

class EmotionalIntelligenceEngine {
  constructor() {
    // Emotional keyword patterns with intensity weights
    this.emotionalPatterns = {
      joy: {
        keywords: ['happy', 'joy', 'good', 'love', 'smile', 'laugh', 'great', 'amazing', 'wonderful', 'excited', 'glad', '😊', '😄', '❤️', '💕'],
        intensity: { high: ['amazing', 'incredible', 'ecstatic'], medium: ['happy', 'good', 'glad'], low: ['ok', 'fine'] }
      },
      sadness: {
        keywords: ['sad', 'cry', 'hurt', 'pain', 'lonely', 'empty', 'lost', 'miss', 'grief', 'broken', 'tears', '😢', '💔', '😭'],
        intensity: { high: ['devastated', 'broken', 'shattered'], medium: ['sad', 'hurt', 'lonely'], low: ['down', 'blue'] }
      },
      anger: {
        keywords: ['angry', 'mad', 'rage', 'hate', 'furious', 'pissed', 'annoyed', 'frustrated', 'irritated', '😡', '🤬'],
        intensity: { high: ['furious', 'rage', 'livid'], medium: ['angry', 'mad', 'pissed'], low: ['annoyed', 'irritated'] }
      },
      fear: {
        keywords: ['scared', 'afraid', 'fear', 'anxious', 'worry', 'nervous', 'panic', 'terrified', 'frightened', '😨', '😰'],
        intensity: { high: ['terrified', 'panic', 'petrified'], medium: ['scared', 'afraid', 'anxious'], low: ['nervous', 'worried'] }
      },
      shame: {
        keywords: ['ashamed', 'guilty', 'embarrassed', 'stupid', 'worthless', 'failure', 'mistake', 'regret', 'sorry'],
        intensity: { high: ['worthless', 'pathetic', 'disgusting'], medium: ['ashamed', 'guilty', 'embarrassed'], low: ['sorry', 'regret'] }
      },
      confusion: {
        keywords: ['confused', 'lost', 'dont know', "don't know", 'unclear', 'mixed up', 'unsure', '???', '🤔'],
        intensity: { high: ['completely lost', 'no idea'], medium: ['confused', 'unsure'], low: ['not sure', 'maybe'] }
      }
    };

    // Relational patterns
    this.relationalPatterns = {
      connection: ['close', 'together', 'understand', 'listen', 'care', 'support', 'there for', 'connected'],
      isolation: ['alone', 'lonely', 'abandoned', 'rejected', 'ignored', 'left out', 'nobody', 'isolated'],
      conflict: ['fight', 'argue', 'disagree', 'tension', 'clash', 'yell', 'angry at', 'hate'],
      intimacy: ['trust', 'share', 'open', 'vulnerable', 'honest', 'real', 'authentic', 'deep']
    };

    // Self-awareness indicators
    this.selfAwarenessPatterns = {
      insight: ['realize', 'understand', 'see now', 'learned', 'discovered', 'noticed', 'aware'],
      growth: ['change', 'better', 'improve', 'grow', 'evolve', 'develop', 'progress'],
      acceptance: ['accept', 'ok with', 'peace', 'embrace', 'forgive', 'let go'],
      resistance: ['cant', "can't", 'wont', "won't", 'refuse', 'never', 'impossible', 'stuck']
    };
  }

  /**
   * Main analysis function - extracts deep meaning from any response
   */
  analyzeResponse(text, metadata = {}) {
    if (!text || text.trim().length === 0) {
      return this.interpretSilence(metadata);
    }

    const cleanText = this.cleanAndNormalize(text);
    
    return {
      emotional: this.extractEmotionalContent(cleanText),
      relational: this.extractRelationalContent(cleanText),
      selfAwareness: this.extractSelfAwarenessContent(cleanText),
      meaningfulPhrases: this.extractMeaningfulPhrases(cleanText),
      behavioralSignals: this.analyzeBehavioralSignals(text, metadata),
      readabilityAdaptation: this.suggestReadabilityLevel(cleanText),
      encouragement: this.generateEncouragement(cleanText),
      rawInsight: cleanText.length < 50 ? this.interpretShortResponse(cleanText) : null
    };
  }

  /**
   * Clean and normalize text while preserving emotional markers
   */
  cleanAndNormalize(text) {
    // Preserve emojis and emotional punctuation
    let cleaned = text.toLowerCase()
      .replace(/[^\w\s😊😄❤️💕😢💔😭😡🤬😨😰🤔.,!?]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Handle common misspellings and abbreviations
    const corrections = {
      'ur': 'your', 'u': 'you', 'im': 'i am', 'dont': 'don\'t',
      'cant': 'can\'t', 'wont': 'won\'t', 'gonna': 'going to',
      'dunno': 'don\'t know', 'kinda': 'kind of', 'sorta': 'sort of'
    };
    
    Object.entries(corrections).forEach(([wrong, right]) => {
      cleaned = cleaned.replace(new RegExp(`\\b${wrong}\\b`, 'g'), right);
    });
    
    return cleaned;
  }

  /**
   * Extract emotional content with intensity and context
   */
  extractEmotionalContent(text) {
    const emotions = {};
    let dominantEmotion = null;
    let maxScore = 0;

    Object.entries(this.emotionalPatterns).forEach(([emotion, pattern]) => {
      let score = 0;
      let intensity = 'low';
      let triggers = [];

      pattern.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          triggers.push(keyword);
          score += 1;
          
          // Check intensity
          Object.entries(pattern.intensity || {}).forEach(([level, words]) => {
            if (words.includes(keyword)) {
              intensity = level;
              score += level === 'high' ? 3 : level === 'medium' ? 2 : 1;
            }
          });
        }
      });

      if (score > 0) {
        emotions[emotion] = { score, intensity, triggers };
        if (score > maxScore) {
          maxScore = score;
          dominantEmotion = emotion;
        }
      }
    });

    return {
      emotions,
      dominantEmotion,
      emotionalIntensity: maxScore > 5 ? 'high' : maxScore > 2 ? 'medium' : 'low',
      isEmotionallyCharged: maxScore > 3
    };
  }

  /**
   * Extract relational themes and patterns
   */
  extractRelationalContent(text) {
    const themes = {};
    
    Object.entries(this.relationalPatterns).forEach(([theme, keywords]) => {
      const matches = keywords.filter(keyword => text.includes(keyword));
      if (matches.length > 0) {
        themes[theme] = { strength: matches.length, keywords: matches };
      }
    });

    return {
      themes,
      relationshipFocus: Object.keys(themes).length > 0,
      connectionPattern: this.identifyConnectionPattern(themes)
    };
  }

  /**
   * Extract self-awareness indicators
   */
  extractSelfAwarenessContent(text) {
    const patterns = {};
    
    Object.entries(this.selfAwarenessPatterns).forEach(([pattern, keywords]) => {
      const matches = keywords.filter(keyword => text.includes(keyword));
      if (matches.length > 0) {
        patterns[pattern] = { strength: matches.length, keywords: matches };
      }
    });

    return {
      patterns,
      awarenessLevel: this.calculateAwarenessLevel(patterns),
      growthOrientation: patterns.growth || patterns.insight ? 'high' : 'medium'
    };
  }

  /**
   * Extract meaningful phrases even from broken text
   */
  extractMeaningfulPhrases(text) {
    // Look for meaningful sentence fragments
    const meaningfulPhrases = [];
    
    // Split by common separators but preserve meaning
    const fragments = text.split(/[.!?;,\n]/)
      .map(f => f.trim())
      .filter(f => f.length > 0);

    fragments.forEach(fragment => {
      if (this.isMeaningfulFragment(fragment)) {
        meaningfulPhrases.push({
          text: fragment,
          emotional: this.extractEmotionalContent(fragment).dominantEmotion,
          theme: this.identifyFragmentTheme(fragment)
        });
      }
    });

    return meaningfulPhrases;
  }

  /**
   * Analyze behavioral signals from response pattern
   */
  analyzeBehavioralSignals(text, metadata) {
    const signals = {
      responseLength: text.length,
      hesitation: metadata.timeTaken > 30000, // More than 30 seconds
      avoidance: text.length < 10 && !this.hasEmotionalMarkers(text),
      overwhelm: text.length > 500,
      repetition: this.detectRepetition(text),
      urgency: this.detectUrgency(text)
    };

    return {
      ...signals,
      interpretation: this.interpretBehavioralPattern(signals)
    };
  }

  /**
   * Interpret silence or very short responses meaningfully
   */
  interpretSilence(metadata) {
    return {
      type: 'silence',
      possibleMeanings: [
        'Processing deeply',
        'Feeling overwhelmed',
        'Protecting privacy',
        'Unsure how to express',
        'Taking time to reflect'
      ],
      supportiveResponse: 'Your silence speaks too. Sometimes the deepest truths need time.',
      suggestion: 'Try: "I feel..." or "Right now I..." or even just an emoji 💭'
    };
  }

  /**
   * Interpret very short responses
   */
  interpretShortResponse(text) {
    if (text.length < 5) {
      // Single words or very short
      return {
        type: 'minimal',
        possibleMeanings: this.expandSingleWord(text),
        supportiveResponse: `"${text}" - sometimes one word holds everything.`,
        invitation: 'If you want to share more, I\'m listening. If not, this is enough.'
      };
    }
    
    return {
      type: 'concise',
      appreciation: 'Brief and honest - that takes courage.',
      expansion: this.suggestGentleExpansion(text)
    };
  }

  /**
   * Generate appropriate encouragement based on response
   */
  generateEncouragement(text) {
    const emotional = this.extractEmotionalContent(text);
    
    if (emotional.dominantEmotion === 'sadness') {
      return 'Your feelings matter. Thank you for sharing something so real.';
    } else if (emotional.dominantEmotion === 'anger') {
      return 'Your anger makes sense. There\'s wisdom in what frustrates you.';
    } else if (emotional.dominantEmotion === 'fear') {
      return 'Courage isn\'t fearlessness - it\'s sharing despite the fear.';
    } else if (emotional.dominantEmotion === 'confusion') {
      return 'Not knowing is honest. Confusion often comes before clarity.';
    } else if (emotional.dominantEmotion === 'joy') {
      return 'Your joy is beautiful. Thank you for sharing what lights you up.';
    }
    
    return 'Thank you for your honesty. Every word matters.';
  }

  /**
   * Helper methods
   */
  isMeaningfulFragment(fragment) {
    return fragment.length > 3 && 
           (this.hasEmotionalMarkers(fragment) || 
            this.hasRelationalMarkers(fragment) ||
            fragment.split(' ').length > 1);
  }

  hasEmotionalMarkers(text) {
    return Object.values(this.emotionalPatterns)
      .some(pattern => pattern.keywords.some(keyword => text.includes(keyword)));
  }

  hasRelationalMarkers(text) {
    return Object.values(this.relationalPatterns)
      .some(keywords => keywords.some(keyword => text.includes(keyword)));
  }

  identifyFragmentTheme(fragment) {
    if (this.hasEmotionalMarkers(fragment)) return 'emotional';
    if (this.hasRelationalMarkers(fragment)) return 'relational';
    if (fragment.includes('i ') || fragment.includes('my ')) return 'personal';
    return 'descriptive';
  }

  detectRepetition(text) {
    const words = text.split(' ');
    const wordCounts = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    return Object.values(wordCounts).some(count => count > 2);
  }

  detectUrgency(text) {
    const urgencyMarkers = ['!!!', 'really', 'very', 'so much', 'always', 'never', 'need to', 'have to'];
    return urgencyMarkers.some(marker => text.includes(marker));
  }

  expandSingleWord(word) {
    const expansions = {
      'no': ['Feeling resistant', 'Setting a boundary', 'Protecting yourself', 'Feeling overwhelmed'],
      'yes': ['Feeling open', 'Ready to engage', 'Feeling positive', 'Agreeing genuinely'],
      'maybe': ['Feeling uncertain', 'Need more time', 'Partially ready', 'Mixed feelings'],
      'sad': ['Feeling tender', 'Processing loss', 'Needing comfort', 'Feeling heavy'],
      'angry': ['Feeling frustrated', 'Sensing injustice', 'Needing boundaries', 'Feeling unheard'],
      'scared': ['Feeling vulnerable', 'Sensing danger', 'Needing safety', 'Feeling uncertain'],
      'happy': ['Feeling light', 'Experiencing joy', 'Feeling grateful', 'Feeling connected']
    };
    
    return expansions[word.toLowerCase()] || ['Having a human experience', 'Feeling something real'];
  }

  suggestGentleExpansion(text) {
    return [
      `Tell me more about "${text}"`,
      'What does that feel like in your body?',
      'If that had a color, what would it be?',
      'What would you want someone to know about this?'
    ];
  }

  identifyConnectionPattern(themes) {
    if (themes.isolation && themes.connection) return 'conflicted';
    if (themes.isolation) return 'disconnected';
    if (themes.connection || themes.intimacy) return 'connected';
    if (themes.conflict) return 'challenging';
    return 'neutral';
  }

  calculateAwarenessLevel(patterns) {
    const total = Object.values(patterns).reduce((sum, p) => sum + p.strength, 0);
    return total > 3 ? 'high' : total > 1 ? 'medium' : 'low';
  }

  interpretBehavioralPattern(signals) {
    if (signals.avoidance && signals.hesitation) {
      return 'protective - taking care of emotional safety';
    } else if (signals.overwhelm) {
      return 'processing deeply - big feelings need space';
    } else if (signals.urgency && signals.repetition) {
      return 'emotionally activated - something important is stirring';
    } else if (signals.responseLength < 20) {
      return 'conserving energy - being selective with words';
    }
    return 'engaged and thoughtful';
  }

  suggestReadabilityLevel(text) {
    // Analyze user's language complexity to mirror appropriate level
    const avgWordLength = text.split(' ').reduce((sum, word) => sum + word.length, 0) / text.split(' ').length;
    const sentenceCount = (text.match(/[.!?]+/g) || []).length;
    
    if (avgWordLength < 4 || sentenceCount === 0) {
      return 'grade3'; // Very simple language
    } else if (avgWordLength < 5) {
      return 'grade5'; // Simple language
    } else {
      return 'grade6'; // Standard simple language
    }
  }

  /**
   * Synthesize emotional journey from multiple response analyses
   * Creates a comprehensive picture of the user's emotional progression
   */
  synthesizeEmotionalJourney(analyses) {
    if (!analyses || analyses.length === 0) {
      return {
        overallState: 'neutral',
        emotionalRange: ['balanced'],
        progressionPattern: 'stable',
        insights: ['Thank you for sharing your thoughts with us.'],
        supportRecommendations: []
      };
    }

    // Extract emotional states
    const emotionalStates = analyses
      .filter(a => a && a.emotionalState)
      .map(a => a.emotionalState);

    // Calculate emotional range
    const emotionTypes = emotionalStates.map(s => s.dominant);
    const uniqueEmotions = [...new Set(emotionTypes)];
    
    // Determine intensity progression
    const intensities = emotionalStates.map(s => s.intensity || 3);
    const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    
    // Identify progression pattern
    let progressionPattern = 'stable';
    if (intensities.length > 2) {
      const first = intensities.slice(0, Math.floor(intensities.length / 2));
      const last = intensities.slice(Math.floor(intensities.length / 2));
      const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
      const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
      
      if (lastAvg > firstAvg + 0.5) progressionPattern = 'building';
      else if (lastAvg < firstAvg - 0.5) progressionPattern = 'releasing';
    }

    // Generate comprehensive insights
    const insights = [];
    
    if (uniqueEmotions.length === 1) {
      insights.push(`Your responses show emotional consistency around ${uniqueEmotions[0]}.`);
    } else if (uniqueEmotions.length <= 3) {
      insights.push(`You expressed a focused range of emotions: ${uniqueEmotions.join(', ')}.`);
    } else {
      insights.push(`You shared a rich emotional spectrum, showing depth and authenticity.`);
    }

    if (avgIntensity >= 4) {
      insights.push('Your responses show strong emotional engagement with these questions.');
    } else if (avgIntensity <= 2) {
      insights.push('Your thoughtful, measured responses reflect careful consideration.');
    }

    if (progressionPattern === 'building') {
      insights.push('Your emotional expression deepened as you progressed through the assessment.');
    } else if (progressionPattern === 'releasing') {
      insights.push('You seemed to find more ease and calm as the assessment continued.');
    }

    // Support recommendations
    const supportRecommendations = [];
    
    if (uniqueEmotions.includes('sadness') || uniqueEmotions.includes('fear')) {
      supportRecommendations.push('Consider sharing these reflections with someone you trust.');
    }
    
    if (uniqueEmotions.includes('confusion')) {
      supportRecommendations.push('Remember that confusion often precedes clarity and growth.');
    }
    
    if (avgIntensity >= 4) {
      supportRecommendations.push('Take time to process these intense emotions gently.');
    }

    return {
      overallState: this.determineOverallState(emotionalStates),
      emotionalRange: uniqueEmotions,
      progressionPattern,
      insights,
      supportRecommendations,
      metadata: {
        totalResponses: analyses.length,
        averageIntensity: Math.round(avgIntensity * 10) / 10,
        emotionalDiversity: uniqueEmotions.length,
        responseTypes: analyses.map(a => a.responseType || 'text')
      }
    };
  }

  /**
   * Determine overall emotional state from multiple states
   */
  determineOverallState(emotionalStates) {
    if (!emotionalStates || emotionalStates.length === 0) return 'neutral';
    
    // Weight by intensity
    const weightedEmotions = {};
    emotionalStates.forEach(state => {
      const emotion = state.dominant;
      const weight = state.intensity || 3;
      weightedEmotions[emotion] = (weightedEmotions[emotion] || 0) + weight;
    });

    // Find dominant weighted emotion
    const dominantEmotion = Object.keys(weightedEmotions).reduce((a, b) => 
      weightedEmotions[a] > weightedEmotions[b] ? a : b
    );

    return dominantEmotion;
  }
}

export default EmotionalIntelligenceEngine;
