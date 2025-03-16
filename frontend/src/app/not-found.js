import Link from "next/link";

function NotFound() {
  return (
    <main className='text-center space-y-6 mt-4'>
      <h1 className='text-lg sm:text-xl md:text-3xl font-semibold'>
        Страница не найдена :(
      </h1>
      <Link href='/'
        className='inline-block
        border border-primary-300 hover:border-white
        rounded justify-center items-center cursor-pointer
        bg-accent-10 text-white hover:bg-primary-10
        text-sm sm:text-base md:text-lg
        px-3 sm:px-4 md:px-6
        py-1.5 sm:py-2 md:py-3'>
        На главную страницу
      </Link>
    </main>
  );
}

export default NotFound;
