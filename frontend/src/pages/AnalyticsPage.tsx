import { AnalyticsDashboard } from '../components';
import Container from '../components/Container/Container';

const AnalyticsPage = () => {
  return (
    <Container>
      <div className="py-8 sm:py-12">
        <AnalyticsDashboard />
      </div>
    </Container>
  );
};

export default AnalyticsPage;
