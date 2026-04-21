export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex-1 text-left">
            © {currentYear} CardioVision
          </div>
          <div className="flex-1 text-center font-medium">
            Developed for academic research purposes
          </div>
          <div className="flex-1 text-right">
            YOLOv8-based CAD system
          </div>
        </div>
      </div>
    </footer>
  );
}
