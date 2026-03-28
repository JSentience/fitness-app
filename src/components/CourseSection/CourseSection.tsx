import Image from 'next/image';
import { AddCourseButton } from '../AddCourseButton/AddCourseButton';

type CourseSectionProps = {
  courseId: string;
  initialSelectedCourses: string[];
};
const benefits = [
  'проработка всех групп мышц',
  'тренировка суставов',
  'улучшение циркуляции крови',
  'упражнения заряжают бодростью',
  'помогают противостоять стрессам',
];

export const CourseSection = ({ courseId, initialSelectedCourses }: CourseSectionProps) => {
  return (
    <>
      <div className="relative -mt-[100px] lg:mt-[104px] mb-8 lg:mb-12 w-full">
        <div className="relative block h-[415px] w-full lg:hidden">
          <Image
            src="/courses/details/runner-mobile.png"
            alt="Спортсмен"
            width={375}
            height={456}
            sizes="375px"
            className="pointer-events-none absolute left-1/2 -top-[30px] h-auto w-[375px] max-w-none -translate-x-1/2"
            priority
          />
        </div>

        <div className="relative z-10 -mt-[180px] mx-4 rounded-[30px] bg-white p-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] overflow-hidden sm:mx-8 sm:-mt-[188px] sm:p-8 lg:mx-auto lg:mt-0 lg:max-w-[1160px] lg:min-h-[486px] lg:overflow-visible lg:p-10">
          <div className="w-full sm:max-w-[500px] lg:w-[437px] flex flex-col gap-7">
            <h2 className="text-black text-[32px] sm:text-[44px] lg:text-6xl font-medium leading-[38px] sm:leading-[52px] lg:leading-[70px]">
              Начните путь к&nbsp;новому телу
            </h2>
            <ul className="list-disc list-outside pl-[30px] text-black/60 text-lg sm:text-xl lg:text-2xl leading-snug lg:leading-7">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="pb-1"
                  style={{
                    marginBottom: benefit === benefits[benefits.length - 1] ? 0 : 12,
                  }}
                >
                  {benefit}
                </li>
              ))}
            </ul>
            <AddCourseButton courseId={courseId} initialSelectedCourses={initialSelectedCourses} />
          </div>

          <div className="hidden lg:block absolute -right-[70px] -top-[105px] w-[870px] h-[650px] z-20 pointer-events-none rounded-md scale:170">
            <Image
              src="/courses/details/runner.png"
              alt="Спортсмен"
              fill
              sizes="(max-width: 1024px) 0px, 740px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* <section className=" pt-39 bg-transparent lg:bg-white">
        <div className="relative flex bg-transparent rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] ">
          <div className="p-7.5 left-0   rounded-[30px] bg-white  z-10 flex  flex-col items-start gap-7 ">
            <h2 className="lg:text-[60px]  text-[32px] font-medium leading-none text-black">
              Начните путь <br />к новому телу
            </h2>

            <ul className="flex flex-col gap-0 opacity-60">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="ml-9 list-disc text-[18px] lg:text-[24px] font-normal leading-[1.1] text-black"
                  style={{
                    marginBottom: benefit === benefits[benefits.length - 1] ? 0 : 12,
                  }}
                >
                  {benefit}
                </li>
              ))}
            </ul>

            <AddCourseButton courseId={courseId} initialSelectedCourses={initialSelectedCourses} />
          </div>
          <div className=" absolute pointer-events-none hidden scale-100  lg:-top-35 h-177.5 w-140 lg:-right-5 lg:w-185 md:block lg:block">
            <Image
              src="/courses/details/runner.png"
              alt="Спортсмен"
              fill
              sizes="(max-width: 1024px) 0px, 740px"
              className="object-contain"
              priority
            />
          </div>
          <div className="absolute -top-50 right-10  scale-180 ml-auto block h-65 w-55 shrink-0 pointer-events-none md:hidden lg:hidden">
            <Image
              src="/courses/details/runner-mobile.png"
              alt="Спортсмен"
              fill
              sizes="220px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section> */}
    </>
  );
};
