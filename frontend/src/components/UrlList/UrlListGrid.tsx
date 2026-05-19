import type { UrlItem } from '../../services';
import UrlListCard from './UrlListCard';

interface UrlListGridProps {
  onCopy: (text: string) => void;
  urls: UrlItem[];
}

const UrlListGrid = ({ onCopy, urls }: UrlListGridProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {urls.map((url) => (
      <UrlListCard key={url._id} url={url} onCopy={onCopy} />
    ))}
  </div>
);

export default UrlListGrid;
