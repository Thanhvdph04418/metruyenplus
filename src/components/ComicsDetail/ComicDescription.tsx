import { useState, useEffect, useRef } from 'react'

export interface ComicDescriptionProps {
  description: string
}

/**
 * ComicDescription - Expandable comic description
 * Pure presentational component with local UI state for expand/collapse
 */
export const ComicDescription = ({ description }: ComicDescriptionProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (descriptionRef.current) {
      setIsShow(descriptionRef.current.scrollHeight !== descriptionRef.current.clientHeight)
    }
  }, [description])

  return (
    <div className='relative'>
      <p
        ref={descriptionRef}
        className={`text-base text-black/70 dark:text-gray-300 whitespace-pre-line text-left ${
          !isOpen ? 'overflow-hidden max-h-[72px]' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {isShow && (
        <button
          title={isOpen ? 'Thu gọn mô tả' : 'Xem thêm mô tả'}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${
            !isOpen
              ? 'absolute right-0 bg-white/90 dark:bg-gray-900/90 rounded-full bottom-0 z-10 min-w-[60px] px-2 overflow-hidden'
              : ''
          }`}
        >
          <span className='text-black dark:text-white font-medium whitespace-nowrap'>
            {isOpen ? 'Show less' : '...more'}
          </span>
        </button>
      )}
    </div>
  )
}
