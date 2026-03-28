import Image from 'next/image';
import { Button } from '../Button/Button';

type ProfileSummaryProps = {
  profileName: string;
  profileEmail: string;
  onLogoutClickAction: () => void;
};

export const ProfileSummary = ({
  profileName,
  profileEmail,
  onLogoutClickAction,
}: ProfileSummaryProps) => {
  return (
    <section className="flex flex-col gap-10">
      <h1 className="text-[24px] lg:text-[40px] font-semibold leading-[1.1] text-black">Профиль</h1>

      <div className="w-full rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <div className="flex flex-col sm:flex-row items-center gap-[30px]">
          <div className="relative h-35 w-35 sm:h-50 sm:w-50 shrink-0 overflow-hidden rounded-[30px] ">
            <Image
              src="/users/user-avatar.png"
              alt="Аватар пользователя"
              fill
              className="object-contain p-4"
              priority
            />
          </div>
          <div className="w-71 flex flex-col gap-5  sm:gap-11">
            <div className="flex flex-col gap-5">
              <h2 className="text-[24px] lg:text-[32px] font-medium leading-[1.1] text-black">
                {profileName}
              </h2>
              <p className="text-[24px] leading-[1.1] text-[#999999]">{profileEmail}</p>
            </div>
            <Button
              className="w-full justify-center"
              onClick={onLogoutClickAction}
              variant="outline"
              type="button"
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

