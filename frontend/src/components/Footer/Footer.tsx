import FooterBrand from './FooterBrand';
import FooterColumn from './FooterColumn';
import { footerColumns } from './footerLinks';

const Footer = () => (
  <footer className="relative overflow-hidden py-8 sm:py-12 bg-beige-100/50 backdrop-blur-md border-t border-silver-200 mt-12">
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
        <FooterBrand />
        {footerColumns.map((column) => (
          <FooterColumn key={column.title} title={column.title} links={column.links} wide={column.title === 'Legal'} />
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
