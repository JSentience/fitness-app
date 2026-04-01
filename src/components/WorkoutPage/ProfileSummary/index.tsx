import { Button } from '@/components/Button/Button';
import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import Image from 'next/image';

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

      <SurfaceCard className="w-full p-7.5">
        <div className="flex flex-col sm:flex-row items-center gap-7.5">
          <div className="relative h-35 w-35 sm:h-50 sm:w-50 shrink-0 overflow-hidden rounded-[30px] ">
            <Image
              src="/users/user-avatar.png"
              alt="Аватар пользователя"
              fill
              sizes="(max-width: 640px) 140px, 200px"
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
      </SurfaceCard>
    </section>
  );
};
