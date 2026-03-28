import Image from 'next/image'
import { AddCourseButton } from '../AddCourseButton/AddCourseButton'


const benefits = [
	"проработка всех групп мышц",
	"тренировка суставов",
	"улучшение циркуляции крови",
	"упражнения заряжают бодростью",
	"помогают противостоять стрессам",
];

export const CourseSection = () => {
	return (
		<>
			<section className="relative   md:rounded-[30px] md:px-10 md:py-10 lg:min-h-[640px] lg:px-15 lg:py-12 md:bg-linear-to-r from-white to-white lg:bg-white bg-linear-to-r from-white to-[#F9F9F9]">
				<div className="">
					<div className=" inset-x-0 top-[102px] rounded-[30px] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] md:h-[486px]" />
					
					<div className="pointer-events-none hidden scale-90  lg:top-[-15px] h-[710px] w-[560px] lg:right-[12px] lg:w-[740px] md:block lg:block">
						<Image
							src="/courses/details/runner.png"
							alt="Спортсмен"
							fill
							className="object-contain"
							priority
						/>
					</div>
					<div className="pointer-events-none block lg:hidden md:hidden   right-[-60px]  ">
						<Image
							src="/courses/details/runner-mobile.png"
							alt="Спортсмен"
							fill
							className="object-contain "
							priority
						/>
					</div>
					
					<div className=" left-0 rounded-[30px] bg-white lg:left-10 top-[142px] z-10 flex w-[343px] lg:w-[437px] flex-col items-start gap-7 ">
						<h2 className="lg:text-[60px] text-[32px] font-medium leading-none text-black">
							Начните путь <br />к новому телу
						</h2>
						
						<ul className="flex flex-col gap-0 opacity-60">
							{benefits.map((benefit) => (
								<li
									key={benefit}
									className="ml-9 list-disc text-[18px] lg:text-[24px] font-normal leading-[1.1] text-black"
									style={{
										marginBottom:
											benefit === benefits[benefits.length - 1] ? 0 : 12,
									}}
								>
									{benefit}
								</li>
							))}
						</ul>
						
						<AddCourseButton
							courseId={course._id}
							initialSelectedCourses={initialSelectedCourses}
						/>
					</div>
				</div>
			</section>
		</>
	)
}
