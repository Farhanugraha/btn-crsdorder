import noImageUrl from '../../../public/foodimages.png';
import Image from 'next/image';
import { ExtendedMenu } from '@/types/menu';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

type ListMenuProps = {
  menu: ExtendedMenu;
  toggleDialog: (index: number) => void;
  index: number;
};

const MenuCard = ({ menu, toggleDialog, index }: ListMenuProps) => {
  const isDefaultImage = !menu.images || menu.images.length === 0;
  const imageUrl = isDefaultImage ? noImageUrl : menu.images[0].url;

  return (
    <div
      onClick={() => toggleDialog(index)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {isDefaultImage ? (
          <Image
            src={noImageUrl}
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder="blur"
            loading="lazy"
          />
        ) : (
          <Image
            src={imageUrl as string}
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder="blur"
            blurDataURL={imageUrl as string}
            loading="lazy"
          />
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
          {formatPrice(menu.price, {
            currency: 'IDR',
            notation: 'compact'
          })}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ShoppingCart className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <div className="flex-1">
          <h2 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {menu.name}
          </h2>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {menu.description}
        </p>

        {/* Footer with Category Info */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex flex-wrap gap-2">
            {menu.categoryIDs &&
              menu.categoryIDs.length > 0 &&
              menu.categoryIDs.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {category}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
