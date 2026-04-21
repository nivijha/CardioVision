import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/predict', label: 'Analysis' },
  { path: '/results', label: 'Results' },
  { path: '/research', label: 'Research' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between py-4 md:h-16 md:py-0">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/heart-icon.png" alt="CardioVision Heart" className="w-8 h-8 object-contain" />
              <span className="text-base font-bold tracking-tight text-gray-900 uppercase">
                CardioVision
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-wide transition-colors flex items-center md:h-full md:border-b-2 ${
                    isActive
                      ? 'border-red-600 text-red-600 font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
