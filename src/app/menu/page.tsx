'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Loading from '@/components/Loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import MenuCard from '@/components/menu/MenuCard';
import noImageUrl from '../../../public/no-image.png';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import ErrorMessage from '@/components/ErrorMessage';
import { formatPrice } from '@/lib/utils';
import CategoryFilter from '@/components/category/CategoryFilter';

const MOCK_CATEGORIES = [
  { id: 'pizza', name: 'Pizza' },
  { id: 'burger', name: 'Burger' },
  { id: 'drink', name: 'Drink' }
];

const MOCK_MENU = [
  {
    id: '1',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza with cheese',
    price: 12,
    images: [],
    categoryIDs: ['pizza']
  },
  {
    id: '2',
    name: 'Cheese Burger',
    description: 'Beef burger with melted cheese',
    price: 10,
    images: [],
    categoryIDs: ['burger']
  },
  {
    id: '3',
    name: 'Ice Lemon Tea',
    description: 'Fresh cold lemon tea',
    price: 4,
    images: [],
    categoryIDs: ['drink']
  }
];

const MenuPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [size, setSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isSizeError, setIsSizeError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<boolean[]>([]);
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    string[]
  >([]);

  const { cart, addToCart, increaseQuantity } = useCartStore();

  /* =======================
     LOAD MOCK DATA
  ======================= */
  useEffect(() => {
    setTimeout(() => {
      setCategoryList(MOCK_CATEGORIES);
      setMenuList(MOCK_MENU);
      setDialogOpen(new Array(MOCK_MENU.length).fill(false));
      setIsLoading(false);
    }, 500);
  }, []);

  const setFilterCategory = (categoryArray: string[] | undefined) => {
    setSelectedCategoryList(categoryArray ?? []);
  };

  const totalItemPrice = (price: number) =>
    formatPrice(price * quantity, {
      currency: 'EUR',
      notation: 'compact'
    });

  const toggleDialog = (index: number) => {
    setDialogOpen((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <CategoryFilter
        categoryList={categoryList}
        selectedCategoryList={selectedCategoryList}
        setFilterCategory={setFilterCategory}
      />

      <div className="mt-14 grid grid-cols-1 gap-10 px-10 py-4 md:grid-cols-2 xl:grid-cols-3">
        {menuList
          .filter(
            (item) =>
              selectedCategoryList.length === 0 ||
              item.categoryIDs.some((id: string) =>
                selectedCategoryList.includes(id)
              )
          )
          .map((menu, index) => (
            <Dialog
              key={menu.id}
              open={dialogOpen[index]}
              onOpenChange={() => {
                setQuantity(1);
                setIsSizeError(false);
                toggleDialog(index);
              }}
            >
              <DialogTrigger>
                <MenuCard
                  menu={menu}
                  toggleDialog={toggleDialog}
                  index={index}
                />
              </DialogTrigger>

              <DialogContent className="flex flex-col px-12 sm:max-w-md">
                <Carousel className="mx-auto h-[200px] w-[200px]">
                  <CarouselContent>
                    <CarouselItem className="flex justify-center">
                      <Image
                        src={noImageUrl}
                        alt="Menu"
                        width={160}
                        height={160}
                        className="rounded-md"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {menu.name}
                  </DialogTitle>
                  <ScrollArea className="h-32">
                    <DialogDescription>
                      {menu.description}
                    </DialogDescription>
                  </ScrollArea>
                </DialogHeader>

                <Select
                  onValueChange={(value) => {
                    setSize(value);
                    setIsSizeError(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {isSizeError && (
                  <ErrorMessage>Please select a size</ErrorMessage>
                )}

                <div className="mt-5 flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      disabled={quantity === 1}
                      onClick={() => setQuantity((q) => q - 1)}
                    >
                      <Minus />
                    </Button>
                    <span>{quantity}</span>
                    <Button
                      size="icon"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>

                  <Button
                    className="w-40 justify-between"
                    onClick={() => {
                      if (!size) {
                        setIsSizeError(true);
                        return;
                      }

                      if (
                        cart.some(
                          (item) =>
                            item.menu.id === menu.id &&
                            item.size === size
                        )
                      ) {
                        increaseQuantity(menu.id, size);
                      } else {
                        addToCart(menu, size, quantity);
                      }

                      toast.success('Added to cart');
                      toggleDialog(index);
                    }}
                  >
                    <span>Add</span>
                    <span>{totalItemPrice(menu.price)}</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
      </div>
    </div>
  );
};

export default MenuPage;
