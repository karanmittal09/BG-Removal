import React from "react";
import { assets } from '../assets/assets';

const Upload = () => {
  return (
    <div className="pb-16">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 text-transparent bg-clip-text py-6 md:py-16">
        See the magic. Try now
      </h1>

       <div className='text-center mb-24'>
                 <input type="file" name="" id="upload2" hidden />
                 <label className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:scale-105 transition-all duration-700' htmlFor="upload2">
                   <img width={20} src={assets.upload_btn_icon} alt="" />
                   <p className='text-white text-sm'>Upload Your Image</p>
                 </label>
               </div>


    </div>
  );
};

export default Upload;
