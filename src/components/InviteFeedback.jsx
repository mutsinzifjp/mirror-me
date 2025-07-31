import React, { useState } from 'react';
import { MirrorSymbol, ReflectionWaves } from './PhilosophicalVisuals';

const InviteFeedback = ({ userProfile, sessionId }) => {
  const [shareMethod, setShareMethod] = useState('link');
  const [copied, setCopied] = useState(false);

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/feedback/${sessionId}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareableLink()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = `${userProfile.name || 'Someone'} has invited you to share your perspective in a philosophical mirror exercise. Your thoughtful reflection will help them understand how they are experienced by others. This is about authentic human connection and mutual understanding.`;

  return (
    <div className="invite-feedback">
      <div className="invite-header">
        <MirrorSymbol />
        <h2>Invite Trusted Perspectives</h2>
        <p>
          The mirror of self-knowledge requires the gift of another's honest perspective. 
          Choose people who see you clearly and care enough to speak truthfully.
        </p>
      </div>

      <div className="invitation-methods">
        <div className="method-selector">
          <button 
            className={shareMethod === 'link' ? 'active' : ''}
            onClick={() => setShareMethod('link')}
          >
            Share Link
          </button>
          <button 
            className={shareMethod === 'message' ? 'active' : ''}
            onClick={() => setShareMethod('message')}
          >
            Personal Message
          </button>
        </div>

        {shareMethod === 'link' && (
          <div className="link-share">
            <div className="share-link-container">
              <input 
                type="text" 
                value={generateShareableLink()} 
                readOnly 
                className="share-link"
              />
              <button 
                onClick={copyToClipboard}
                className="copy-btn"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="share-options">
              <p>Share this link with people whose perspective you value:</p>
              <div className="quick-share">
                <button onClick={() => window.open(`mailto:?subject=Your perspective is invited&body=${shareText}%0A%0A${generateShareableLink()}`)}>
                  Email
                </button>
                <button onClick={() => window.open(`sms:?body=${shareText} ${generateShareableLink()}`)}>
                  Text Message
                </button>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + generateShareableLink())}`)}>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {shareMethod === 'message' && (
          <div className="message-share">
            <div className="message-template">
              <h4>Personal Invitation Template:</h4>
              <textarea 
                value={`Dear [Name],

I'm exploring a philosophical exercise about self-awareness and would deeply value your perspective. It's based on the idea that we see ourselves differently than others see us, and both views are important for growth.

Would you be willing to share your honest, caring observations about how you experience me? The questions are designed to invite thoughtful reflection rather than simple judgments.

Your perspective would mean a lot to me in this journey of understanding.

${generateShareableLink()}

Thank you for considering this.`}
                readOnly
                rows={12}
                className="message-template-text"
              />
            </div>
            <button onClick={copyToClipboard} className="copy-message-btn">
              {copied ? 'Copied!' : 'Copy Message'}
            </button>
          </div>
        )}
      </div>

      <div className="invitation-guidance">
        <ReflectionWaves />
        <h3>Who to Invite</h3>
        <div className="guidance-cards">
          <div className="guidance-card">
            <h4>Close Friends</h4>
            <p>Those who have observed you across different contexts and moods</p>
          </div>
          <div className="guidance-card">
            <h4>Family Members</h4>
            <p>People who have known you over time and seen your growth</p>
          </div>
          <div className="guidance-card">
            <h4>Trusted Colleagues</h4>
            <p>Those who interact with you professionally and can speak to your impact</p>
          </div>
          <div className="guidance-card">
            <h4>Mentors or Guides</h4>
            <p>People whose wisdom and perspective you particularly value</p>
          </div>
        </div>
      </div>

      <div className="philosophical-context">
        <h3>The Philosophy Behind This</h3>
        <blockquote>
          "The I-Thou relationship reveals aspects of ourselves that remain hidden in isolation. 
          Through the authentic encounter with another, we discover dimensions of our being 
          that exist only in relationship." - Martin Buber
        </blockquote>
        <p>
          This exercise honors both your self-knowledge and the wisdom that emerges 
          through genuine relationship. It's not about judgment, but about the gift 
          of seeing yourself through caring eyes.
        </p>
      </div>
    </div>
  );
};

export default InviteFeedback;
