import { Link } from 'react-router-dom';
import PageTitle from '../PageTitle';

const UnitNotFound = () => {
  return (
    <div className="learn-tamil-unit-page">
      <PageTitle title="Unit Not Found" path="/learn-tamil" />
      <p>Sorry, this unit could not be found.</p>
      <Link to="/learn-tamil">Back to Chapters</Link>
    </div>
  );
};

export default UnitNotFound;
