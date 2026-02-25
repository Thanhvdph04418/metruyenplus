interface GenreDescriptionProps {
  description: string | undefined
  isLoading: boolean
}

const GenreDescription = ({ description, isLoading }: GenreDescriptionProps) => {
  return (
    <div className='bg-gradient text-white rounded-lg p-4 sm:p-6 mt-3 sm:mt-4 shadow-lg flex items-center gap-3 sm:gap-4 transform hover:scale-[1.01] transition-transform duration-200 relative overflow-hidden'>
      <div className='absolute inset-0 bg-black/10' />
      <svg
        data-v-c3ad5561
        data-v-0eca6ff4
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        aria-hidden='true'
        role='img'
        className='w-8 h-8 sm:w-10 sm:h-10 fill-current text-white flex-shrink-0 opacity-90 relative'
        viewBox='0 0 16 16'
      >
        <path d='M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm.75 3.5a.749.749 0 1 1-1.499 0a.749.749 0 0 1 1.498 0ZM8 7a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 7Z' />
      </svg>
      {description && (
        <div className='relative'>
          <p className='text-base sm:text-lg font-medium leading-relaxed line-clamp-3 sm:line-clamp-none'>
            {description}
          </p>
          <div className='h-1 w-16 sm:w-20 bg-white/30 rounded-full mt-2 hidden sm:block' />
        </div>
      )}
      {!description && isLoading && (
        <div className='space-y-2 sm:space-y-3 relative w-full'>
          <span className='h-3 sm:h-4 bg-white/20 rounded-full w-[200px] sm:w-[600px] animate-pulse block' />
          <span className='h-3 sm:h-4 bg-white/20 rounded-full w-[150px] sm:w-[400px] animate-pulse block' />
        </div>
      )}
    </div>
  )
}

export default GenreDescription
