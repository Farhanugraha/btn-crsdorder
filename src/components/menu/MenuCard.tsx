import noImageUrl from '../../../public/no-image.png';
import Image from 'next/image';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';

type ListMenuProps = {
  menu: ExtendedMenu;
  toggleDialog: (index: number) => void;
  index: number;
};

const MenuCard = ({ menu, toggleDialog, index }: ListMenuProps) => {
  return (
    <div
      onClick={() => toggleDialog(index)}
      className="flex flex-row gap-5 rounded-xl border-[1px] p-2 shadow shadow-zinc-600/70 duration-200 hover:scale-105"
    >
      {menu.images.length === 0 ? (
        <div className="hidden h-[210px] flex-col justify-center p-1 sm:flex">
          <Image
            src={noImageUrl}
            alt="No image"
            width="200"
            height="200"
            placeholder="blur"
            blurDataURL={`${noImageUrl}`}
            loading="lazy"
            className="rounded-md"
          />
        </div>
      ) : (
        <div className="hidden h-[210px] flex-col justify-center p-1 sm:flex">
          <Image
            src={`${menu.images[0].url}` || noImageUrl}
            alt={menu.images[0].id}
            width="200"
            height="200"
            placeholder="blur"
            blurDataURL={`${menu.images[0].url}`}
            loading="lazy"
            className="rounded-md"
          />
        </div>
      )}
      <div className="space-y-2">
        <div className="w-52">
          <h1 className="line-clamp-1 text-left text-lg font-bold">
            {menu.name}
          </h1>
        </div>
        <div className="h-32 w-44">
          <p className="line-clamp-4 text-left text-muted-foreground">
            {menu.description}
          </p>
        </div>
        <span className="mr-3 flex justify-end text-sky-400">
          {formatPrice(menu.price, {
            currency: 'EUR',
            notation: 'compact'
          })}
        </span>
      </div>
    </div>
  );
};

export default MenuCard;
