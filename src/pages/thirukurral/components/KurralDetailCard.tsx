import React from 'react';
import { KurralData } from 'types';
// import { Kurral } from '../thirukurral.component';

interface KurralDetailCardProps {
  kurral: KurralData;
}

const KurralDetailCard: React.FC<KurralDetailCardProps> = ({ kurral }) => (
  <div className="kurral-details-card">
    <p className="kurral-title">குறள் - {kurral.Index}</p>
    <p className="kurral-tamil" dangerouslySetInnerHTML={{ __html: kurral.Tamil }} />
    <div className="urai-section">
      <p className="urai-title">மு.வ உரை</p>
      <p className="urai-text" dangerouslySetInnerHTML={{ __html: kurral.MuVaUrai }} />
      <p className="urai-title">சாலமன் பாப்பையா உரை</p>
      <p className="urai-text" dangerouslySetInnerHTML={{ __html: kurral.SolomonPaapaiyaUrai }} />
      <p className="urai-title">கலைஞர் உரை</p>
      <p className="urai-text" dangerouslySetInnerHTML={{ __html: kurral.KalaignarUrai }} />
    </div>
  </div>
);

export default KurralDetailCard;
