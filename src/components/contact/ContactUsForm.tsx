// 'use client';

// import { useEffect, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
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
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Loader2 } from 'lucide-react';
// import { contactUsFormSchema } from '@/lib/validation/contactUsFormSchema';

// type formType = z.infer<typeof contactUsFormSchema>;

// const ContactUsForm = () => {
//   const [isSubmitting, setSubmitting] = useState(false);

//   const form = useForm<formType>({
//     resolver: zodResolver(contactUsFormSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       subject: '',
//       message: ''
//     }
//   });

//   useEffect(() => {
//     form.reset({
//       name: '',
//       email: '',
//       subject: '',
//       message: ''
//     });
//   }, [form.formState.isSubmitSuccessful]);

//   const onSubmit = async (
//     data: z.infer<typeof contactUsFormSchema>
//   ) => {
//     try {
//       setSubmitting(true);

//       const response = await fetch('/api/send', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: data.name,
//           email: data.email,
//           subject: data.subject,
//           message: data.message
//         })
//       });

//       if (response.ok) {
//         setSubmitting(false);
//         toast.success(`Email has been sent successfully.`);
//       } else {
//         setSubmitting(false);
//         const body = await response.json();
//         if (body.message) {
//           toast.error(body.message);
//         } else {
//           toast.error('An unexpected error occurred');
//         }
//       }
//     } catch (error) {
//       setSubmitting(false);
//       toast.error('An unexpected error is occured');
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="mx-auto mb-8 mt-5 flex max-w-md flex-col gap-3"
//       >
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   placeholder="Contact name"
//                   type="text"
//                   disabled={isSubmitting}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   placeholder="example@email.com"
//                   type="email"
//                   disabled={isSubmitting}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="subject"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Subject</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   placeholder="Subject"
//                   type="text"
//                   disabled={isSubmitting}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="message"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Message</FormLabel>
//               <FormControl>
//                 <Textarea
//                   {...field}
//                   placeholder="Type message..."
//                   className="resize-none"
//                   disabled={isSubmitting}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             className="flex w-28 gap-1 text-right"
//             disabled={isSubmitting}
//           >
//             {isSubmitting && (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             )}
//             Send
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default ContactUsForm;

'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { contactUsFormSchema } from '@/lib/validation/contactUsFormSchema';

type formType = z.infer<typeof contactUsFormSchema>;

const ContactUsForm = () => {
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  }, [form.formState.isSubmitSuccessful, form]);

  const onSubmit = async (
    data: z.infer<typeof contactUsFormSchema>
  ) => {
    try {
      setSubmitting(true);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        })
      });

      if (response.ok) {
        setSubmitting(false);
        toast.success('Pesan Anda telah terkirim dengan berhasil!');
      } else {
        setSubmitting(false);
        const body = await response.json();
        toast.error(
          body.message || 'Terjadi kesalahan yang tidak terduga'
        );
      }
    } catch (error) {
      setSubmitting(false);
      toast.error('Terjadi kesalahan yang tidak terduga');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@crsdBtn.com'
    },
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 XXX XXXX XXXX'
    },
    {
      icon: MapPin,
      title: 'Lokasi',
      value: 'Jakarta, Indonesia'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      value: '09:00 - 22:00 WIB'
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          Hubungi Kami
        </h1>
        <p className="text-lg text-muted-foreground">
          Kami siap membantu Anda. Silakan isi formulir di bawah atau
          hubungi kami melalui informasi kontak yang tersedia.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Contact Info Cards */}
        <div className="space-y-6 lg:col-span-1">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {info.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {info.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Kirim Pesan
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name & Email Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Nama
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nama Anda"
                            type="text"
                            disabled={isSubmitting}
                            className="border-border focus:ring-2 focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="email@example.com"
                            type="email"
                            disabled={isSubmitting}
                            className="border-border focus:ring-2 focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Subjek
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Topik pertanyaan Anda"
                          type="text"
                          disabled={isSubmitting}
                          className="border-border focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Pesan
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tuliskan pesan Anda di sini..."
                          className="min-h-40 resize-none border-border focus:ring-2 focus:ring-primary"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </form>
            </Form>

            {/* Info Message */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Kami biasanya merespon dalam waktu 24 jam
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 rounded-lg border border-border bg-muted/30 p-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Berapa lama waktu pengiriman?
            </h3>
            <p className="text-sm text-muted-foreground">
              Waktu pengiriman rata-rata 30-45 menit untuk area
              Jakarta.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Apakah ada biaya pengiriman?
            </h3>
            <p className="text-sm text-muted-foreground">
              Biaya pengiriman tergantung jarak. Gratis untuk
              pembelian di atas Rp 100.000.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Bagaimana cara membatalkan pesanan?
            </h3>
            <p className="text-muted-foregound text-sm">
              Anda dapat membatalkan pesanan dalam 5 menit pertama
              setelah pemesanan.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Metode pembayaran apa saja yang diterima?
            </h3>
            <p className="text-sm text-muted-foreground">
              Kami menerima transfer bank, e-wallet, dan pembayaran
              tunai di tempat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsForm;
