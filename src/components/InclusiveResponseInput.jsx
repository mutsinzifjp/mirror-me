import React, { useState, useEffect } from 'react';
import EmotionalIntelligenceEngine from '../services/EmotionalIntelligenceEngine';

/**
 * Inclusive Response Input - supports multiple ways of expressing thoughts and feelings
 * Designed for users with varying language fluency, emotional states, and expression preferences
 */
const InclusiveResponseInput = ({ 
  question, 
  onResponse, 
  placeholder = "Share whatever feels true...",
  supportMultiLanguage = true 
}) => {
  const [response, setResponse] = useState('');
  const [inputMode, setInputMode] = useState('text'); // text, emotion, guided, minimal
  const [emotionalState, setEmotionalState] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [selectedPhrases, setSelectedPhrases] = useState([]);
  const [startTime] = useState(Date.now());
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const emotionEngine = new EmotionalIntelligenceEngine();

  // Emotion wheel for non-verbal expression
  const emotionWheel = {
    joy: { emoji: '😊', color: '#FFD700', intensity: [1, 2, 3, 4, 5] },
    sadness: { emoji: '😢', color: '#4682B4', intensity: [1, 2, 3, 4, 5] },
    anger: { emoji: '😡', color: '#DC143C', intensity: [1, 2, 3, 4, 5] },
    fear: { emoji: '😨', color: '#8A2BE2', intensity: [1, 2, 3, 4, 5] },
    love: { emoji: '❤️', color: '#FF69B4', intensity: [1, 2, 3, 4, 5] },
    confusion: { emoji: '🤔', color: '#808080', intensity: [1, 2, 3, 4, 5] },
    peace: { emoji: '😌', color: '#98FB98', intensity: [1, 2, 3, 4, 5] },
    excitement: { emoji: '🤩', color: '#FF4500', intensity: [1, 2, 3, 4, 5] }
  };

  // Sentence starters for different emotional states
  const sentenceStarters = {
    feeling: [
      "I feel...",
      "Right now I'm...",
      "In my heart...",
      "Something in me...",
      "I notice..."
    ],
    thinking: [
      "I think...",
      "It seems like...",
      "I wonder if...",
      "Maybe...",
      "I'm realizing..."
    ],
    relationship: [
      "With others, I...",
      "In relationships...",
      "When someone...",
      "People make me...",
      "I connect by..."
    ],
    struggle: [
      "What's hard is...",
      "I struggle with...",
      "It hurts when...",
      "I can't seem to...",
      "The difficult part..."
    ],
    growth: [
      "I'm learning...",
      "I want to...",
      "I hope...",
      "I'm growing by...",
      "I dream of..."
    ]
  };

  // Quick response options for low-energy moments
  const quickResponses = [
    "Not ready to share",
    "It's complicated",
    "I don't know",
    "Too much to say",
    "Need time to think",
    "Feeling overwhelmed",
    "Can't find words",
    "Everything",
    "Nothing specific",
    "Mixed feelings"
  ];

  // Auto-encouragement based on time spent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!response && !selectedEmojis.length && !selectedPhrases.length) {
        setShowEncouragement(true);
      }
    }, 15000); // Show after 15 seconds

    return () => clearTimeout(timer);
  }, [response, selectedEmojis, selectedPhrases]);

  const handleTextChange = (text) => {
    setResponse(text);
    setShowEncouragement(false);
  };

  const handleEmojiSelect = (emotion, intensity) => {
    const emojiData = { emotion, intensity, emoji: emotionWheel[emotion].emoji };
    setSelectedEmojis(prev => [...prev.filter(e => e.emotion !== emotion), emojiData]);
    setEmotionalState({ dominant: emotion, intensity });
  };

  const handlePhraseSelect = (phrase) => {
    if (selectedPhrases.includes(phrase)) {
      setSelectedPhrases(prev => prev.filter(p => p !== phrase));
    } else {
      setSelectedPhrases(prev => [...prev, phrase]);
    }
  };

  const handleSentenceStarter = (starter) => {
    setResponse(prev => prev ? `${prev} ${starter}` : starter);
    setInputMode('text');
  };

  const handleQuickResponse = (quickResponse) => {
    setResponse(quickResponse);
  };

  const translateText = async (text, targetLang) => {
    if (!text || targetLang === 'en') return text;
    
    setIsTranslating(true);
    try {
      // Simulated translation - in real app, use Google Translate API
      // For demo, we'll just return the original text
      setIsTranslating(false);
      return text;
    } catch (error) {
      console.error('Translation failed:', error);
      setIsTranslating(false);
      return text;
    }
  };

  const compileResponse = () => {
    let compiledResponse = response;
    
    // Add emoji expressions
    if (selectedEmojis.length > 0) {
      const emojiText = selectedEmojis
        .map(e => `${e.emoji} (feeling ${e.emotion} - level ${e.intensity})`)
        .join(', ');
      compiledResponse += compiledResponse ? `\n\nEmotions: ${emojiText}` : `Emotions: ${emojiText}`;
    }
    
    // Add selected phrases
    if (selectedPhrases.length > 0) {
      const phrasesText = selectedPhrases.join(', ');
      compiledResponse += compiledResponse ? `\n\nAlso: ${phrasesText}` : `Selected: ${phrasesText}`;
    }
    
    return compiledResponse;
  };

  const handleSubmit = async () => {
    const finalResponse = compileResponse();
    const timeTaken = Date.now() - startTime;
    
    // Analyze the response for emotional intelligence
    const analysis = emotionEngine.analyzeResponse(finalResponse, {
      timeTaken,
      inputMode,
      selectedEmojis,
      selectedPhrases,
      language
    });

    // Translate if needed
    const translatedResponse = await translateText(finalResponse, 'en');

    onResponse({
      response: finalResponse,
      translatedResponse,
      analysis,
      metadata: {
        timeTaken,
        inputMode,
        emotionalState,
        language,
        multiModal: selectedEmojis.length > 0 || selectedPhrases.length > 0
      }
    });
  };

  const canSubmit = () => {
    return response.trim() || selectedEmojis.length > 0 || selectedPhrases.length > 0;
  };

  return (
    <div className="inclusive-response-input">
      {/* Input Mode Selector */}
      <div className="input-mode-selector">
        <button 
          className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => setInputMode('text')}
          title="Type your response"
        >
          ✍️ Write
        </button>
        <button 
          className={`mode-btn ${inputMode === 'emotion' ? 'active' : ''}`}
          onClick={() => setInputMode('emotion')}
          title="Express with emotions"
        >
          😊 Feel
        </button>
        <button 
          className={`mode-btn ${inputMode === 'guided' ? 'active' : ''}`}
          onClick={() => setInputMode('guided')}
          title="Use sentence starters"
        >
          💭 Guide
        </button>
        <button 
          className={`mode-btn ${inputMode === 'minimal' ? 'active' : ''}`}
          onClick={() => setInputMode('minimal')}
          title="Quick responses"
        >
          ⚡ Quick
        </button>
      </div>

      {/* Language Selector */}
      {supportMultiLanguage && (
        <div className="language-selector">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-dropdown"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
            <option value="ar">العربية</option>
            <option value="zh">中文</option>
            <option value="hi">हिन्दी</option>
            <option value="sw">Kiswahili</option>
          </select>
        </div>
      )}

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="text-input-section">
          <textarea
            value={response}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            className="response-textarea"
            rows={4}
            style={{ 
              resize: 'vertical',
              border: showEncouragement ? '2px solid var(--theme-accent)' : '1px solid var(--theme-border)'
            }}
          />
          
          {showEncouragement && (
            <div className="encouragement-message">
              <p>💫 Take your time. Even one word matters.</p>
              <p>Try: How does this question make you feel? Or just share whatever comes to mind.</p>
            </div>
          )}
        </div>
      )}

      {/* Emotion Wheel Mode */}
      {inputMode === 'emotion' && (
        <div className="emotion-wheel-section">
          <p className="emotion-instruction">Tap emotions that feel true right now:</p>
          <div className="emotion-grid">
            {Object.entries(emotionWheel).map(([emotion, data]) => (
              <div key={emotion} className="emotion-item">
                <div className="emotion-name">{emotion}</div>
                <div className="emotion-selector">
                  <span className="emotion-emoji">{data.emoji}</span>
                  <div className="intensity-slider">
                    {data.intensity.map(level => (
                      <button
                        key={level}
                        className={`intensity-btn ${
                          selectedEmojis.find(e => e.emotion === emotion && e.intensity === level) 
                            ? 'selected' : ''
                        }`}
                        onClick={() => handleEmojiSelect(emotion, level)}
                        style={{ backgroundColor: data.color, opacity: level / 5 }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedEmojis.length > 0 && (
            <div className="selected-emotions">
              <p>Your emotional expression:</p>
              <div className="emotion-summary">
                {selectedEmojis.map((e, index) => (
                  <span key={index} className="emotion-tag">
                    {e.emoji} {e.emotion} ({e.intensity}/5)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guided Input Mode */}
      {inputMode === 'guided' && (
        <div className="guided-input-section">
          <p className="guidance-instruction">Choose a way to start, then continue however feels right:</p>
          
          {Object.entries(sentenceStarters).map(([category, starters]) => (
            <div key={category} className="starter-category">
              <h4 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="starters-grid">
                {starters.map((starter, index) => (
                  <button
                    key={index}
                    className="starter-btn"
                    onClick={() => handleSentenceStarter(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {response && (
            <div className="guided-response-preview">
              <textarea
                value={response}
                onChange={(e) => handleTextChange(e.target.value)}
                className="guided-textarea"
                placeholder="Continue your thought..."
                rows={3}
              />
            </div>
          )}
        </div>
      )}

      {/* Minimal/Quick Response Mode */}
      {inputMode === 'minimal' && (
        <div className="minimal-input-section">
          <p className="minimal-instruction">Sometimes a simple response is perfect:</p>
          
          <div className="quick-responses-grid">
            {quickResponses.map((quickResponse, index) => (
              <button
                key={index}
                className={`quick-response-btn ${response === quickResponse ? 'selected' : ''}`}
                onClick={() => handleQuickResponse(quickResponse)}
              >
                {quickResponse}
              </button>
            ))}
          </div>
          
          <div className="phrase-selection">
            <p>Or tap any that feel true:</p>
            <div className="phrases-grid">
              {[
                "I'm processing", "It's complex", "Feeling stuck", "Growing edge", 
                "Deep truth", "Sacred space", "Gentle with myself", "Still learning",
                "Raw and real", "Finding words", "Heart knows", "Trust process"
              ].map((phrase, index) => (
                <button
                  key={index}
                  className={`phrase-btn ${selectedPhrases.includes(phrase) ? 'selected' : ''}`}
                  onClick={() => handlePhraseSelect(phrase)}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Response Preview */}
      {canSubmit() && (
        <div className="response-preview">
          <h4>Your response:</h4>
          <div className="preview-content">
            {compileResponse()}
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="submit-section">
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!canSubmit() || isTranslating}
        >
          {isTranslating ? 'Processing...' : 'Share Your Truth'}
        </button>
        
        <p className="submit-encouragement">
          Every response is valued. Your truth matters, however you choose to share it.
        </p>
      </div>
    </div>
  );
};

export default InclusiveResponseInput;
