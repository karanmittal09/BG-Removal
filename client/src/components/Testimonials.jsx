import { testimonialsData } from "../assets/assets";

const Testimonials = () => {
  return (
    <div className="mx-4 lg:mx-44 py-16">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text mb-4">
          What Our Users Say
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied users who trust our AI-powered background removal tool.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
        {testimonialsData.map((item, index) => (
          <div 
            className='relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group' 
            key={index}
          >
            {/* Quote icon */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>

            {/* Content */}
            <div className="pt-4">
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{item.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    className='w-12 h-12 rounded-full object-cover border-2 border-gray-200' 
                    src={item.image} 
                    alt={item.author} 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.author}</p>
                  <p className="text-sm text-gray-500">{item.jobTitle}</p>
                </div>
              </div>
            </div>

            {/* Star rating */}
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 mb-8">Trusted by professionals worldwide</p>
        <div className="flex justify-center items-center gap-8 opacity-60">
          <div className="text-2xl font-bold text-gray-400">Adobe</div>
          <div className="text-2xl font-bold text-gray-400">Shopify</div>
          <div className="text-2xl font-bold text-gray-400">Canva</div>
          <div className="text-2xl font-bold text-gray-400">Figma</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
