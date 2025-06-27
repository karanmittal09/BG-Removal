import React from 'react'
import { assets } from '../assets/assets';

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = React.useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  }

  return (
    <div className="py-16 mx-4 lg:mx-44">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text mb-4'>
          See the Difference
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the power of our AI technology. Drag the slider to see the before and after results.
        </p>
      </div>

      <div className='relative w-full max-w-4xl mx-auto'>
        {/* Demo container */}
        <div className='relative overflow-hidden rounded-3xl shadow-2xl bg-white p-4'>
          <div className='relative overflow-hidden rounded-2xl'>
            {/* Background image */}
            <img
              src={assets.image_w_bg}
              style={{ clipPath: `inset(0 ${100.2 - sliderPosition}% 0 0)` }}
              alt="Original image with background"
              className="w-full h-auto"
            />

            {/* Foreground image */}
            <img
              className='absolute top-0 left-0 w-full h-full'
              src={assets.image_wo_bg}
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)`}}
              alt="Image with background removed"
            />

            {/* Slider */}
            <input
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10 slider'
              type="range"
              min={0}
              max={100}
              value={sliderPosition}
              onChange={handleSliderChange}
            />

            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Original
            </div>
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Background Removed
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Drag the slider to compare
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BgSlider