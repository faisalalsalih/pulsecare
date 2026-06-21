import React from 'react'
import Image from 'next/image'
import Link from 'next/dist/client/link'
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'

const Register = async ({ params: { userId } }: SearchParamProps) => {

  const user = await getUser(userId);

  return (
    <>
      <div className="flex h-screen max-h-screen">

        <section className="remove-scrollbar container my-3">

          <div className="sub-container max-w-[860px] flex-1 flex-col py-10">

            <Image
              src="/assets/icons/logo-full.svg"
              width={1000}
              height={1000}
              alt="patient"
              className="mb-12 h-10 w-fit" />

            {/* Register Form */}
            <RegisterForm user={user} />


            <p className="mx-auto text-dark-600 m-4">
              &copy; 2026 PulseCare. All rights reserved.
            </p>






          </div>

        </section>


        <Image
          src="/assets/images/register-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img max-w-[496px]" />

      </div>
    </>
  )
}

export default Register

