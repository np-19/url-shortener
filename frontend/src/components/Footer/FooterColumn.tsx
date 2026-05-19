import { Link } from 'react-router-dom';

interface FooterColumnProps {
  links: string[];
  title: string;
  wide?: boolean;
}

const FooterColumn = ({ links, title, wide = false }: FooterColumnProps) => (
  <div className={wide ? 'lg:col-span-3' : 'lg:col-span-2'}>
    <div className="h-full">
      <h3 className="mb-4 sm:mb-6 text-xs font-semibold uppercase text-silver-800 tracking-wider">{title}</h3>
      <ul className="space-y-2 sm:space-y-3">
        {links.map((label) => (
          <li key={label}>
            <Link className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors" to="/">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default FooterColumn;
