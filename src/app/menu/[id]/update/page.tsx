'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import { menuFormSchema } from '@/lib/validation/menuFormSchema';
import { ExtendedMenu } from '@/types/menu';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type MenuProps = {
  menuItem: ExtendedMenu;
};

type ListCategoryProps = {
  categoryList: Category[];
};

type FormType = z.infer<typeof menuFormSchema>;

const MenuEdit = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItem, setMenuItem] = useState<ExtendedMenu>();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isButtonDisable, setIsButtonDisable] = useState(false);

  /* ================= AUTH HANDLING ================= */
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  // 🔥 BYPASS ROLE CHECK (sementara)
  // if (session?.user.role !== 'ADMIN') {
  //   return <p>No access</p>;
  // }

  /* ================= FORM ================= */
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

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([
          fetch('/api/category'),
          fetch(`/api/menu/${params.id}`)
        ]);

        if (!catRes.ok || !menuRes.ok) {
          throw new Error();
        }

        const catData: ListCategoryProps = await catRes.json();
        const menuData: MenuProps = await menuRes.json();

        setCategoryList(catData.categoryList);
        setMenuItem(menuData.menuItem);

        form.reset({
          menuName: menuData.menuItem.name,
          menuDescription: menuData.menuItem.description,
          menuImage: menuData.menuItem.images,
          menuCategory: menuData.menuItem.categoryIDs,
          menuPrice: menuData.menuItem.price.toString()
        });

        setIsLoading(false);
      } catch {
        toast.error('Failed to load data');
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  if (isLoading) {
    return <Loading />;
  }

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: FormType) => {
    try {
      setSubmitting(true);

      const res = await fetch(`/api/menu/${params.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error();

      toast.success('Menu updated');
      router.push(`/user/${session?.user.id}/admin`);
    } catch {
      toast.error('Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="w-[320px]">
      <h1 className="my-5 text-4xl font-bold">Update Menu</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          {/* === FORM FIELD SAMA (AMAN) === */}

          <div className="flex justify-between">
            <Link
              href={`/user/${session?.user.id}/admin`}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'w-28'
              )}
            >
              Cancel
            </Link>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MenuEdit;
