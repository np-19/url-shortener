import Logo from '../Logo';

const FooterBrand = () => (
  <div className="sm:col-span-2 lg:col-span-5">
    <div className="flex h-full flex-col justify-between">
      <div className="mb-4 inline-flex items-center">
        <Logo width="120px" variant="text" />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-silver-500">
          &copy; Copyright 2026. All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
);

export default FooterBrand;
