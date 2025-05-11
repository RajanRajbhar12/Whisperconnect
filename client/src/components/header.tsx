import { Link } from "wouter";

const Header = () => {
  return (
    <header className="py-6 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-medium text-[#424242] flex items-center">
          <span className="text-[hsl(var(--whisper-blue))]">🌿</span>&nbsp;Whisper
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#about" className="text-[#424242] hover:text-[hsl(var(--whisper-blue))] transition-colors text-sm">
                About
              </a>
            </li>
            <li>
              <a href="#faq" className="text-[#424242] hover:text-[hsl(var(--whisper-blue))] transition-colors text-sm">
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
