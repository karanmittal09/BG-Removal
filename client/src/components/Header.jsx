import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex items-center justify-between max-sm:flex-col-reverse gap-y-10 px-4 mt-10 lg:px-44 sm:mt-20'>

      {/* left side */}
      <div className="px-4 flex flex-col gap-4">

        <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-neutral-700 leading-tight">
          Remove the <br className='max-md:hidden' />
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-transparent bg-clip-text">
            background
          </span> from
          <br className='max-md:hidden' />
          images for free.
        </h1>

        <p className="mt-6 text-gray-600">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          <br className='max-ms:hidden' />
          Lorem Ipsum has been the industry's standard dummy text ever.
        </p>

        {/* Upload Button */}
        <div>
          <input type="file" name="" id="upload1" hidden />
          <label className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:scale-105 transition-all duration-700' htmlFor="upload1">
            <img width={20} src={assets.upload_btn_icon} alt="" />
            <p className='text-white text-sm'>Upload Your Image</p>
          </label>
        </div>


        
      </div>

      {/* right side */}
      <div className='w-full max-w-md'>
        <img src={assets.header_img} alt="" />
      </div>

    </div>
  )
}

export default Header
