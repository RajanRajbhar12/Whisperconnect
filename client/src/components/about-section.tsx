const AboutSection = () => {
  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-[#424242] text-center">
          About Whisper
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Two people connecting through conversation" 
              className="rounded-xl shadow-md w-full"
            />
          </div>
          
          <div className="md:w-1/2">
            <p className="text-[#424242]/80 mb-4 leading-relaxed">
              Whisper is not about dating, swiping, or judgment. It's about human presence, even for a few minutes.
            </p>
            
            <p className="text-[#424242]/80 mb-4 leading-relaxed">
              In a world full of social media, we've never felt more disconnected. Whisper offers a simple way to connect with another person who's feeling the same way you are.
            </p>
            
            <p className="text-[#424242]/80 leading-relaxed">
              When life gets too loud, just whisper.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
