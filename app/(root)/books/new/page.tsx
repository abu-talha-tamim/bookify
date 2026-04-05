import UploadForm from '@/components/UploadForm'


const page = () => {
  return (
    <main className='wrapper container'> 
    <div className='mx-auto max-w-180 space-y-10'>
        <section className='flex flix-col gap-5'>
        <h1 className='text-2xl font-bold'>Add A New Book</h1>
            </section>
            <UploadForm />
         </div>
    </main>
  )
}

export default page