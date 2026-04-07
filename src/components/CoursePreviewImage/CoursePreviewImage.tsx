import { getCourseImage } from '@/lib/courseImages';
import Image from 'next/image';

type CoursePreviewImageProps = {
  imageSizes: string;
  nameEN: string;
  nameRU: string;
  priority?: boolean;
  wrapperClassName: string;
};

export const CoursePreviewImage = ({
  imageSizes,
  nameEN,
  nameRU,
  priority = false,
  wrapperClassName,
}: CoursePreviewImageProps) => {
  return (
    <div className={wrapperClassName}>
      <Image
        src={getCourseImage(nameEN)}
        alt={nameRU}
        fill
        priority={priority}
        sizes={imageSizes}
        className="object-cover"
      />
    </div>
  );
};
