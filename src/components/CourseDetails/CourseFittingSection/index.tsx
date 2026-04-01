type CourseFittingSectionProps = {
  fitting: string[];
};

export const CourseFittingSection = ({ fitting }: CourseFittingSectionProps) => {
  return (
    <section className="flex flex-col gap-6 px-4 md:gap-10">
      <h2 className="text-[24px] font-medium leading-[1.1] text-black md:text-[40px] md:font-semibold">
        Подойдет для вас, если:
      </h2>

      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-4.25">
        {fitting.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex min-w-0 flex-1 items-center gap-4 rounded-[28px] p-5 md:gap-6.25"
            style={{
              background:
                'linear-gradient(152deg, rgba(21, 23, 32, 1) 17%, rgba(30, 33, 46, 1) 100%)',
            }}
          >
            <span
              className="shrink-0 text-[75px] font-medium leading-[1.35]"
              style={{ color: '#BCEC30' }}
            >
              {index + 1}
            </span>
            <p className="text-[18px] font-normal leading-[1.1] text-white md:text-[24px]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
