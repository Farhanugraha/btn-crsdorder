// 'use client';

// import { useEffect, useState } from 'react';
// import { Category } from '@prisma/client';
// import { Input } from '@/components/ui/input';
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { toast } from 'sonner';
// import { z } from 'zod';
// import { useFieldArray, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
// import { menuFormSchema } from '@/lib/validation/menuFormSchema';
// import { ExtendedMenu } from '@/types/menu';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import Loading from '@/components/Loading';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';

// type MenuProps = {
//   menuItem: ExtendedMenu;
// };

// type ListCategoryProps = {
//   categoryList: Category[];
// };

// type FormType = z.infer<typeof menuFormSchema>;

// const MenuEdit = ({ params }: { params: { id: string } }) => {
//   const router = useRouter();
//   const { status, data: session } = useSession();

//   const [isSubmitting, setSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [menuItem, setMenuItem] = useState<ExtendedMenu>();
//   const [categoryList, setCategoryList] = useState<Category[]>([]);
//   const [isButtonDisable, setIsButtonDisable] = useState(false);

//   /* ================= AUTH HANDLING ================= */
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/login');
//     }
//   }, [status, router]);

//   if (status === 'loading') {
//     return <Loading />;
//   }

//   // 🔥 BYPASS ROLE CHECK (sementara)
//   // if (session?.user.role !== 'ADMIN') {
//   //   return <p>No access</p>;
//   // }

