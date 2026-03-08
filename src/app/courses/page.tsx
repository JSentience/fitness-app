import Image from "next/image";

export default function CoursesPage() {
  return (
    <>
      <main className="flex items-center flex-col gap-15">
        <Image
          src="/images/courses/yoga-id.png"
          alt="yoga"
          width={1160}
          height={310}
        />
        <div className="flex flex-col max-w-290 gap-10">
          <h2 className="text-[40px] font-semibold ">
            Подойдет для вас, если:
          </h2>
          <div className="flex gap-4">
            <article className="flex max-w-max gap-6 items-center h-35.25 p-5 bg-dark-gradient text-white rounded-[28px]">
              <p className="font-normal text-7xl text-[#BCEC30]">1</p>

              <p className="text-2xl font-normal leading-6 ">
                Давно хотели попробовать йогу, но не решались начать
              </p>
            </article>
            <article className="flex max-w-max gap-6  items-center h-35.25 p-5 bg-dark-gradient text-white rounded-[28px]">
              <p className="font-normal text-7xl text-[#BCEC30]">2</p>
              <p className="text-2xl font-normal leading-6 ">
                Хотите укрепить позвоночник, избавиться от болей в спине и
                суставах
              </p>
            </article>
            <article className="flex max-w-max gap-6 items-center h-35.25 p-5 bg-dark-gradient text-white rounded-[28px]">
              <p className="font-normal text-7xl text-[#BCEC30]">3</p>
              <p className="text-2xl font-normal leading-6">
                Ищете активность, полезную для тела и души
              </p>
            </article>
          </div>
        </div>
        <div className="flex flex-col max-w-290 gap-10  ">
          <h2 className="text-[40px] font-semibold">Направления</h2>
          <div className="flex gap-31 bg-[#BCEC30] rounded-[28px] p-7.5">
            <div className="flex flex-col gap-8.5">
              <div className="flex gap-2 w-71">
                <Image
                  src={"/Sparcle.svg"}
                  alt="звездочка"
                  width={26}
                  height={26}
                />
                <p className="text-2xl font-normal leading-6.5">
                  Йога для новичков
                </p>
              </div>
              <div className="flex gap-2 w-71">
                <Image
                  src={"/Sparcle.svg"}
                  alt="звездочка"
                  width={26}
                  height={26}
                />
                <p className="text-2xl font-normal leading-6.5">
                  Классическая йога
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-8.5">
              <div className="flex gap-2 w-71">
                <Image
                  src={"/Sparcle.svg"}
                  alt="звездочка"
                  width={26}
                  height={26}
                />
                <p className="text-2xl font-normal leading-6.5">
                  Кундалини-йога
                </p>
              </div>
              <div className="flex gap-2 w-71">
                <Image
                  src={"/Sparcle.svg"}
                  alt="звездочка"
                  width={26}
                  height={26}
                />
                <p className="text-2xl font-normal leading-6.5">Йогатерапия</p>
              </div>
            </div>
            <div className="flex flex-col gap-8.5">
              <div className="flex gap-2 w-71">
                <Image
                  src={"/Sparcle.svg"}
                  alt="звездочка"
                  width={26}
                  height={26}
                />
                <p className="text-2xl font-normal leading-6.5">Хатха-йога</p>
              </div>
              <div className="flex gap-2 w-71">
                <Image
                  src={"/Sparcle.svg"}
                  alt="звездочка"
                  width={26}
                  height={26}
                />
                <p className="text-2xl font-normal leading-6.5">Аштанга-йога</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Image
            src={"/images/courses/course-get.svg"}
            alt="get-course"
            width={1160}
            height={486}
          />
        </div>
      </main>
    </>
  );
}
