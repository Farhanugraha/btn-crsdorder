'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import MenuCard from '@/components/menu/MenuCard';
import CategoryFilter from '@/components/category/CategoryFilter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';

const MOCK_CATEGORIES = [
  { id: 'pizza', name: 'Pizza' },
  { id: 'burger', name: 'Burger' },
  { id: 'drink', name: 'Drink' }
];

const MOCK_MENU = [
  {
    id: '1',
    name: 'Pepperoni Pizza',
    description:
      'Classic pepperoni pizza dengan keju mozzarella segar dan sauce homemade yang lezat',
    price: 120000,
    images: [],
    categoryIDs: ['pizza']
  },
  {
    id: '2',
    name: 'Cheese Burger',
    description:
      'Beef burger premium dengan cheddar cheese yang lumer dan fresh lettuce',
    price: 95000,
    images: [],
    categoryIDs: ['burger']
  },
  {
    id: '3',
    name: 'Ice Lemon Tea',
    description:
      'Minuman segar dari lemon asli dengan es batu dan gula murni',
    price: 30000,
    images: [],
    categoryIDs: ['drink']
  }
];

const MenuPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    string[]
  >([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedSize, setSelectedSize] = useState<{
    [key: string]: string;
  }>({});
  const [selectedQuantity, setSelectedQuantity] = useState<{
    [key: string]: number;
  }>({});
  const [sizeError, setSizeError] = useState<{
    [key: string]: boolean;
  }>({});

  // Cart store
  const { cart, addToCart, increaseQuantity } = useCartStore();

  /* =======================
     LOAD MOCK DATA
  ======================= */
  useEffect(() => {
    setTimeout(() => {
      setCategoryList(MOCK_CATEGORIES);
      setMenuList(MOCK_MENU);
      setIsLoading(false);
    }, 500);
  }, []);

  const setFilterCategory = (categoryArray: string[] | undefined) => {
    setSelectedCategoryList(categoryArray ?? []);
  };

  const filteredMenu = menuList.filter(
    (item) =>
      selectedCategoryList.length === 0 ||
      item.categoryIDs.some((id: string) =>
        selectedCategoryList.includes(id)
      )
  );

  const toggleDialog = (menuId: string) => {
    setDialogOpen((prev) => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));

    // Reset form saat dialog dibuka
    if (!dialogOpen[menuId]) {
      setSelectedSize({ ...selectedSize, [menuId]: '' });
      setSelectedQuantity({ ...selectedQuantity, [menuId]: 1 });
      setSizeError({ ...sizeError, [menuId]: false });
    }
  };

  const handleAddToCart = (menu: any) => {
    const size = selectedSize[menu.id];
    const quantity = selectedQuantity[menu.id] || 1;

    if (!size) {
      setSizeError({ ...sizeError, [menu.id]: true });
      return;
    }

    // Check if item already in cart
    const existingItem = cart.find(
      (item) => item.menu.id === menu.id && item.size === size
    );

    if (existingItem) {
      increaseQuantity(menu.id, size);
    } else {
      addToCart(menu, size, quantity);
    }

    toast.success(`${menu.name} ditambahkan ke keranjang!`);
    toggleDialog(menu.id);
  };

  const getTotalPrice = (menuId: string, price: number) => {
    const quantity = selectedQuantity[menuId] || 1;
    return formatPrice(price * quantity, {
      currency: 'IDR',
      notation: 'compact'
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-muted/30 px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Menu Kami
          </h1>
          <p className="text-muted-foreground">
            Pilih dari berbagai pilihan hidangan lezat yang kami
            tawarkan
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-6 sm:px-6 lg:px-10">
          <CategoryFilter
            categoryList={categoryList}
            selectedCategoryList={selectedCategoryList}
            setFilterCategory={setFilterCategory}
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {filteredMenu.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                Tidak ada menu yang sesuai dengan kategori yang
                dipilih
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMenu.map((menu) => (
                <Dialog
                  key={menu.id}
                  open={dialogOpen[menu.id] || false}
                  onOpenChange={() => toggleDialog(menu.id)}
                >
                  <DialogTrigger asChild>
                    <div className="cursor-pointer transition-transform hover:scale-105">
                      <MenuCard
                        menu={menu}
                        toggleDialog={() => toggleDialog(menu.id)}
                        index={0}
                      />
                    </div>
                  </DialogTrigger>

                  <DialogContent className="w-full max-w-md">
                    {/* Product Info */}
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-foreground">
                        {menu.name}
                      </DialogTitle>
                    </DialogHeader>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {menu.description}
                    </p>

                    {/* Size Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Pilih Ukuran
                      </label>
                      <Select
                        value={selectedSize[menu.id] || ''}
                        onValueChange={(value) => {
                          setSelectedSize({
                            ...selectedSize,
                            [menu.id]: value
                          });
                          setSizeError({
                            ...sizeError,
                            [menu.id]: false
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih ukuran..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="SMALL">
                              Kecil (Small)
                            </SelectItem>
                            <SelectItem value="NORMAL">
                              Besar (Normal)
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {sizeError[menu.id] && (
                        <ErrorMessage>
                          Silakan pilih ukuran
                        </ErrorMessage>
                      )}
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-4 rounded-lg bg-muted p-3">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Jumlah
                      </span>
                      <div className="ml-auto flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            (selectedQuantity[menu.id] || 1) === 1
                          }
                          onClick={() =>
                            setSelectedQuantity({
                              ...selectedQuantity,
                              [menu.id]: Math.max(
                                1,
                                (selectedQuantity[menu.id] || 1) - 1
                              )
                            })
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {selectedQuantity[menu.id] || 1}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedQuantity({
                              ...selectedQuantity,
                              [menu.id]:
                                (selectedQuantity[menu.id] || 1) + 1
                            })
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="h-11 w-full gap-2"
                      onClick={() => handleAddToCart(menu)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Tambah ke Keranjang</span>
                      <span className="ml-auto font-semibold">
                        {getTotalPrice(menu.id, menu.price)}
                      </span>
                    </Button>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
