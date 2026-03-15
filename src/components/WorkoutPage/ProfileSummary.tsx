import Image from "next/image";

type ProfileSummaryProps = {
  profileName: string;
  profileEmail: string;
};

export const ProfileSummary = ({
  profileName,
  profileEmail,
}: ProfileSummaryProps) => {
  return (
    <section className="flex flex-col gap-10">
      <h1 className="text-[40px] font-semibold leading-[1.1] text-black">
        Профиль
      </h1>

      <div className="w-full rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <div className="flex items-center gap-7">
          <div className="relative h-30 w-30 shrink-0 overflow-hidden rounded-full bg-[#F7F7F7]">
            <Image
              src="/users/profile-avatar.svg"
              alt="Аватар пользователя"
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] font-medium leading-[1.1] text-black">
              {profileName}
            </h2>
            <p className="text-[24px] leading-[1.1] text-[#999999]">
              {profileEmail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
