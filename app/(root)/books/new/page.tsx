import UplodForm from '@/components/UplodForm'
import React from 'react'

const page = () => {
  return (
    <main className='wrapper container'> 
    <div className='mx-auto max-w-180 space-y-10'>
        <section className='flex flix-col gap-5'>
        <h1 className='text-2xl font-bold'>Add A New Book</h1>
            </section>
            <UplodForm />
         </div>
    </main>
  )
}

export default page