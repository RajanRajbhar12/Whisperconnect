const FAQSection = () => {
  return (
    <section id="faq" className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-[#424242] text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-lg mb-2 text-[#424242]">Is Whisper completely anonymous?</h3>
            <p className="text-[#424242]/80">Yes, Whisper doesn't collect any personal information. It's just a voice connection with someone feeling the same way you do.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-lg mb-2 text-[#424242]">How does the matching work?</h3>
            <p className="text-[#424242]/80">We match you with someone who selected the same mood. It's that simple. When there's a match, you're both connected to a voice call.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-lg mb-2 text-[#424242]">Is there a time limit for calls?</h3>
            <p className="text-[#424242]/80">There's no set time limit. You can talk as long as you both want, and either person can end the call at any time.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-lg mb-2 text-[#424242]">What if I experience inappropriate behavior?</h3>
            <p className="text-[#424242]/80">You can end the call at any time. While we can't monitor conversations, we encourage reporting any issues through our contact page.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
