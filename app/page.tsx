import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <div className="flex h-screen max-h-screen">

      <section className="remove-scrollbar container my-auto bg-red-800">

        <div className="sub-container max-w-[496px] bg-green-700">

          <Image
          src="/assets/icons/logo-full.svg"
          width={1000}
          height={1000}
          alt="patient"
          className="mb-12 h-10 w-fit" />
          
          
        </div>

      </section>

    </div>
  )
}

export default Home



