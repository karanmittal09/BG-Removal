import React, { useContext } from "react";
import { assets } from '../assets/assets';
import { AppContext } from "../context/AppContext";

const Upload = () => {
  const { removeBg, checkCreditsAndRedirect } = useContext(AppContext)

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && checkCreditsAndRedirect()) {
      removeBg(file);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="relative py-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/3 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-white rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 text-center mx-4 lg:mx-44">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto">
          Join millions of users who trust our AI to remove backgrounds instantly.
          Upload your first image and see the magic happen.
        </p>

        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-12'>
          <input
            onChange={handleFileUpload}
            type="file"
            accept="image/*"
            id="upload2"
            hidden
          />
          <label
            className='inline-flex items-center gap-3 px-10 py-4 rounded-full cursor-pointer bg-white text-violet-600 font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl'
            htmlFor="upload2"
          >
            <img width={24} src={assets.upload_btn_icon} alt="" />
            <span>Upload Your Image Now</span>
          </label>

          <div className="flex items-center gap-2 text-white text-opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm">100% Secure & Private</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-white text-opacity-80 text-sm">Process images in under 5 seconds</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">High Quality</h3>
            <p className="text-white text-opacity-80 text-sm">Professional results every time</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Free to Start</h3>
            <p className="text-white text-opacity-80 text-sm">5 free credits to get you started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
