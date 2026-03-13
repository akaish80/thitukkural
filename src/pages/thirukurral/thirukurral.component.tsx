
import { Container } from '../../Common/common.styles';
import adikaram from '../../Common/adikaram_data';
import paalList from '../../Common/paalList_data';
import kurralData from '../../Common/kurral_data.with_adikaram.json';
import AdhikaramListView from '../../components/organism/AdhikaramListView/AdhikaramListView';
import PaalListDataView from '../../components/organism/PaalListView/PaalListView';
import KurralDetailView from '../../components/organism/KurralDetailView/KurralDetailView';
import './thirukurral.styles.scss';
import IntroSection from './components/IntroSection';


const Thirukkural = () => {
  // Use imported data directly for demo purposes
  return (
    <Container>
      <div
        className="thirukurral-page"
        style={{
          fontFamily: "'Noto Sans Tamil', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'",
        }}
      >
        <h1 className="page-title">திருக்குறள் பட்டியல்</h1>
        <IntroSection />
        <div className="listing-sections">
          <div className="section paal-section">
            <h2 className="section-title">பால் வகைகள்</h2>
            <div className="section-content">
              <PaalListDataView data={paalList} selectedId={-1} handleListClick={() => {}} />
            </div>
          </div>
          <div className="section adikaram-section">
            <h2 className="section-title">அதிகாரங்கள்</h2>
            <div className="section-content">
              <AdhikaramListView data={adikaram} selectedId={-1} handleListClick={() => {}} />
            </div>
          </div>
          <div className="section kurral-section">
            <h2 className="section-title">குறள்</h2>
            <div className="section-content">
              <KurralDetailView kurralList={kurralData} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Thirukkural;
