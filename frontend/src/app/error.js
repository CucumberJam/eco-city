'use client';
export default function Error({error, reset}) {
  return (
    <main className='flex justify-center items-center flex-col
    gap-6 py-2 sm:py-4'>
      <h1 className='text-center text-xl sm:text-3xl font-semibold'>Что то пошло не так...</h1>
      <p className='text-base sm:text-lg'>Ошибка: {error}!</p>

      <button className='inline-block
                border border-primary-300 hover:border-white
                rounded justify-center items-center cursor-pointer
                bg-inherit hover:bg-grey-3 hover:text-white
                px-3 sm:px-6
                py-2 sm:py-3
                text-sm sm:text-base md:text-lg'
              onClick={reset}>
        Обновить
      </button>
    </main>
  );
}
