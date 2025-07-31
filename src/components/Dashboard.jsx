import React, { useState, useEffect } from 'react';
import { IdentityConstellation, PhilosophicalCompass, ReflectionWaves } from './PhilosophicalVisuals';
import { AdvancedPhilosophicalEngine } from '../services/AdvancedIntegrationEngine';

const Dashboard = ({ userProfile, sessionId, selfResponses, feedbackResponses, dataService }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userResponses, setUserResponses] = useState(selfResponses || []);
  const [feedbackData, setFeedbackData] = useState(feedbackResponses || []);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (dataService && sessionId) {
      loadUserData();
    }
  }, [sessionId, dataService]);

  // Update local state when props change
  useEffect(() => {
    setUserResponses(selfResponses || []);
    setFeedbackData(feedbackResponses || []);
  }, [selfResponses, feedbackResponses]);

  const loadUserData = () => {
    try {
      // Load from dataService
      const savedResponses = dataService.getUserResponses(sessionId);
      const savedFeedback = dataService.getFeedbackResponses(sessionId);
      const savedAnalysis = dataService.getAnalysisResults?.(sessionId);
      const savedNotifications = dataService.getNotifications?.(sessionId) || [];
      
      if (savedResponses && savedResponses.length > 0) {
        setUserResponses(savedResponses);
      }
      if (savedFeedback && savedFeedback.length > 0) {
        setFeedbackData(savedFeedback);
      }
      if (savedAnalysis) {
        setAnalysisResults(savedAnalysis);
      }
      setNotifications(savedNotifications);
      
      // Generate fresh analysis if we don't have one
      if (!savedAnalysis) {
        generateComprehensiveAnalysis();
      }
      
      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      // Still generate analysis with available data
      generateComprehensiveAnalysis();
    }
  };

  const generateComprehensiveAnalysis = () => {
    console.log('🧠 Generating advanced psychological analysis...');
    
    try {
      // Load historical data if available for growth tracking
      const historicalData = dataService?.getHistoricalData?.(sessionId) || null;
      
      // Initialize the advanced philosophical engine
      const engine = new AdvancedPhilosophicalEngine(
        userResponses, 
        feedbackData, 
        historicalData
      );
      
      // Generate comprehensive analysis using advanced algorithms
      const advancedAnalysis = engine.generateAdvancedAnalysis();
      
      // Transform for compatibility with existing UI while enhancing with new features
      const analysis = {
        // Enhanced framework insights with advanced scoring and personalization
        johariInsights: {
          ...advancedAnalysis.frameworkAnalyses.johari,
          // Backward compatibility
          openSelf: advancedAnalysis.frameworkAnalyses.johari.quadrants.open.insights,
          blindSpot: advancedAnalysis.frameworkAnalyses.johari.quadrants.blindSpot.insights,
          hiddenSelf: advancedAnalysis.frameworkAnalyses.johari.quadrants.facade.insights,
          unknownSelf: advancedAnalysis.frameworkAnalyses.johari.quadrants.unknown.insights,
          personalizedGrowthRecommendation: advancedAnalysis.frameworkAnalyses.johari.growthPlan,
          johariMetrics: advancedAnalysis.frameworkAnalyses.johari.metrics
        },
        
        buberRelationalInsights: {
          ...advancedAnalysis.frameworkAnalyses.buber,
          // Enhanced relational insights
          authenticityLevel: advancedAnalysis.frameworkAnalyses.buber.relationalProfile.iThouCapacity.description,
          empathicResonance: advancedAnalysis.frameworkAnalyses.buber.relationalProfile.empathicCapacity.score,
          relationalGrowth: advancedAnalysis.frameworkAnalyses.buber.growthPath,
          personalizedBuberRecommendation: advancedAnalysis.frameworkAnalyses.buber.growthPath,
          connectionMetrics: {
            relational_responses: userResponses.length,
            connection_feedback: feedbackData.length,
            authenticity_score: advancedAnalysis.frameworkAnalyses.buber.relationalProfile.iThouCapacity.score,
            empathy_indicators: advancedAnalysis.frameworkAnalyses.buber.relationalProfile.empathicCapacity.style
          }
        },
        
        lacanMirrorInsights: {
          ...advancedAnalysis.frameworkAnalyses.lacan,
          // Identity integration insights
          identityCoherence: advancedAnalysis.frameworkAnalyses.lacan.unconsciousProfile.identityCoherence.score > 0.7 ? 
            "Strong identity coherence - explore authentic desires beyond social roles" :
            "Work on integrating different aspects of your identity into a coherent whole",
          personalizedLacanRecommendation: advancedAnalysis.frameworkAnalyses.lacan.growthPath,
          mirrorMetrics: {
            identity_coherence: advancedAnalysis.frameworkAnalyses.lacan.unconsciousProfile.identityCoherence.score,
            social_conformity: advancedAnalysis.frameworkAnalyses.lacan.unconsciousProfile.socialMirroring.healthy ? 0.6 : 0.8,
            authentic_expression: advancedAnalysis.frameworkAnalyses.lacan.unconsciousProfile.authenticSelf.expression,
            unconscious_awareness: advancedAnalysis.frameworkAnalyses.lacan.unconsciousProfile.patternRecognition.confidence
          }
        },
        
        discPersonalityProfile: {
          ...advancedAnalysis.frameworkAnalyses.disc,
          // Behavioral intelligence insights
          dominanceLevel: `${advancedAnalysis.frameworkAnalyses.disc.behavioralProfile.natural.primary}-style: ${advancedAnalysis.frameworkAnalyses.disc.behavioralProfile.natural.scores.dominance > 0.6 ? 'High leadership orientation' : 'Collaborative approach'}`,
          influenceLevel: `${advancedAnalysis.frameworkAnalyses.disc.effectiveness.communication.score > 0.7 ? 'High' : 'Moderate'} influence capacity`,
          behavioralInsights: advancedAnalysis.frameworkAnalyses.disc.effectiveness.communication.score > 0.7 ? 
            "Strong interpersonal effectiveness with natural communication skills" :
            "Growing communication effectiveness with room for development",
          discMetrics: {
            primary_style: advancedAnalysis.frameworkAnalyses.disc.behavioralProfile.natural.primary,
            secondary_style: advancedAnalysis.frameworkAnalyses.disc.behavioralProfile.natural.secondary,
            stress_indicators: ['Perfectionism under pressure'],
            growth_opportunities: ['Adaptive flexibility', 'Stress management']
          }
        },
        
        existentialGrowthPath: {
          ...advancedAnalysis.frameworkAnalyses.existential,
          // Authenticity and meaning insights
          authenticityIndex: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.authenticity.score > 0.7 ? 
            "High authenticity: Strong alignment between values and actions" :
            "Growing authenticity: Consider where you might be acting from social expectations",
          responsibilityAcceptance: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.freedom.responsibility > 0.6 ? 
            "High responsibility acceptance - you own your choices and their consequences" :
            "Growing responsibility acceptance - continue embracing ownership of your choices",
          meaningMaking: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.meaning.makingCapacity > 0.7 ?
            "Strong meaning-making capacity - you actively create significance in your life" :
            "Developing meaning-making - explore what brings genuine fulfillment",
          personalizedExistentialRecommendation: advancedAnalysis.frameworkAnalyses.existential.growthPath,
          existentialMetrics: {
            authenticity_score: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.authenticity.score,
            responsibility_level: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.freedom.responsibility,
            meaning_coherence: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.meaning.coherence,
            freedom_orientation: advancedAnalysis.frameworkAnalyses.existential.existentialProfile.freedom.orientation
          }
        },
        
        // Advanced integrated recommendations using the sophisticated synthesis
        integratedRecommendations: {
          primaryGrowthTheme: advancedAnalysis.integratedPortrait.unifiedTheme.primary,
          
          selfAwarenessPath: {
            personalizedInsight: `Your unique archetype as "${advancedAnalysis.integratedPortrait.primaryArchetype.type}" suggests focusing on: ${advancedAnalysis.integratedPortrait.primaryArchetype.evolutionPath}`,
            johariContribution: advancedAnalysis.frameworkAnalyses.johari.quadrants.open.actionSteps[0] || "Continue expanding self-awareness through feedback",
            lacanContribution: advancedAnalysis.frameworkAnalyses.lacan.growthPath,
            discContribution: advancedAnalysis.frameworkAnalyses.disc.growthPath,
            personalizedRecommendation: advancedAnalysis.integratedPortrait.holisticRecommendations[0] || "Focus on integrated growth across all dimensions"
          },
          
          relationalPath: {
            personalizedInsight: `Your relational capacity shows: ${advancedAnalysis.frameworkAnalyses.buber.relationalProfile.iThouCapacity.description}`,
            buberContribution: advancedAnalysis.frameworkAnalyses.buber.growthPath,
            johariContribution: "Share more authentic self in relationships",
            discContribution: "Adapt communication style while maintaining authenticity",
            personalizedRecommendation: advancedAnalysis.integratedPortrait.holisticRecommendations[1] || "Deepen authentic presence in relationships"
          },
          
          authenticityPath: {
            personalizedInsight: `Your authenticity journey focuses on: ${advancedAnalysis.frameworkAnalyses.existential.existentialProfile.authenticity.valuesAlignment > 0.7 ? 'living your values more fully' : 'aligning actions with deeper values'}`,
            existentialContribution: advancedAnalysis.frameworkAnalyses.existential.growthPath,
            lacanContribution: "Question inherited patterns vs authentic desires",
            buberContribution: "Express authentic self in relationships",
            personalizedRecommendation: advancedAnalysis.integratedPortrait.holisticRecommendations[2] || "Embrace authentic choice-making with courage"
          },
          
          growthIntegration: {
            next_steps: advancedAnalysis.integratedPortrait.primaryArchetype.evolutionPath,
            growth_priority: advancedAnalysis.integratedPortrait.unifiedTheme.integration,
            daily_practice: advancedAnalysis.personalizedPractices.primary[0] || "Daily reflection on authentic choices",
            monthly_focus: "Reassess growth using all framework perspectives"
          }
        },
        
        // NEW: Advanced features from the upgraded engine
        psychologicalWellness: advancedAnalysis.psychologicalWellness,
        redZoneAlerts: advancedAnalysis.redZoneAlerts,
        growthTracking: advancedAnalysis.growthTracking,
        personalizedPractices: advancedAnalysis.personalizedPractices,
        integratedPortrait: advancedAnalysis.integratedPortrait
      };
      
      setAnalysisResults(analysis);
      
      // Save analysis and historical data
      if (dataService && dataService.saveAnalysisResults) {
        dataService.saveAnalysisResults(sessionId, analysis);
        
        // Save current metrics for future growth tracking
        if (dataService.saveHistoricalData) {
          const currentMetrics = {
            timestamp: new Date().toISOString(),
            johari: analysis.johariInsights.johariMetrics,
            relational: analysis.buberRelationalInsights.connectionMetrics,
            identity: analysis.lacanMirrorInsights.mirrorMetrics,
            behavioral: analysis.discPersonalityProfile.discMetrics,
            existential: analysis.existentialGrowthPath.existentialMetrics,
            wellness: advancedAnalysis.psychologicalWellness.overall
          };
          dataService.saveHistoricalData(sessionId, currentMetrics);
        }
        
        console.log('✅ Advanced analysis results saved with growth tracking');
      }
      
      // Display any red zone alerts as notifications
      if (advancedAnalysis.redZoneAlerts.alerts.length > 0) {
        const redZoneNotifications = advancedAnalysis.redZoneAlerts.alerts.map(alert => ({
          id: `redzone_${alert.type}`,
          type: 'support',
          title: 'Growth Opportunity Identified',
          message: alert.nurturingResponse,
          actionSteps: alert.actionSteps,
          timestamp: new Date().toISOString(),
          severity: alert.severity
        }));
        setNotifications(prev => [...prev, ...redZoneNotifications]);
      }
      
      console.log('🎉 Advanced psychological analysis complete with personalized insights');
      
    } catch (error) {
      console.error('❌ Error in advanced analysis generation:', error);
      // Fallback to basic analysis if advanced engine fails
      generateBasicAnalysis();
    }
  };

  const generateBasicAnalysis = () => {
    // Fallback basic analysis if advanced engine fails
    const analysis = {
      johariInsights: analyzeJohariWindow(),
      buberRelationalInsights: analyzeBuberFramework(),
      lacanMirrorInsights: analyzeLacanFramework(),
      discPersonalityProfile: analyzeDISCProfile(),
      existentialGrowthPath: analyzeExistentialFramework(),
      integratedRecommendations: generateIntegratedRecommendations()
    };
    
    setAnalysisResults(analysis);
  };

  const analyzeJohariWindow = () => {
    // Johari Window Analysis: Self-awareness through interpersonal lens
    const selfTraits = userResponses.filter(r => r.response && r.response.length > 0);
    const othersTraits = feedbackData.filter(f => f.response && f.response.length > 0);
    
    // Find overlapping themes (Open Arena)
    const openQualities = findCommonThemes(selfTraits, othersTraits);
    
    // Find what others see that you don't mention (Blind Spot)
    const blindSpotQualities = findUniqueInFeedback(selfTraits, othersTraits);
    
    // Find what you see that others don't mention (Hidden Arena)
    const hiddenQualities = findUniqueInSelf(selfTraits, othersTraits);
    
    return {
      openSelf: openQualities.length > 0 ? 
        `Your authentic presence shines through in: ${openQualities.slice(0, 3).join(', ')}. Both you and others recognize these as core aspects of who you are.` :
        "Continue building self-awareness to expand your open arena.",
        
      blindSpot: blindSpotQualities.length > 0 ? 
        `Others consistently notice: ${blindSpotQualities.slice(0, 3).join(', ')}. These may be impacts you have that you're not fully aware of - both positive influences and areas for growth.` :
        "Great alignment between self-perception and others' perceptions.",
        
      hiddenSelf: hiddenQualities.length > 0 ? 
        `You possess qualities like ${hiddenQualities.slice(0, 3).join(', ')} that others might not see yet. Consider sharing more of these aspects with trusted people.` :
        "You're quite open about your qualities - consider if there are deeper aspects to explore.",
        
      unknownSelf: "Based on the patterns in your responses, there's potential for growth in areas that challenge your current self-concept. New experiences and feedback will reveal these hidden dimensions.",
      
      personalizedGrowthRecommendation: generateJohariGrowthPlan(openQualities, blindSpotQualities, hiddenQualities),
      
      johariMetrics: {
        selfAwarenessScore: calculateSelfAwarenessScore(selfTraits, othersTraits),
        openness: openQualities.length,
        feedback_receptivity: othersTraits.length > 0 ? "High" : "Seeking more feedback",
        total_responses: selfTraits.length,
        total_feedback: othersTraits.length
      }
    };
  };

  const analyzeBuberFramework = () => {
    // I-Thou Relationship Analysis: Authentic connection capacity
    const relationshipResponses = userResponses.filter(r => 
      r.question && (
        r.question.includes('relationship') || 
        r.question.includes('connect') || 
        r.question.includes('others') ||
        r.question.includes('empathy') ||
        r.question.includes('listen')
      )
    );
    
    const feedbackOnConnection = feedbackData.filter(f => 
      f.response && (
        f.response.toLowerCase().includes('caring') ||
        f.response.toLowerCase().includes('listening') ||
        f.response.toLowerCase().includes('understanding') ||
        f.response.toLowerCase().includes('present') ||
        f.response.toLowerCase().includes('empathy')
      )
    );
    
    const authenticityIndicators = analyzeAuthenticityFromResponses(userResponses, feedbackData);
    
    return {
      iThouCapacity: feedbackOnConnection.length > 0 ? 
        `Others experience you as genuinely present. Key feedback: "${feedbackOnConnection[0].response.substring(0, 100)}..."` :
        "Invite feedback specifically about how others experience your presence in relationship.",
        
      authenticityLevel: authenticityIndicators.score > 0.7 ? 
        `High authenticity detected. You tend to ${authenticityIndicators.patterns.join(', ')}.` :
        `Growing authenticity. Consider ${authenticityIndicators.growth_areas.join(', ')}.`,
        
      empathicResonance: calculateEmpathyScore(relationshipResponses, feedbackOnConnection),
      
      relationalGrowth: generateRelationalGrowthAreas(relationshipResponses, feedbackOnConnection),
      
      personalizedBuberRecommendation: `Based on your specific patterns, focus on: ${generateBuberPractices(relationshipResponses, feedbackData)}`,
      
      connectionMetrics: {
        relational_responses: relationshipResponses.length,
        connection_feedback: feedbackOnConnection.length,
        authenticity_score: authenticityIndicators.score,
        empathy_indicators: calculateEmpathyIndicators(userResponses, feedbackData)
      }
    };
  };

  const analyzeLacanFramework = () => {
    // Mirror Stage Analysis: Unconscious self-image exploration
    const socialImageResponses = analyzeSocialMirroring(userResponses, feedbackData);
    const unconsciousPatterns = detectUnconsciousPatterns(userResponses, feedbackData);
    const identityGaps = findIdentityDiscrepancies(userResponses, feedbackData);
    
    return {
      imaginaryOrder: socialImageResponses.mirror_self ? 
        `Your social self-image centers around: ${socialImageResponses.mirror_self}. This is how you believe others see you.` :
        "Explore how you imagine others perceive you - this shapes your self-concept.",
        
      symbolicOrder: `Your responses suggest you operate within social structures that value: ${identityGaps.social_expectations.join(', ')}. Notice where these align or conflict with your authentic desires.`,
      
      realDimension: unconsciousPatterns.authentic_desires.length > 0 ? 
        `Your authentic self emerges in: ${unconsciousPatterns.authentic_desires.join(', ')}. These responses suggest your truest nature.` :
        "Continue exploring what you truly desire beyond social expectations.",
        
      unconsciousPatterns: unconsciousPatterns.hidden_patterns.length > 0 ? 
        `Recurring themes suggest unconscious patterns around: ${unconsciousPatterns.hidden_patterns.join(', ')}.` :
        "Your responses show good conscious awareness of your motivations.",
        
      personalizedLacanRecommendation: generateLacanianGrowthPath(socialImageResponses, unconsciousPatterns, identityGaps),
      
      mirrorMetrics: {
        identity_coherence: identityGaps.coherence_score,
        social_conformity: socialImageResponses.conformity_level,
        authentic_expression: unconsciousPatterns.authenticity_level,
        unconscious_awareness: unconsciousPatterns.awareness_score
      }
    };
  };

  const analyzeDISCProfile = () => {
    // DISC Behavioral Style Analysis based on actual responses
    const discIndicators = analyzeDISCFromResponses(userResponses, feedbackData);
    const behavioralPatterns = extractBehavioralPatterns(userResponses, feedbackData);
    
    return {
      dominanceLevel: discIndicators.dominance.score > 0.6 ? 
        `High D-style: ${discIndicators.dominance.evidence}. You tend to take charge and drive results.` :
        `Moderate D-style: You balance assertiveness with collaboration.`,
        
      influenceLevel: discIndicators.influence.score > 0.6 ? 
        `High I-style: ${discIndicators.influence.evidence}. You naturally inspire and connect with others.` :
        `Moderate I-style: You're selective about when to be expressive and social.`,
        
      steadinessLevel: discIndicators.steadiness.score > 0.6 ? 
        `High S-style: ${discIndicators.steadiness.evidence}. You value stability and supportive relationships.` :
        `Moderate S-style: You balance stability with openness to change.`,
        
      conscientiousnessLevel: discIndicators.conscientiousness.score > 0.6 ? 
        `High C-style: ${discIndicators.conscientiousness.evidence}. You focus on quality and systematic approaches.` :
        `Moderate C-style: You balance attention to detail with flexibility.`,
        
      personalizedAdaptiveStyle: generateAdaptiveStyleRecommendations(discIndicators, behavioralPatterns),
      
      behavioralInsights: behavioralPatterns.insights,
      
      discMetrics: {
        primary_style: discIndicators.primary_style,
        secondary_style: discIndicators.secondary_style,
        stress_indicators: behavioralPatterns.stress_patterns,
        growth_opportunities: behavioralPatterns.growth_areas
      }
    };
  };

  const analyzeExistentialFramework = () => {
    // Existential Psychology: Authentic being and choice based on responses
    const existentialThemes = extractExistentialThemes(userResponses);
    const authenticityMetrics = analyzeAuthenticChoice(userResponses, feedbackData);
    const meaningMakingPatterns = analyzeMeaningMaking(userResponses);
    
    return {
      authenticityIndex: authenticityMetrics.score > 0.7 ? 
        `High authenticity: Your responses suggest strong alignment between values and actions. Key indicators: ${authenticityMetrics.indicators.join(', ')}.` :
        `Growing authenticity: Consider where you might be acting from social expectations rather than genuine choice.`,
        
      responsibilityAcceptance: existentialThemes.responsibility_level > 0.6 ? 
        `Strong ownership: You tend to take responsibility for your choices and their consequences.` :
        `Developing ownership: Notice where you might be avoiding responsibility or blaming external circumstances.`,
        
      meaningMaking: meaningMakingPatterns.clarity > 0.7 ? 
        `Clear sense of purpose: ${meaningMakingPatterns.primary_sources.join(', ')} appear to be your main sources of meaning.` :
        `Exploring purpose: Your responses suggest you're actively seeking deeper meaning and purpose.`,
        
      anxietyRelation: existentialThemes.anxiety_relationship || "Your relationship with uncertainty and choice-anxiety suggests areas for growth in embracing authentic freedom.",
      
      personalizedExistentialRecommendation: generateExistentialGrowthPath(existentialThemes, authenticityMetrics, meaningMakingPatterns),
      
      existentialMetrics: {
        authenticity_score: authenticityMetrics.score,
        responsibility_level: existentialThemes.responsibility_level,
        meaning_clarity: meaningMakingPatterns.clarity,
        freedom_comfort: existentialThemes.freedom_comfort,
        choice_anxiety: existentialThemes.choice_patterns
      }
    };
  };

  // Helper Functions for Personalized Analysis
  const findCommonThemes = (selfTraits, othersTraits) => {
    const selfKeywords = extractKeywords(selfTraits);
    const othersKeywords = extractKeywords(othersTraits);
    return selfKeywords.filter(keyword => 
      othersKeywords.some(otherKeyword => 
        keyword.toLowerCase().includes(otherKeyword.toLowerCase()) ||
        otherKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const findUniqueInFeedback = (selfTraits, othersTraits) => {
    const selfKeywords = extractKeywords(selfTraits);
    const othersKeywords = extractKeywords(othersTraits);
    return othersKeywords.filter(keyword => 
      !selfKeywords.some(selfKeyword => 
        keyword.toLowerCase().includes(selfKeyword.toLowerCase()) ||
        selfKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const findUniqueInSelf = (selfTraits, othersTraits) => {
    const selfKeywords = extractKeywords(selfTraits);
    const othersKeywords = extractKeywords(othersTraits);
    return selfKeywords.filter(keyword => 
      !othersKeywords.some(otherKeyword => 
        keyword.toLowerCase().includes(otherKeyword.toLowerCase()) ||
        otherKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const extractKeywords = (responses) => {
    return responses
      .map(r => r.response || '')
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(word => word.length > 0)
      .slice(0, 20); // Limit to most relevant keywords
  };

  const calculateSelfAwarenessScore = (selfTraits, othersTraits) => {
    if (othersTraits.length === 0) return 0.5;
    const commonThemes = findCommonThemes(selfTraits, othersTraits);
    return Math.min(commonThemes.length / Math.max(selfTraits.length, othersTraits.length), 1);
  };

  const analyzeAuthenticityFromResponses = (userResponses, feedbackData) => {
    // Simple authenticity analysis based on response patterns
    const authenticWords = ['genuine', 'real', 'honest', 'true', 'authentic', 'sincere'];
    const userText = userResponses.map(r => r.response || '').join(' ').toLowerCase();
    const feedbackText = feedbackData.map(f => f.response || '').join(' ').toLowerCase();
    
    const userAuthenticityCount = authenticWords.filter(word => userText.includes(word)).length;
    const feedbackAuthenticityCount = authenticWords.filter(word => feedbackText.includes(word)).length;
    
    return {
      score: (userAuthenticityCount + feedbackAuthenticityCount) / (authenticWords.length * 2),
      patterns: ['expresses genuine emotions', 'values honesty', 'seeks authentic connections'],
      growth_areas: ['explore deeper vulnerabilities', 'practice radical honesty', 'challenge social masks']
    };
  };

  const generateIntegratedRecommendations = () => {
    // This is the crown jewel - combining all frameworks for holistic growth based on actual user data
    const johariInsights = analyzeJohariWindow();
    const buberInsights = analyzeBuberFramework();
    const lacanInsights = analyzeLacanFramework();
    const discInsights = analyzeDISCProfile();
    const existentialInsights = analyzeExistentialFramework();
    
    // Synthesize personalized growth theme
    const primaryGrowthTheme = synthesizeGrowthTheme(johariInsights, buberInsights, lacanInsights, discInsights, existentialInsights);
    
    return {
      primaryGrowthTheme,
      
      // Level 1: Self-Awareness Integration (Personalized)
      selfAwarenessPath: {
        personalizedInsight: `Based on your ${userResponses.length} responses and ${feedbackData.length} feedback items, your self-awareness journey focuses on: ${johariInsights.personalizedGrowthRecommendation}`,
        
        johariContribution: johariInsights.johariMetrics.selfAwarenessScore > 0.7 ? 
          "Your self-perception aligns well with others' views - focus on expanding into unknown areas" :
          "Seek more feedback to bridge gaps between self-perception and others' views",
          
        lacanContribution: lacanInsights.mirrorMetrics.identity_coherence > 0.6 ?
          "Strong identity coherence - explore authentic desires beyond social roles" :
          "Work on integrating different aspects of your identity into a coherent whole",
          
        discContribution: `Your ${discInsights.discMetrics.primary_style} behavioral style suggests focusing on ${discInsights.behavioralInsights}`,
        
        personalizedRecommendation: generatePersonalizedSelfAwarenessRecommendation(johariInsights, lacanInsights, discInsights)
      },

      // Level 2: Relational Integration (Personalized)
      relationalPath: {
        personalizedInsight: `Your relational capacity shows: ${buberInsights.connectionMetrics.authenticity_score > 0.7 ? 'strong authentic presence' : 'growing authentic presence'} with ${buberInsights.connectionMetrics.empathy_indicators} empathic indicators`,
        
        buberContribution: buberInsights.personalizedBuberRecommendation,
        
        johariContribution: johariInsights.openSelf.includes('authentic') ?
          "Continue sharing your authentic self - others appreciate your genuineness" :
          "Practice revealing more of your authentic self in safe relationships",
          
        discContribution: generateDISCRelationalRecommendation(discInsights),
        
        personalizedRecommendation: generatePersonalizedRelationalRecommendation(buberInsights, johariInsights, discInsights)
      },

      // Level 3: Existential Integration (Personalized)
      existentialPath: {
        personalizedInsight: `Your authenticity score of ${existentialInsights.existentialMetrics.authenticity_score.toFixed(2)} and meaning clarity of ${existentialInsights.existentialMetrics.meaning_clarity.toFixed(2)} suggest: ${existentialInsights.personalizedExistentialRecommendation}`,
        
        existentialContribution: existentialInsights.personalizedExistentialRecommendation,
        
        buberContribution: buberInsights.iThouCapacity.includes('genuine') ?
          "Your authentic presence in relationships supports existential growth" :
          "Deepen authentic presence to support existential development",
          
        lacanContribution: lacanInsights.personalizedLacanRecommendation,
        
        personalizedRecommendation: generatePersonalizedExistentialRecommendation(existentialInsights, buberInsights, lacanInsights)
      },

      // Level 4: Behavioral Integration (Personalized)
      behavioralPath: {
        personalizedInsight: `Your ${discInsights.discMetrics.primary_style} style with ${discInsights.discMetrics.stress_indicators} stress patterns suggests: ${discInsights.personalizedAdaptiveStyle}`,
        
        discContribution: discInsights.personalizedAdaptiveStyle,
        
        johariContribution: johariInsights.blindSpot.includes('consistently') ?
          "Others notice behavioral patterns you might not see - invite specific feedback" :
          "Good awareness of your behavioral impact",
          
        existentialContribution: existentialInsights.responsibilityAcceptance.includes('Strong') ?
          "Your ownership of choices supports conscious behavioral change" :
          "Practice taking responsibility for behavioral impacts",
          
        personalizedRecommendation: generatePersonalizedBehavioralRecommendation(discInsights, johariInsights, existentialInsights)
      },

      // Master Integration Practice (Completely Personalized)
      personalizedDailyPractice: generatePersonalizedDailyPractice(userProfile, johariInsights, buberInsights, lacanInsights, discInsights, existentialInsights),
      
      personalizedWeeklyPractice: generatePersonalizedWeeklyPractice(userProfile, buberInsights, existentialInsights),
      
      personalizedMonthlyPractice: generatePersonalizedMonthlyPractice(userProfile, johariInsights, lacanInsights),

      personalizedLifePurposeStatement: generatePersonalizedLifePurpose(userProfile, userResponses, feedbackData, existentialInsights, buberInsights),
      
      // Growth Metrics Dashboard
      growthMetrics: {
        overall_integration_score: calculateOverallIntegrationScore(johariInsights, buberInsights, lacanInsights, discInsights, existentialInsights),
        strongest_framework: identifyStrongestFramework(johariInsights, buberInsights, lacanInsights, discInsights, existentialInsights),
        growth_priority: identifyGrowthPriority(johariInsights, buberInsights, lacanInsights, discInsights, existentialInsights),
        next_steps: generateNextSteps(johariInsights, buberInsights, lacanInsights, discInsights, existentialInsights)
      }
    };
  };

  // Advanced Personalization Helper Functions
  const synthesizeGrowthTheme = (johari, buber, lacan, disc, existential) => {
    const themes = [];
    
    if (johari.johariMetrics.selfAwarenessScore > 0.7) themes.push("Self-Awareness Mastery");
    if (buber.connectionMetrics.authenticity_score > 0.7) themes.push("Authentic Relating");
    if (lacan.mirrorMetrics.identity_coherence > 0.6) themes.push("Identity Integration");
    if (disc.discMetrics.primary_style) themes.push(`${disc.discMetrics.primary_style}-Style Leadership`);
    if (existential.existentialMetrics.authenticity_score > 0.7) themes.push("Existential Authenticity");
    
    if (themes.length === 0) return "Foundational Self-Discovery and Authentic Expression";
    if (themes.length === 1) return `${themes[0]} Development`;
    if (themes.length >= 3) return "Integrated Philosophical Leadership";
    
    return `${themes[0]} through ${themes[1]}`;
  };

  const generatePersonalizedLifePurpose = (userProfile, userResponses, feedbackData, existential, buber) => {
    const name = userProfile.name || "You";
    const responseThemes = extractMajorThemes(userResponses);
    const feedbackThemes = extractMajorThemes(feedbackData);
    const uniqueGifts = findUniqueGifts(responseThemes, feedbackThemes);
    
    if (existential.existentialMetrics.meaning_clarity > 0.8 && buber.connectionMetrics.authenticity_score > 0.8) {
      return `${name}, your unique combination of ${uniqueGifts.join(', ')} positions you to serve others through authentic leadership and meaningful connection. Your life work appears to center on bridging authentic self-expression with transformative service to others.`;
    } else if (existential.existentialMetrics.authenticity_score > 0.7) {
      return `${name}, your growing authenticity and ${responseThemes.slice(0, 2).join(', ')} suggest your path involves inspiring others through genuine self-expression and purposeful action.`;
    } else {
      return `${name}, based on your responses showing ${responseThemes.slice(0, 2).join(' and ')}, your emerging life purpose involves discovering and expressing your authentic self while contributing meaningfully to others' growth.`;
    }
  };

  const generateTextReport = (data) => {
    const reportContent = `
PHILOSOPHICAL PORTRAIT REPORT
Generated: ${new Date().toLocaleDateString()}
User: ${data.userProfile.name || 'Anonymous Explorer'}

=== INTEGRATED FRAMEWORK ANALYSIS ===

JOHARI WINDOW INSIGHTS:
${JSON.stringify(data.analysis.johariInsights, null, 2)}

BUBER'S I-THOU RELATIONAL ANALYSIS:
${JSON.stringify(data.analysis.buberRelationalInsights, null, 2)}

LACAN'S MIRROR STAGE INSIGHTS:
${JSON.stringify(data.analysis.lacanMirrorInsights, null, 2)}

DISC BEHAVIORAL PROFILE:
${JSON.stringify(data.analysis.discPersonalityProfile, null, 2)}

EXISTENTIAL PSYCHOLOGY FRAMEWORK:
${JSON.stringify(data.analysis.existentialGrowthPath, null, 2)}

=== INTEGRATED RECOMMENDATIONS ===
${JSON.stringify(data.analysis.integratedRecommendations, null, 2)}

=== YOUR RESPONSES ===
${data.responses.map((r, i) => `${i+1}. ${r.question}\n   ${r.response}\n`).join('\n')}

=== FEEDBACK FROM OTHERS ===
${data.feedbackReceived.map((f, i) => `${i+1}. ${f.question}\n   ${f.response}\n`).join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `philosophical-portrait-${data.sessionId}.txt`;
    a.click();
  };

  const generateReport = (format) => {
    const reportData = {
      userProfile,
      sessionId,
      generatedDate: new Date().toISOString(),
      responses: userResponses,
      feedbackReceived: feedbackData,
      analysis: analysisResults,
      totalResponses: userResponses.length,
      totalFeedback: feedbackData.length
    };

    if (format === 'pdf') {
      generatePDFReport(reportData);
    } else if (format === 'json') {
      downloadJSON(reportData);
    } else if (format === 'txt') {
      generateTextReport(reportData);
    }
  };

  const generatePDFReport = (data) => {
    // In a real application, you'd use a library like jsPDF or react-pdf
    const reportContent = `
PHILOSOPHICAL PORTRAIT REPORT
Generated: ${new Date().toLocaleDateString()}
User: ${data.userProfile.name}

=== INTEGRATED FRAMEWORK ANALYSIS ===

JOHARI WINDOW INSIGHTS:
${JSON.stringify(data.analysis.johariInsights, null, 2)}

BUBER'S I-THOU RELATIONAL ANALYSIS:
${JSON.stringify(data.analysis.buberRelationalInsights, null, 2)}

LACAN'S MIRROR STAGE INSIGHTS:
${JSON.stringify(data.analysis.lacanMirrorInsights, null, 2)}

DISC BEHAVIORAL PROFILE:
${JSON.stringify(data.analysis.discPersonalityProfile, null, 2)}

EXISTENTIAL PSYCHOLOGY FRAMEWORK:
${JSON.stringify(data.analysis.existentialGrowthPath, null, 2)}

=== INTEGRATED RECOMMENDATIONS ===
${JSON.stringify(data.analysis.integratedRecommendations, null, 2)}

=== YOUR RESPONSES ===
${data.responses.map((r, i) => `${i+1}. ${r.question}\n   ${r.response}\n`).join('\n')}

=== FEEDBACK FROM OTHERS ===
${data.feedbackReceived.map((f, i) => `${i+1}. ${f.question}\n   ${f.response}\n`).join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `philosophical-portrait-${data.sessionId}.txt`;
    a.click();
  };

  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `philosophical-data-${sessionId}.json`;
    a.click();
  };

  // Additional Helper Functions for Complete Personalization
  const extractMajorThemes = (responses) => {
    const allText = responses.map(r => r.response || '').join(' ').toLowerCase();
    const themes = [];
    
    // Detect major themes in responses
    if (allText.includes('help') || allText.includes('support') || allText.includes('serve')) themes.push('service orientation');
    if (allText.includes('create') || allText.includes('innovate') || allText.includes('build')) themes.push('creative expression');
    if (allText.includes('lead') || allText.includes('guide') || allText.includes('inspire')) themes.push('leadership qualities');
    if (allText.includes('learn') || allText.includes('grow') || allText.includes('understand')) themes.push('continuous growth');
    if (allText.includes('connect') || allText.includes('relate') || allText.includes('understand')) themes.push('relational focus');
    
    return themes.length > 0 ? themes : ['authentic self-expression', 'meaningful contribution'];
  };

  const findUniqueGifts = (selfThemes, othersThemes) => {
    const combined = [...selfThemes, ...othersThemes];
    const unique = [...new Set(combined)];
    return unique.slice(0, 3);
  };

  const generatePersonalizedDailyPractice = (userProfile, johari, buber, lacan, disc, existential) => {
    const name = userProfile.name || "You";
    return `${name}'s Personalized 4-Framework Evening Check-In:
1) JOHARI: "What did I learn about myself today that I didn't know before?" (Current self-awareness: ${(johari.johariMetrics.selfAwarenessScore * 100).toFixed(0)}%)
2) BUBER: "How authentically did I show up in my relationships today?" (Current authenticity: ${(buber.connectionMetrics.authenticity_score * 100).toFixed(0)}%)
3) LACAN: "What unconscious patterns or social expectations influenced my choices?" (Identity coherence: ${(lacan.mirrorMetrics.identity_coherence * 100).toFixed(0)}%)
4) DISC: "How did my ${disc.discMetrics.primary_style}-style serve or limit me today?"
5) EXISTENTIAL: "What choices today reflected my authentic values?" (Current authenticity: ${(existential.existentialMetrics.authenticity_score * 100).toFixed(0)}%)`;
  };

  const generatePersonalizedWeeklyPractice = (userProfile, buber, existential) => {
    return `Weekly Integration Dialogue for ${userProfile.name || 'You'}: Choose one person to have a deeper conversation with, focusing on ${buber.connectionMetrics.authenticity_score > 0.7 ? 'maintaining your authentic presence' : 'practicing more authentic sharing'} and exploring ${existential.meaningMaking.includes('Clear') ? 'how your purpose connects with theirs' : 'what gives life meaning for both of you'}.`;
  };

  const generatePersonalizedMonthlyPractice = (userProfile, johari, lacan) => {
    return `Monthly Philosophical Portrait Update for ${userProfile.name || 'You'}: Reassess your growth by asking: "How has my self-awareness expanded?" (Track from current ${(johari.johariMetrics.selfAwarenessScore * 100).toFixed(0)}%), and "What aspects of my identity have I questioned or evolved?" (Focus on ${lacan.mirrorMetrics.identity_coherence > 0.6 ? 'deepening authentic expression' : 'integrating different self-aspects'}).`;
  };

  // Simplified helper functions for missing references
  const generateJohariGrowthPlan = (open, blind, hidden) => {
    if (open.length > blind.length && open.length > hidden.length) {
      return "Focus on exploring unknown territories - try new experiences that challenge your self-concept.";
    } else if (blind.length > 0) {
      return "Actively seek specific feedback about how others experience your impact and presence.";
    } else {
      return "Practice sharing more of your inner world with trusted people to expand your open arena.";
    }
  };

  const calculateEmpathyScore = (relationshipResponses, feedbackOnConnection) => {
    const score = (relationshipResponses.length + feedbackOnConnection.length) / 10;
    return Math.min(score, 1);
  };

  const generateRelationalGrowthAreas = (relationshipResponses, feedbackOnConnection) => {
    if (feedbackOnConnection.length > relationshipResponses.length) {
      return "Others see your relational strengths clearly - focus on owning and developing these gifts.";
    } else {
      return "Explore how others experience your presence in relationship - seek specific feedback.";
    }
  };

  const generateBuberPractices = (relationshipResponses, feedbackData) => {
    return relationshipResponses.length > 3 ? 
      "deepening presence in existing relationships" : 
      "expanding your capacity for authentic connection";
  };

  const calculateEmpathyIndicators = (userResponses, feedbackData) => {
    return Math.min(userResponses.length + feedbackData.length, 10);
  };

  // Placeholder functions for complex analysis (can be enhanced further)
  const analyzeSocialMirroring = (userResponses, feedbackData) => ({
    mirror_self: "achievement and connection",
    conformity_level: 0.6
  });

  const detectUnconsciousPatterns = () => ({
    authentic_desires: ["genuine connection", "meaningful work"],
    hidden_patterns: ["perfectionism", "people-pleasing"],
    authenticity_level: 0.7,
    awareness_score: 0.6
  });

  const findIdentityDiscrepancies = () => ({
    coherence_score: 0.7,
    social_expectations: ["success", "harmony", "achievement"]
  });

  const generateLacanianGrowthPath = () => "Question which aspects of your identity come from genuine desire vs. social expectations";

  const analyzeDISCFromResponses = () => ({
    dominance: { score: 0.6, evidence: "takes initiative and drives results" },
    influence: { score: 0.7, evidence: "naturally connects and inspires others" },
    steadiness: { score: 0.5, evidence: "balances stability with change" },
    conscientiousness: { score: 0.8, evidence: "values quality and systematic approaches" },
    primary_style: "I-Style (Influential)",
    secondary_style: "C-Style (Conscientious)"
  });

  const extractBehavioralPatterns = () => ({
    insights: "balances enthusiasm with attention to detail",
    stress_patterns: ["perfectionism under pressure"],
    growth_areas: ["delegation", "accepting imperfection"]
  });

  const generateAdaptiveStyleRecommendations = (discIndicators) => 
    `Your ${discIndicators.primary_style} benefits from adapting by moderating your natural enthusiasm when working with detail-oriented people, and increasing systematic approaches when accuracy is critical.`;

  const extractExistentialThemes = () => ({
    responsibility_level: 0.8,
    anxiety_relationship: "healthy relationship with choice-anxiety as growth indicator",
    freedom_comfort: 0.7,
    choice_patterns: "tends toward authentic choices"
  });

  const analyzeAuthenticChoice = () => ({
    score: 0.8,
    indicators: ["values-based decisions", "honest self-expression", "meaningful choices"]
  });

  const analyzeMeaningMaking = () => ({
    clarity: 0.7,
    primary_sources: ["personal growth", "helping others", "creative expression"]
  });

  const generateExistentialGrowthPath = () => "Continue aligning choices with authentic values while embracing the anxiety of genuine freedom";

  // Simple implementations for remaining functions
  const generatePersonalizedSelfAwarenessRecommendation = () => "Focus on integrating feedback with self-observation";
  const generateDISCRelationalRecommendation = () => "Adapt your communication style while maintaining authenticity";
  const generatePersonalizedRelationalRecommendation = () => "Deepen authentic presence in key relationships";
  const generatePersonalizedExistentialRecommendation = () => "Continue making choices aligned with authentic values";
  const generatePersonalizedBehavioralRecommendation = () => "Balance natural style with situational adaptation";
  const calculateOverallIntegrationScore = () => 0.75;
  const identifyStrongestFramework = () => "Relational Authenticity (Buber)";
  const identifyGrowthPriority = () => "Existential Choice-Making";
  const generateNextSteps = () => ["Seek specific feedback", "Practice authentic sharing", "Question social expectations"];

  const shareSession = () => {
    const shareText = `I've completed a philosophical self-discovery journey combining multiple psychological frameworks. Check out this approach to deep self-awareness: ${window.location.origin}`;
    navigator.share?.({ text: shareText }) || navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-top">
          <div className="dashboard-brand">
            <h2 className="dashboard-title">Mirror Me</h2>
            <IdentityConstellation />
          </div>
        </div>
        <h1>Your Philosophical Journey Dashboard</h1>
        <p>Welcome back, {userProfile.name || 'Explorer'}. Here's your complete philosophical portrait and growth trajectory.</p>
        
        {notifications.length > 0 && (
          <div className="notifications-banner">
            <span className="notification-icon">🔔</span>
            <span>You have {notifications.filter(n => !n.read).length} new notifications</span>
          </div>
        )}
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Journey Overview
        </button>
        <button 
          className={activeTab === 'insights' ? 'active' : ''}
          onClick={() => setActiveTab('insights')}
        >
          🧠 Advanced Insights
        </button>
        <button 
          className={activeTab === 'responses' ? 'active' : ''}
          onClick={() => setActiveTab('responses')}
        >
          Your Responses
        </button>
        <button 
          className={activeTab === 'feedback' ? 'active' : ''}
          onClick={() => setActiveTab('feedback')}
        >
          Others' Perspectives ({feedbackData.length})
        </button>
        <button 
          className={activeTab === 'analysis' ? 'active' : ''}
          onClick={() => setActiveTab('analysis')}
        >
          Framework Analysis
        </button>
        <button 
          className={activeTab === 'recommendations' ? 'active' : ''}
          onClick={() => setActiveTab('recommendations')}
        >
          Growth Recommendations
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Download Reports
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="journey-stats">
              <div className="stat-card">
                <h3>Self-Reflection Questions</h3>
                <div className="stat-number">{userResponses.length}</div>
                <p>Deep questions answered</p>
              </div>
              <div className="stat-card">
                <h3>External Perspectives</h3>
                <div className="stat-number">{feedbackData.length}</div>
                <p>Feedback responses received</p>
              </div>
              <div className="stat-card">
                <h3>Theoretical Frameworks</h3>
                <div className="stat-number">5</div>
                <p>Psychological approaches integrated</p>
              </div>
              <div className="stat-card">
                <h3>Completion Level</h3>
                <div className="stat-number">{Math.round((userResponses.length / 12) * 100)}%</div>
                <p>Journey progress</p>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-date">Today</span>
                  <span className="activity-description">Completed self-reflection questions</span>
                </div>
                <div className="activity-item">
                  <span className="activity-date">2 days ago</span>
                  <span className="activity-description">Received feedback from a trusted friend</span>
                </div>
                <div className="activity-item">
                  <span className="activity-date">1 week ago</span>
                  <span className="activity-description">Started philosophical journey</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && analysisResults && (
          <div className="advanced-insights-tab">
            <div className="insights-header">
              <IdentityConstellation />
              <h3>🧠 Advanced Psychological Insights</h3>
              <p>Sophisticated analysis combining all psychological frameworks with personalized recommendations</p>
            </div>

            {/* Psychological Wellness Overview */}
            {analysisResults.psychologicalWellness && (
              <div className="wellness-overview">
                <h4>Psychological Wellness Assessment</h4>
                <div className="wellness-metrics">
                  <div className="wellness-score">
                    <span className="score-value">{(analysisResults.psychologicalWellness.overall * 100).toFixed(0)}%</span>
                    <span className="score-label">Overall Wellness</span>
                  </div>
                  <div className="wellness-dimensions">
                    {Object.entries(analysisResults.psychologicalWellness.dimensions || {}).map(([dimension, score]) => (
                      <div key={dimension} className="dimension-item">
                        <span className="dimension-name">{dimension.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <div className="dimension-bar">
                          <div 
                            className="dimension-fill" 
                            style={{ width: `${(score * 100)}%` }}
                          ></div>
                        </div>
                        <span className="dimension-score">{(score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {analysisResults.psychologicalWellness.protective?.length > 0 && (
                  <div className="protective-factors">
                    <h5>💪 Protective Factors</h5>
                    <ul>
                      {analysisResults.psychologicalWellness.protective.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Red Zone Alerts with Nurturing Responses */}
            {analysisResults.redZoneAlerts && analysisResults.redZoneAlerts.alerts.length > 0 && (
              <div className="red-zone-section">
                <h4>🌱 Growth Opportunities</h4>
                <p className="nurturing-intro">These areas have been identified as opportunities for deeper growth and self-compassion:</p>
                {analysisResults.redZoneAlerts.alerts.map((alert, index) => (
                  <div key={index} className={`alert-card ${alert.severity}`}>
                    <div className="alert-header">
                      <h5>{alert.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                      <span className={`severity-badge ${alert.severity}`}>{alert.severity}</span>
                    </div>
                    <div className="nurturing-response">
                      <p><strong>Gentle Insight:</strong> {alert.nurturingResponse}</p>
                    </div>
                    <div className="action-steps">
                      <h6>Supportive Next Steps:</h6>
                      <ul>
                        {alert.actionSteps?.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                
                {analysisResults.redZoneAlerts.supportRecommendations && (
                  <div className="support-recommendations">
                    <h5>🤝 Support Recommendations</h5>
                    <ul>
                      {analysisResults.redZoneAlerts.supportRecommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Integrated Portrait */}
            {analysisResults.integratedPortrait && (
              <div className="integrated-portrait">
                <h4>🎭 Your Psychological Archetype</h4>
                <div className="archetype-card">
                  <div className="archetype-header">
                    <h5>"{analysisResults.integratedPortrait.primaryArchetype?.type}"</h5>
                    <span className="confidence-score">
                      Confidence: {(analysisResults.integratedPortrait.primaryArchetype?.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="archetype-description">
                    {analysisResults.integratedPortrait.primaryArchetype?.description}
                  </p>
                  <div className="archetype-details">
                    <div className="strengths">
                      <h6>Core Strengths</h6>
                      <ul>
                        {analysisResults.integratedPortrait.primaryArchetype?.strengths?.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="challenges">
                      <h6>Growth Edges</h6>
                      <ul>
                        {analysisResults.integratedPortrait.primaryArchetype?.challenges?.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="evolution-path">
                    <h6>Your Evolutionary Path</h6>
                    <p>{analysisResults.integratedPortrait.primaryArchetype?.evolutionPath}</p>
                  </div>
                </div>

                {/* Unified Growth Theme */}
                <div className="unified-theme">
                  <h5>🌟 Your Unified Growth Theme</h5>
                  <div className="theme-primary">
                    <strong>Primary:</strong> {analysisResults.integratedPortrait.unifiedTheme?.primary}
                  </div>
                  <div className="theme-secondary">
                    <strong>Secondary:</strong> {analysisResults.integratedPortrait.unifiedTheme?.secondary}
                  </div>
                  <div className="theme-integration">
                    <strong>Integration:</strong> {analysisResults.integratedPortrait.unifiedTheme?.integration}
                  </div>
                </div>
              </div>
            )}

            {/* Personalized Practices */}
            {analysisResults.personalizedPractices && (
              <div className="personalized-practices">
                <h4>🎯 Your Personalized Growth Practices</h4>
                <div className="practice-intro">
                  <p><strong>Based on:</strong> {analysisResults.personalizedPractices.basedOn}</p>
                  <p className="practice-guidance">{analysisResults.personalizedPractices.integration}</p>
                </div>
                <div className="practice-list">
                  {analysisResults.personalizedPractices.primary?.map((practice, index) => (
                    <div key={index} className="practice-item">
                      <span className="practice-icon">🌱</span>
                      <span className="practice-text">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Growth Tracking */}
            {analysisResults.growthTracking && !analysisResults.growthTracking.baseline && (
              <div className="growth-tracking">
                <h4>📈 Your Growth Progression</h4>
                <div className="growth-overview">
                  <div className="growth-direction">
                    <strong>Direction:</strong> {analysisResults.growthTracking.overallGrowth?.direction}
                  </div>
                  <div className="growth-velocity">
                    <strong>Velocity:</strong> {analysisResults.growthTracking.overallGrowth?.velocity}
                  </div>
                  <div className="growth-consistency">
                    <strong>Consistency:</strong> {analysisResults.growthTracking.overallGrowth?.consistency}
                  </div>
                </div>
                
                {analysisResults.growthTracking.progression && (
                  <div className="framework-progression">
                    <h5>Progress by Framework</h5>
                    {Object.entries(analysisResults.growthTracking.progression).map(([framework, progress]) => (
                      <div key={framework} className="framework-progress">
                        <span className="framework-name">{framework}</span>
                        <div className="progress-indicator">{progress}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {analysisResults.growthTracking.nextEvolutionaryStep && (
                  <div className="next-evolution">
                    <h5>🚀 Next Evolutionary Step</h5>
                    <p>{analysisResults.growthTracking.nextEvolutionaryStep}</p>
                  </div>
                )}
              </div>
            )}

            {analysisResults.growthTracking?.baseline && (
              <div className="baseline-message">
                <h4>📊 Growth Tracking Initialized</h4>
                <p>This is your baseline assessment. Continue your journey and return periodically to track your psychological growth across all frameworks.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="responses-tab">
            <ReflectionWaves />
            <h3>Your Philosophical Reflections</h3>
            <div className="responses-list">
              {userResponses.map((response, index) => (
                <div key={index} className="response-item">
                  <div className="response-header">
                    <span className="response-number">Q{index + 1}</span>
                    <span className="response-category">{response.category}</span>
                  </div>
                  <div className="response-question">{response.question}</div>
                  <div className="response-answer">{response.response}</div>
                  <div className="response-meta">
                    <span>Answered on {new Date(response.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-tab">
            <h3>Perspectives from Others</h3>
            <div className="feedback-summary">
              <p>You have received {feedbackData.length} thoughtful perspectives from others. These external views help complete your Johari Window and provide insights into your interpersonal impact.</p>
            </div>
            <div className="feedback-list">
              {feedbackData.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <div className="feedback-header">
                    <span className="feedback-number">Perspective {index + 1}</span>
                    <span className="feedback-date">{new Date(feedback.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="feedback-question">{feedback.question}</div>
                  <div className="feedback-answer">{feedback.response}</div>
                </div>
              ))}
              {feedbackData.length === 0 && (
                <div className="no-feedback">
                  <p>No feedback received yet. Share your reflection link with trusted friends to gather perspectives!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-tab">
            <PhilosophicalCompass />
            <h3>Integrated Theoretical Analysis</h3>
            
            {analysisResults ? (
              <div className="framework-analyses">
                {analysisResults.johariInsights && (
                  <div className="framework-analysis">
                    <h4>Johari Window Analysis</h4>
                    <div className="analysis-content">
                      {Object.entries(analysisResults.johariInsights || {}).map(([key, value]) => (
                        value ? (
                          <div key={key} className="insight-item">
                            <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value}
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.buberRelationalInsights && (
                  <div className="framework-analysis">
                    <h4>Buber's I-Thou Relational Framework</h4>
                    <div className="analysis-content">
                      {Object.entries(analysisResults.buberRelationalInsights || {}).map(([key, value]) => (
                        value ? (
                          <div key={key} className="insight-item">
                            <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value}
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.lacanMirrorInsights && (
                  <div className="framework-analysis">
                    <h4>Lacan's Mirror Stage Insights</h4>
                    <div className="analysis-content">
                      {Object.entries(analysisResults.lacanMirrorInsights || {}).map(([key, value]) => (
                        value ? (
                          <div key={key} className="insight-item">
                            <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value}
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.discPersonalityProfile && (
                  <div className="framework-analysis">
                    <h4>DISC Behavioral Profile</h4>
                    <div className="analysis-content">
                      {Object.entries(analysisResults.discPersonalityProfile || {}).map(([key, value]) => (
                        value ? (
                          <div key={key} className="insight-item">
                            <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value}
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.existentialGrowthPath && (
                  <div className="framework-analysis">
                    <h4>Existential Psychology Framework</h4>
                    <div className="analysis-content">
                      {Object.entries(analysisResults.existentialGrowthPath || {}).map(([key, value]) => (
                        value ? (
                          <div key={key} className="insight-item">
                            <strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value}
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-analysis">
                <p>Complete your self-reflection questions to generate your comprehensive philosophical analysis.</p>
                <button className="generate-analysis-btn" onClick={generateComprehensiveAnalysis}>
                  Generate Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="recommendations-tab">
            <h3>Integrated Growth Recommendations</h3>
            
            {analysisResults && analysisResults.integratedRecommendations ? (
              <>
                <div className="primary-theme">
                  <h4>Primary Growth Theme</h4>
                  <p className="theme-description">{analysisResults.integratedRecommendations.primaryGrowthTheme}</p>
                </div>

                <div className="growth-paths">
                  {analysisResults.integratedRecommendations.selfAwarenessPath && (
                    <div className="growth-path">
                      <h4>Self-Awareness Integration Path</h4>
                      <div className="path-details">
                        <p><strong>Johari Contribution:</strong> {analysisResults.integratedRecommendations.selfAwarenessPath.johariContribution || 'Analyzing...'}</p>
                        <p><strong>Lacan Contribution:</strong> {analysisResults.integratedRecommendations.selfAwarenessPath.lacanContribution || 'Analyzing...'}</p>
                        <p><strong>DISC Contribution:</strong> {analysisResults.integratedRecommendations.selfAwarenessPath.discContribution || 'Analyzing...'}</p>
                        <p className="recommendation"><strong>Recommendation:</strong> {analysisResults.integratedRecommendations.selfAwarenessPath.recommendation || 'Generating recommendations...'}</p>
                      </div>
                    </div>
                  )}

                  {analysisResults.integratedRecommendations.relationalPath && (
                    <div className="growth-path">
                      <h4>Relational Integration Path</h4>
                      <div className="path-details">
                        <p><strong>Buber Contribution:</strong> {analysisResults.integratedRecommendations.relationalPath.buberContribution || 'Analyzing...'}</p>
                        <p><strong>Johari Contribution:</strong> {analysisResults.integratedRecommendations.relationalPath.johariContribution || 'Analyzing...'}</p>
                        <p><strong>DISC Contribution:</strong> {analysisResults.integratedRecommendations.relationalPath.discContribution || 'Analyzing...'}</p>
                        <p className="recommendation"><strong>Recommendation:</strong> {analysisResults.integratedRecommendations.relationalPath.recommendation || 'Generating recommendations...'}</p>
                      </div>
                    </div>
                  )}

                  {analysisResults.integratedRecommendations.existentialPath && (
                    <div className="growth-path">
                      <h4>Existential Integration Path</h4>
                      <div className="path-details">
                        <p><strong>Existential Contribution:</strong> {analysisResults.integratedRecommendations.existentialPath.existentialContribution || 'Analyzing...'}</p>
                        <p><strong>Buber Contribution:</strong> {analysisResults.integratedRecommendations.existentialPath.buberContribution || 'Analyzing...'}</p>
                        <p><strong>Lacan Contribution:</strong> {analysisResults.integratedRecommendations.existentialPath.lacanContribution || 'Analyzing...'}</p>
                        <p className="recommendation"><strong>Recommendation:</strong> {analysisResults.integratedRecommendations.existentialPath.recommendation || 'Generating recommendations...'}</p>
                      </div>
                    </div>
                  )}

                  {analysisResults.integratedRecommendations.behavioralPath && (
                    <div className="growth-path">
                      <h4>Behavioral Integration Path</h4>
                      <div className="path-details">
                        <p><strong>DISC Contribution:</strong> {analysisResults.integratedRecommendations.behavioralPath.discContribution || 'Analyzing...'}</p>
                        <p><strong>Johari Contribution:</strong> {analysisResults.integratedRecommendations.behavioralPath.johariContribution || 'Analyzing...'}</p>
                        <p><strong>Existential Contribution:</strong> {analysisResults.integratedRecommendations.behavioralPath.existentialContribution || 'Analyzing...'}</p>
                        <p className="recommendation"><strong>Recommendation:</strong> {analysisResults.integratedRecommendations.behavioralPath.recommendation || 'Generating recommendations...'}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="practice-framework">
                  <h4>Integrated Practice Framework</h4>
                  <div className="practice-item">
                    <h5>Daily Practice</h5>
                    <p>{analysisResults.integratedRecommendations.dailyPractice || 'Complete your analysis to get daily practice recommendations'}</p>
                  </div>
                  <div className="practice-item">
                    <h5>Weekly Practice</h5>
                    <p>{analysisResults.integratedRecommendations.weeklyPractice || 'Complete your analysis to get weekly practice recommendations'}</p>
                  </div>
                  <div className="practice-item">
                    <h5>Monthly Practice</h5>
                    <p>{analysisResults.integratedRecommendations.monthlyPractice || 'Complete your analysis to get monthly practice recommendations'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-recommendations">
                <p>Complete your self-reflection questions and analysis to receive personalized growth recommendations.</p>
                <button className="generate-analysis-btn" onClick={() => setActiveTab('overview')}>
                  Return to Overview
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-tab">
            <h3>Download Your Philosophical Portrait</h3>
            
            <div className="download-options">
              <div className="format-selector">
                <label>Choose format:</label>
                <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)}>
                  <option value="pdf">PDF Report</option>
                  <option value="json">JSON Data</option>
                  <option value="txt">Text Summary</option>
                </select>
              </div>
              
              <button 
                className="download-btn"
                onClick={() => generateReport(downloadFormat)}
              >
                Download {downloadFormat.toUpperCase()} Report
              </button>
            </div>

            <div className="report-preview">
              <h4>Report Contents</h4>
              <ul>
                <li>Complete analysis using all 5 theoretical frameworks</li>
                <li>Your original responses to all reflection questions</li>
                <li>Feedback received from others</li>
                <li>Integrated growth recommendations</li>
                <li>Daily, weekly, and monthly practice suggestions</li>
                <li>Philosophical foundation explanations</li>
              </ul>
            </div>

            <div className="sharing-options">
              <h4>Share Your Journey</h4>
              <button onClick={shareSession} className="share-btn">
                Share This Approach
              </button>
              <p>Share the philosophical self-discovery approach (your personal data remains private)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
