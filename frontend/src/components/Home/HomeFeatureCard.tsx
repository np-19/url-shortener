interface HomeFeatureCardProps {
  accent: string;
  description: string;
  icon: React.ReactNode;
  ring: string;
  title: string;
}

const HomeFeatureCard = ({ accent, description, icon, ring, title }: HomeFeatureCardProps) => (
  <div className="group glass-panel w-full rounded-3xl border border-white/70 bg-white/75 p-5 sm:p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(17,24,39,0.28)]">
    <div className="flex items-start gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${accent} ring-1 ${ring} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-base sm:text-lg font-bold text-silver-800">{title}</h4>
          <span className="hidden sm:inline-flex h-2.5 w-2.5 rounded-full bg-silver-300 transition-colors group-hover:bg-silver-500" />
        </div>
        <p className="mt-2 max-w-md text-sm sm:text-base leading-relaxed text-silver-500">{description}</p>
      </div>
    </div>
  </div>
);

export default HomeFeatureCard;