//   /* ================= FORM ================= */
//   const form = useForm<FormType>({
//     resolver: zodResolver(menuFormSchema),
//     defaultValues: {
//       menuName: '',
//       menuDescription: '',
//       menuImage: [],
//       menuCategory: [],
//       menuPrice: ''
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: 'menuImage'
//   });

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, menuRes] = await Promise.all([
//           fetch('/api/category'),
//           fetch(`/api/menu/${params.id}`)
//         ]);

//         if (!catRes.ok || !menuRes.ok) {
//           throw new Error();
//         }

//         const catData: ListCategoryProps = await catRes.json();
//         const menuData: MenuProps = await menuRes.json();

//         setCategoryList(catData.categoryList);
//         setMenuItem(menuData.menuItem);

//         form.reset({
//           menuName: menuData.menuItem.name,
//           menuDescription: menuData.menuItem.description,
//           menuImage: menuData.menuItem.images,
//           menuCategory: menuData.menuItem.categoryIDs,
//           menuPrice: menuData.menuItem.price.toString()
//         });

//         setIsLoading(false);
//       } catch {
//         toast.error('Failed to load data');
//         setIsLoading(false);
//       }
//     };

//     if (status === 'authenticated') {
//       fetchData();
//     }
//   }, [status]);

//   if (isLoading) {
//     return <Loading />;
//   }

//   /* ================= SUBMIT ================= */
//   const onSubmit = async (data: FormType) => {
//     try {
//       setSubmitting(true);

//       const res = await fetch(`/api/menu/${params.id}/update`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });

//       if (!res.ok) throw new Error();

//       toast.success('Menu updated');
//       router.push(`/user/${session?.user.id}/admin`);
//     } catch {
//       toast.error('Update failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="w-[320px]">
//       <h1 className="my-5 text-4xl font-bold">Update Menu</h1>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col gap-3"
//         >
//           {/* === FORM FIELD SAMA (AMAN) === */}

//           <div className="flex justify-between">
//             <Link
//               href={`/user/${session?.user.id}/admin`}
//               className={cn(
//                 buttonVariants({ variant: 'default' }),
//                 'w-28'
//               )}
//             >
//               Cancel
//             </Link>

//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               Update
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default MenuEdit;

// 'use client';

// import { useEffect, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { toast } from 'sonner';
// import { z } from 'zod';
// import { useFieldArray, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Loader2,
//   MinusCircle,
//   PlusCircle,
//   ArrowLeft
// } from 'lucide-react';
// import { menuFormSchema } from '@/lib/validation/menuFormSchema';
// import { ExtendedMenu } from '@/types/menu';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import Loading from '@/components/Loading';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';

// type FormType = z.infer<typeof menuFormSchema>;

// // Dummy Categories (sama seperti di menu/page.tsx)
// const DUMMY_CATEGORIES = [
//   { id: 'pizza', name: 'Pizza' },
//   { id: 'burger', name: 'Burger' },
//   { id: 'drink', name: 'Drink' }
// ];

// // Dummy Menu Items (sama seperti di menu/page.tsx)
// const DUMMY_MENU_ITEMS = [
//   {
//     id: '1',
//     name: 'Pepperoni Pizza',
//     description: 'Classic pepperoni pizza with cheese',
//     price: 120000,
//     images: [],
//     categoryIDs: ['pizza']
//   },
//   {
//     id: '2',
//     name: 'Cheese Burger',
//     description: 'Beef burger with melted cheese',
//     price: 95000,
//     images: [],
//     categoryIDs: ['burger']
//   },
//   {
//     id: '3',
//     name: 'Ice Lemon Tea',
//     description: 'Fresh cold lemon tea',
//     price: 30000,
//     images: [],
//     categoryIDs: ['drink']
//   }
// ];

// const MenuEdit = ({ params }: { params: { id: string } }) => {
//   const router = useRouter();
//   const { status, data: session } = useSession();

//   const [isSubmitting, setSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [menuItem, setMenuItem] = useState<any | null>(null);
//   const [categoryList, setCategoryList] = useState<any[]>([]);

//   // Initialize form BEFORE any conditional returns
//   const form = useForm<FormType>({
//     resolver: zodResolver(menuFormSchema),
//     defaultValues: {
//       menuName: '',
//       menuDescription: '',
//       menuImage: [],
//       menuCategory: [],
//       menuPrice: ''
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: 'menuImage'
//   });

//   /* ================= AUTH HANDLING ================= */
//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/auth/login');
//     }
//   }, [status, router]);

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Dummy data - hapus setelah API siap
//         setTimeout(() => {
//           // Set categories
//           setCategoryList(DUMMY_CATEGORIES);

//           // Find menu item by id dari dummy data
//           const foundMenu = DUMMY_MENU_ITEMS.find(
//             (item) => item.id === params.id
//           );

//           if (!foundMenu) {
//             toast.error('Menu tidak ditemukan');
//             router.push('/menu');
//             return;
//           }

//           setMenuItem(foundMenu);

//           // Reset form dengan data menu yang ditemukan
//           form.reset({
//             menuName: foundMenu.name,
//             menuDescription: foundMenu.description,
//             menuImage: foundMenu.images,
//             menuCategory: foundMenu.categoryIDs,
//             menuPrice: foundMenu.price.toString()
//           });

//           setIsLoading(false);
//         }, 300);
//       } catch (error) {
//         toast.error('Gagal memuat data');
//         setIsLoading(false);
//       }
//     };

//     if (status === 'authenticated' || status === 'unauthenticated') {
//       fetchData();
//     }
//   }, [status, form, params.id, router]);

//   if (status === 'loading' || isLoading) {
//     return <Loading />;
//   }

//   /* ================= SUBMIT ================= */
//   const onSubmit = async (data: FormType) => {
//     try {
//       setSubmitting(true);

//       // Dummy submit - tampilkan data di console
//       console.log('Menu ID:', params.id);
//       console.log('Updated Data:', data);

//       // Simulasi API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       toast.success('Menu berhasil diperbarui!');

//       // Kembali ke halaman menu
//       router.push('/menu');
//     } catch (error) {
//       toast.error('Gagal memperbarui menu');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="mx-auto max-w-2xl px-4 py-8">
//       {/* Header with Back Button */}
//       <div className="mb-8 flex items-center gap-4">
//         <Link
//           href="/menu"
//           className={cn(
//             buttonVariants({
//               variant: 'outline',
//               size: 'icon'
//             })
//           )}
//         >
//           <ArrowLeft className="h-4 w-4" />
//         </Link>
//         <h1 className="text-4xl font-bold text-foreground">
//           Perbarui Menu: {menuItem?.name}
//         </h1>
//       </div>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-6 rounded-lg border border-border bg-card p-8 shadow-lg"
//         >
//           {/* Menu Name */}
//           <FormField
//             control={form.control}
//             name="menuName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-sm font-semibold">
//                   Nama Menu
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="Nama menu"
//                     disabled={isSubmitting}
//                     className="border-border focus:ring-2 focus:ring-primary"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Menu Description */}
//           <FormField
//             control={form.control}
//             name="menuDescription"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-sm font-semibold">
//                   Deskripsi
//                 </FormLabel>
//                 <FormControl>
//                   <Textarea
//                     {...field}
//                     placeholder="Deskripsi menu"
//                     disabled={isSubmitting}
//                     className="min-h-24 resize-none border-border focus:ring-2 focus:ring-primary"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Menu Price */}
//           <FormField
//             control={form.control}
//             name="menuPrice"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-sm font-semibold">
//                   Harga (IDR)
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="0"
//                     type="number"
//                     disabled={isSubmitting}
//                     className="border-border focus:ring-2 focus:ring-primary"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Categories */}
//           <FormField
//             control={form.control}
//             name="menuCategory"
//             render={() => (
//               <FormItem>
//                 <FormLabel className="text-sm font-semibold">
//                   Kategori
//                 </FormLabel>
//                 <div className="space-y-3">
//                   {categoryList.map((category) => (
//                     <FormField
//                       key={category.id}
//                       control={form.control}
//                       name="menuCategory"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center space-x-3">
//                           <FormControl>
//                             <Checkbox
//                               checked={field.value?.includes(
//                                 category.id
//                               )}
//                               onCheckedChange={(checked) => {
//                                 const value = field.value || [];
//                                 if (checked) {
//                                   field.onChange([
//                                     ...value,
//                                     category.id
//                                   ]);
//                                 } else {
//                                   field.onChange(
//                                     value.filter(
//                                       (id) => id !== category.id
//                                     )
//                                   );
//                                 }
//                               }}
//                               disabled={isSubmitting}
//                             />
//                           </FormControl>
//                           <FormLabel className="cursor-pointer font-normal">
//                             {category.name}
//                           </FormLabel>
//                         </FormItem>
//                       )}
//                     />
//                   ))}
//                 </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Images */}
//           <FormField
//             control={form.control}
//             name="menuImage"
//             render={() => (
//               <FormItem>
//                 <FormLabel className="text-sm font-semibold">
//                   Gambar
//                 </FormLabel>
//                 <div className="space-y-3">
//                   {fields.map((field, index) => (
//                     <div
//                       key={field.id}
//                       className="flex items-end gap-3"
//                     >
//                       <FormField
//                         control={form.control}
//                         name={`menuImage.${index}.url`}
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormControl>
//                               <Input
//                                 {...field}
//                                 placeholder="URL gambar"
//                                 disabled={isSubmitting}
//                                 className="border-border focus:ring-2 focus:ring-primary"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => remove(index)}
//                         disabled={isSubmitting}
//                       >
//                         <MinusCircle className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => append({ url: '' })}
//                   disabled={isSubmitting}
//                 >
//                   <PlusCircle className="mr-2 h-4 w-4" />
//                   Tambah Gambar
//                 </Button>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 border-t border-border pt-6">
//             <Link
//               href="/menu"
//               className={cn(buttonVariants({ variant: 'outline' }))}
//             >
//               Batal
//             </Link>

//             <Button type="submit" disabled={isSubmitting} size="lg">
//               {isSubmitting && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default MenuEdit;

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/Loading';
import MenuCard from '@/components/menu/MenuCard';
import CategoryFilter from '@/components/category/CategoryFilter';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  ArrowLeft,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { menuFormSchema } from '@/lib/validation/menuFormSchema';
import { cn } from '@/lib/utils';

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

type FormType = z.infer<typeof menuFormSchema>;

const MenuPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [isLoading, setIsLoading] = useState(true);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    string[]
  >([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  // Initialize form
  const form = useForm<FormType>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      menuName: '',
      menuDescription: '',
      menuImage: [],
      menuCategory: [],
      menuPrice: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'menuImage'
  });

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

  /* =======================
     LOAD SELECTED MENU
  ======================= */
  useEffect(() => {
    if (editId && menuList.length > 0) {
      const menu = menuList.find((m) => m.id === editId);
      if (menu) {
        setSelectedMenu(menu);
        form.reset({
          menuName: menu.name,
          menuDescription: menu.description,
          menuImage: menu.images,
          menuCategory: menu.categoryIDs,
          menuPrice: menu.price.toString()
        });
        console.log('Menu ditemukan:', menu);
      } else {
        console.error('Menu tidak ditemukan dengan ID:', editId);
      }
    }
  }, [editId, menuList, form]);

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

  const onSubmit = async (data: FormType) => {
    try {
      setSubmitting(true);
      console.log('Submit data:', data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Menu berhasil diperbarui!');
      router.push('/menu');
    } catch (error) {
      toast.error('Gagal memperbarui menu');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="m-auto my-20">
        <Loading />
      </div>
    );
  }

  // Edit mode
  if (editId && selectedMenu) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push('/menu')}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' })
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-4xl font-bold text-foreground">
            Perbarui Menu: {selectedMenu?.name}
          </h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 rounded-lg border border-border bg-card p-8 shadow-lg"
          >
            {/* Menu Name */}
            <FormField
              control={form.control}
              name="menuName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Nama Menu
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nama menu"
                      disabled={isSubmitting}
                      className="border-border focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Menu Description */}
            <FormField
              control={form.control}
              name="menuDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Deskripsi
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Deskripsi menu"
                      disabled={isSubmitting}
                      className="min-h-24 resize-none border-border focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Menu Price */}
            <FormField
              control={form.control}
              name="menuPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Harga (IDR)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0"
                      type="number"
                      disabled={isSubmitting}
                      className="border-border focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories */}
            <FormField
              control={form.control}
              name="menuCategory"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Kategori
                  </FormLabel>
                  <div className="space-y-3">
                    {categoryList.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="menuCategory"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  category.id
                                )}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...value,
                                      category.id
                                    ]);
                                  } else {
                                    field.onChange(
                                      value.filter(
                                        (id) => id !== category.id
                                      )
                                    );
                                  }
                                }}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {category.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <FormField
              control={form.control}
              name="menuImage"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Gambar
                  </FormLabel>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-end gap-3"
                      >
                        <FormField
                          control={form.control}
                          name={`menuImage.${index}.url`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="URL gambar"
                                  disabled={isSubmitting}
                                  className="border-border focus:ring-2 focus:ring-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={isSubmitting}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ url: '' })}
                    disabled={isSubmitting}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Gambar
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => router.push('/menu')}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Batal
              </button>

              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Normal view
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
                <div
                  key={menu.id}
                  onClick={() => {
                    console.log('Navigasi ke edit menu:', menu.id);
                    router.push(`/menu?edit=${menu.id}`);
                  }}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <MenuCard
                    menu={menu}
                    toggleDialog={() => {}}
                    index={0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
