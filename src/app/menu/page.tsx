'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ExtendedMenu } from '@/types/menu';
import { Category } from '@prisma/client';
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

type ListMenuProps = {
  menuList: ExtendedMenu[];
};

type ListCategoryProps = {
  categoryList: Category[];
};

const MenuPage = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuList, setMenuList] = useState<ExtendedMenu[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isSizeError, setIsSizeError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<boolean[]>(
    new Array(menuList.length).fill(false)
  );
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    string[]
  >([]);

  const { cart, addToCart, increaseQuantity } = useCartStore();

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ListCategoryProps = await response.json();
        setCategoryList(data.categoryList);
      } else {
        setIsError(true);
        setIsLoading(false);
        toast.error('An unexpected error occurred');
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      toast.error('An unexpected error is occured');
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ListMenuProps = await response.json();
        setMenuList(data.menuList || []);
        setIsLoading(false);
      } else {
        setIsError(true);
        setIsLoading(false);
        toast.error('An unexpected error occurred');
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      toast.error('An unexpected error is occured');
    }
  };

  useEffect(() => {
    fetchCategory();
    if (!isError) {
      fetchMenu();
    }
  }, []);

  const setFilterCategory = (categoryArray: string[] | undefined) => {
    if (categoryArray === undefined) {
      setSelectedCategoryList([]);
    } else {
      setSelectedCategoryList(categoryArray);
    }
  };

  const totalItemPrice = (price: number) => {
    const totalPrice = price * quantity;
    const formattedPrice = formatPrice(totalPrice, {
      currency: 'EUR',
      notation: 'compact'
    });
    return formattedPrice;
  };

  const toggleDialog = (index: number) => {
    setDialogOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
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
    <div>
      {!isError ? (
        menuList.length == 0 ? (
          <p className="m-auto my-10 text-center text-lg">
            There is still no any menu. Please come back later.
          </p>
        ) : (
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
                    item.categoryIDs.some((id) =>
                      selectedCategoryList.includes(id)
                    )
                )
                .map((menu, index) => (
                  <div key={menu.id}>
                    <Dialog
                      open={dialogOpen[index]}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          toggleDialog(index);
                        } else {
                          setQuantity(1);
                        }
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
                        <Carousel className="mx-auto flex h-[200px] w-[200px] flex-grow items-center justify-center">
                          <CarouselContent>
                            {menu.images.length === 0 ? (
                              <CarouselItem>
                                <div className="p-1">
                                  <Image
                                    src={noImageUrl}
                                    alt="No image"
                                    width="160"
                                    height="160"
                                    placeholder="blur"
                                    blurDataURL={`${noImageUrl}`}
                                    loading="lazy"
                                    className="rounded-md"
                                  />
                                </div>
                              </CarouselItem>
                            ) : (
                              menu.images.map((image, index) => (
                                <CarouselItem
                                  key={index}
                                  className="flex items-center justify-center"
                                >
                                  <div className="p-1">
                                    <Image
                                      src={
                                        `${image.url}` || noImageUrl
                                      }
                                      alt={image.id}
                                      width="160"
                                      height="160"
                                      placeholder="blur"
                                      blurDataURL={`${image.url}`}
                                      loading="lazy"
                                      className="rounded-md"
                                    />
                                  </div>
                                </CarouselItem>
                              ))
                            )}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            {menu.name}
                          </DialogTitle>
                          <ScrollArea className="h-44">
                            <DialogDescription>
                              {menu.description}
                            </DialogDescription>
                          </ScrollArea>
                        </DialogHeader>
                        <Select
                          onValueChange={(value) => {
                            setIsSizeError(false);
                            setSize(value);
                          }}
                          defaultValue={undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a size to display" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="SMALL">
                                Small
                              </SelectItem>
                              <SelectItem value="NORMAL">
                                Normal
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isSizeError && (
                          <ErrorMessage>
                            Please select a size!
                          </ErrorMessage>
                        )}
                        <div className="mt-5 flex w-fit flex-row items-center gap-10">
                          <div className="flex flex-row items-center gap-3">
                            <Button
                              disabled={quantity === 1 ? true : false}
                              type="button"
                              size="icon"
                              onClick={() => {
                                if (quantity > 1) {
                                  setQuantity((qty) => qty - 1);
                                }
                              }}
                            >
                              <Minus />
                            </Button>
                            <span>{quantity}</span>
                            <Button
                              type="button"
                              size="icon"
                              onClick={() =>
                                setQuantity((qty) => qty + 1)
                              }
                            >
                              <Plus />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            className="flex w-40 flex-row justify-between gap-3"
                            onClick={() => {
                              if (size !== undefined) {
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
                                setSize(undefined);
                                setIsSizeError(false);
                                toggleDialog(index);
                              } else {
                                setIsSizeError(true);
                              }
                            }}
                          >
                            <div>Add</div>
                            <span>{totalItemPrice(menu.price)}</span>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
            </div>
          </div>
        )
      ) : (
        <p className="m-auto mt-10 text-lg">Something went wrong</p>
      )}
    </div>
  );
};

export default MenuPage;
