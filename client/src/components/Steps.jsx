
import { assets } from '../assets/assets'

const Steps = () => {
  const steps = [
    {
      icon: assets.upload_icon,
      title: "Upload Your Image",
      description: "Simply drag and drop or click to upload any image format. Our AI supports JPG, PNG, and more.",
      step: "01"
    },
    {
      icon: assets.remove_bg_icon,
      title: "AI Magic Happens",
      description: "Our advanced AI automatically detects and removes the background with pixel-perfect precision.",
      step: "02"
    },
    {
      icon: assets.download_icon,
      title: "Download Result",
      description: "Get your professional image with transparent background in high resolution, ready to use.",
      step: "03"
    }
  ];

  return (
    <div className='mx-4 lg:mx-44 py-16'>
      <div className="text-center mb-16">
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text mb-4'>
          How It Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Remove backgrounds from your images in just three simple steps. No technical skills required.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'>
        {steps.map((step, index) => (
          <div key={index} className='relative group'>
            {/* Connection line for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-violet-200 to-fuchsia-200 z-0"></div>
            )}

            <div className='relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100'>
              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <img className='w-8 h-8' src={step.icon} alt={step.title} />
              </div>

              {/* Content */}
              <h3 className='text-xl font-bold text-gray-900 mb-3'>{step.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats section */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="group">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent mb-2">1M+</div>
          <div className="text-gray-600">Images Processed</div>
        </div>
        <div className="group">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent mb-2">99.9%</div>
          <div className="text-gray-600">Accuracy Rate</div>
        </div>
        <div className="group">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent mb-2">5s</div>
          <div className="text-gray-600">Average Processing</div>
        </div>
        <div className="group">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent mb-2">24/7</div>
          <div className="text-gray-600">Available</div>
        </div>
      </div>
    </div>
  )
}

export default Steps