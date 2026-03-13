import React from 'react';

const IntroSection: React.FC = () => (
  <div
    className="thirukurral-intro"
    style={{
      margin: '1.5rem 0',
      background: '#f7fafc',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}
  >
    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.7rem', color: '#3182ce' }}>
      திருக்குறள் பற்றி
    </h2>
    <p style={{ fontSize: '1.1rem', color: '#374151', lineHeight: 1.8 }}>
      திருக்குறள் என்பது தமிழில் எழுதப்பட்ட ஒரு உலகப்புகழ் பெற்ற நூலாகும். இதை திருவள்ளுவர்
      இயற்றினார். இதில் 1330 குறள்கள் 133 அதிகாரங்களில் தொகுக்கப்பட்டுள்ளன. ஒவ்வொரு குறளும்
      வாழ்வியல், அறம், பொருள், இன்பம் ஆகியவற்றை மிகச் சிறப்பாக எடுத்துரைக்கின்றன. திருக்குறள்
      உலகின் பல மொழிகளில் மொழிபெயர்க்கப்பட்டு, மனித வாழ்வின் ஒழுக்கத்தையும், சமூக நலனையும்
      வலியுறுத்தும் நூலாக விளங்குகிறது.
    </p>
  </div>
);

export default IntroSection;
