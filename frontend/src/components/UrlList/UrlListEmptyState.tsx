import { Link } from 'react-router-dom';
import Button from '../Button';

interface UrlListEmptyStateProps {
  description: string;
  title: string;
  showButton?: boolean;
}

const UrlListEmptyState = ({ description, title, showButton = false }: UrlListEmptyStateProps) => (
  <div className="rounded-[2.5rem] border border-white bg-white/60 py-20 text-center backdrop-blur-md shadow-soft">
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-silver-200 bg-beige-50 shadow-inner">
      <svg className="h-10 w-10 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </div>
    <h3 className="mt-4 text-xl font-bold text-silver-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-sm text-base text-silver-500 mb-6">{description}</p>
    {showButton && (
      <Link to="/">
        <Button className="px-6 py-2">Create short link</Button>
      </Link>
    )}
  </div>
);

export default UrlListEmptyState;
