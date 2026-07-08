import { Link } from 'react-router-dom';
import Button from '../Button';

interface UrlListEmptyStateProps {
  description: string;
  title: string;
  showButton?: boolean;
}

const UrlListEmptyState = ({ description, title, showButton = false }: UrlListEmptyStateProps) => (
  <div className="rounded-2xl border border-silver-200 bg-white/70 py-16 text-center backdrop-blur-sm shadow-xs">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-silver-150 bg-silver-50 text-silver-400">
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-silver-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm text-silver-500 mb-6">{description}</p>
    {showButton && (
      <div className="flex justify-center">
        <Link to="/">
          <Button className="px-6 py-2.5 text-sm font-bold shadow-xs">Create short link</Button>
        </Link>
      </div>
    )}
  </div>
);

export default UrlListEmptyState;
