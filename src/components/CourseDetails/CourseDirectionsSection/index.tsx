import Image from 'next/image';

type CourseDirectionsSectionProps = {
  directions: string[];
};

function splitDirectionsIntoColumns(directions: string[]): string[][] {
  if (directions.length <= 2) {
    return [directions];
  }

  if (directions.length <= 4) {
    return [directions.slice(0, 2), directions.slice(2)];
  }

  return [directions.slice(0, 2), directions.slice(2, 4), directions.slice(4)];
}

export const CourseDirectionsSection = ({ directions }: CourseDirectionsSectionProps) => {
  const directionsColumns = splitDirectionsIntoColumns(directions);

  return (
    <section className="flex flex-col gap-6 px-4 md:gap-10 lg:px-0">
      <h2 className="text-[24px] font-medium leading-[1.1] text-black md:text-[40px] md:font-semibold">
        Направления
      </h2>

      <div className="mt-6 flex w-full flex-col gap-6 rounded-[28px] bg-[#BCEC30] p-7 md:mt-10 md:flex-row md:flex-wrap md:gap-x-31 md:gap-y-8.5">
        <div className="flex flex-col gap-6 md:flex-row md:gap-31">
          {directionsColumns.map((column, columnIndex) => (
            <div key={`direction-column-${columnIndex}`} className="flex w-71 flex-col gap-6 md:gap-8.5">
              {column.map((direction) => (
                <div key={direction} className="flex min-w-0 items-center gap-2">
                  <Image src="/icons/sparkle.svg" alt="" width={26} height={26} />
                  <span className="text-[18px] font-normal leading-[1.1] text-black 2xl:text-[24px]">
                    {direction}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
