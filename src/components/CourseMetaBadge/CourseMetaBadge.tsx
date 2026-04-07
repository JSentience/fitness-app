import Image from 'next/image';

type CourseMetaBadgeProps = {
  icon: string;
  iconAlt?: string;
  iconAriaHidden?: boolean;
  label: string;
};

export const CourseMetaBadge = ({
  icon,
  iconAlt = '',
  iconAriaHidden = false,
  label,
}: CourseMetaBadgeProps) => {
  return (
    <div className="flex items-center gap-1.5 rounded-[50px] bg-[#F7F7F7] p-2.5">
      <Image
        src={icon}
        alt={iconAriaHidden ? '' : iconAlt}
        width={18}
        height={18}
        aria-hidden={iconAriaHidden}
      />
      <span className="whitespace-nowrap text-[16px] leading-[1.1] text-[#202020]">{label}</span>
    </div>
  );
};
