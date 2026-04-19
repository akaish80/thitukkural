import { Container } from '../../../Common/common.styles';
import VirtualKeyboard from '../../../components/VirtualKeyboard/VirtualKeyboard';
import './free.type.scss';

const FreeType = () => {
  return (
    <Container>
      <div className="free-type-container">
        <div className="header-section">
          <h2>தமிழ் தட்டச்சு — Tamil Free-Type</h2>
          <p className="subtitle">Click any key to build words; edit freely in the text area.</p>
        </div>

        <div className="free-type-section">
          <VirtualKeyboard />
        </div>

        <div className="tips-section">
          <h4>Tips</h4>
          <ul>
            <li>Click any key to build words; edit freely in the text area.</li>
            <li>Hover a key to see its romanisation.</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default FreeType;
