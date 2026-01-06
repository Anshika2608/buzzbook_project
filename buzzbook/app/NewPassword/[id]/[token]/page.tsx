"use client";

import { useParams } from 'next/navigation';
import ResetPasswordForm from '@/components/forms/ResetForm';

export default function Page() {
  const params = useParams();

  const id = params?.id as string;
  const token = params?.token as string;

  return (
    <div className="
          min-h-screen 
          flex flex-col items-center md:items-end justify-center 
          bg-cover bg-center 
          md:bg-[url('/login1.png')] 
          bg-[url('/login2.png')] 
          md:pr-20
          xl:pr-40
        ">
          <div className="bg-opacity-80 p-8 rounded-lg shadow-lg">
            <ResetPasswordForm id={id} token={token} />
          </div>
        </div>
  )

}


