export default function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={className}>
      <div className="w-12 h-1 bg-red-600 mb-6"></div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
        {title}
      </h1>
      <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
        {subtitle}
      </p>
    </div>
  );
}
