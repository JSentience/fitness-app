import { getCourseImage, getCourseSkillImage } from '@/lib/courseImages';
import type { Course } from '@/types/course.types';
import Image from 'next/image';

type CourseHeroProps = {
  course: Pick<Course, '_id' | 'nameEN' | 'nameRU'>;
};

export const CourseHero = ({ course }: CourseHeroProps) => {
  const desktopImage = getCourseSkillImage(course.nameEN);
  const mobileImage = getCourseImage(course.nameEN);

  return (
    <div className="h-97.25 rounded-[30px] p-4 md:h-77.5">
      <div className="relative h-full overflow-hidden rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <Image
          src={mobileImage}
          alt={course.nameRU}
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), calc(100vw - 17.5rem)"
          className="object-cover object-center md:hidden"
          priority
        />
        <Image
          src={desktopImage}
          alt={course.nameRU}
          fill
          sizes="(max-width: 768px) calc(100vw - 2rem), calc(100vw - 17.5rem)"
          className="hidden object-cover object-right md:block"
          priority
        />
      </div>
    </div>
  );
};
