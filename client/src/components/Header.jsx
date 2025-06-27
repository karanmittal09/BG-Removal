import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { removeBg, checkCreditsAndRedirect } = useContext(AppContext);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && checkCreditsAndRedirect()) {
      removeBg(file);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between max-lg:flex-col-reverse gap-12 px-4 sm:px-8 lg:px-44 w-full">
        {/* Left Side */}
        <div className="flex-1 max-w-2xl">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 rounded-full text-sm font-medium mb-6">
              ✨ AI-Powered Background Removal
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Remove
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent"> backgrounds </span>
            instantly with AI
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Transform your images in seconds with our advanced AI technology.
            Perfect for e-commerce, social media, and professional photography.
            No design skills required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              onChange={handleFileUpload}
              type="file"
              accept="image/*"
              id="upload1"
              hidden
            />
            <label
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
              htmlFor="upload1"
            >
              <img width={20} src={assets.upload_btn_icon} alt="" />
              <span>Upload Your Image</span>
            </label>

            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-violet-500 hover:text-violet-600 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 11-6 0V4a3 3 0 016 0v3z" />
              </svg>
              <span>View Demo</span>
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>High quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant results</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-3xl blur-2xl opacity-20 scale-105"></div>
            <img
              src={assets.header_img}
              alt="Background removal demo"
              className="relative z-10 w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
