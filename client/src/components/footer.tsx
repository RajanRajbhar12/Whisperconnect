const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-[#EAEAEA]/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center text-[#424242]/70 text-sm">
          <p className="mb-2">
            Whisper is not about dating, swiping, or judgment.<br />
            It's about human presence, even for a few minutes.<br />
            When life gets too loud, just whisper.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Whisper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
