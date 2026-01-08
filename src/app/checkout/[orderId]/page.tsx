'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Copy,
  CheckCircle,
  Upload,
  AlertCircle,
  X
} from 'lucide-react';
import Loading from '@/components/Loading';
import { toast } from 'sonner';

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: any[];
}

const CheckoutConfirmationPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'qris' | 'transfer'
  >('qris');
  const [copiedText, setCopiedText] = useState('');

  // Form state
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofImagePreview, setProofImagePreview] = useState('');
  const [confirmationNotes, setConfirmationNotes] = useState('');

  // Dummy data
  const BANK_ACCOUNT = '1234567890';
  const BANK_NAME = 'Bank Tabungan Negara (BTN)';
  const ACCOUNT_NAME = 'CRSD BTN';
  const QRIS_CODE =
    'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126360014ID.CO.QRISDDATA5204500753033606107' +
    '12345678906304F500';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && orderId) {
      loadOrderData();
    }
  }, [mounted, orderId]);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      if (!orderId) {
        router.push('/');
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Gagal mengambil data pesanan');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitConfirmation = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      if (!order) {
        toast.error('Data pesanan tidak ditemukan');
        return;
      }

      if (!proofImage) {
        toast.error('Silakan upload bukti transfer');
        return;
      }

      const formData = new FormData();
      formData.append('order_code', order.order_code);
      formData.append('payment_method', paymentMethod);
      formData.append('proof_image', proofImage);
      if (confirmationNotes.trim()) {
        formData.append('notes', confirmationNotes);
      }

      const response = await fetch(
        `http://localhost:8000/api/orders/${order.id}/confirm-payment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Pembayaran berhasil dikonfirmasi');
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal mengonfirmasi pembayaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} disalin ke clipboard`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 dark:bg-slate-900">
        <div className="text-6xl">❌</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Order ID: {orderId}
        </p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700"
        >
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const totalPrice =
    typeof order.total_price === 'string'
      ? parseInt(order.total_price)
      : order.total_price;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Konfirmasi Pembayaran
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Pesanan Anda telah dibuat, silakan lakukan pembayaran
          </p>
        </div>

        {/* Order Code Card */}
        <div className="mb-8 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10 sm:p-6">
          <p className="mb-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Nomor Pesanan Anda
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
              {order.order_code}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                copyToClipboard(order.order_code, 'Order Code')
              }
              className="h-8 w-8 flex-shrink-0"
            >
              {copiedText === 'Order Code' ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-700"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900 dark:text-white">
                        {item.menu?.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="ml-2 flex-shrink-0 font-semibold text-slate-900 dark:text-white">
                      Rp{' '}
                      {(
                        parseFloat(item.price) * item.quantity
                      ).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white sm:text-lg">
                    Total
                  </span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Metode Pembayaran
              </h2>

              <div className="space-y-3">
                {/* QRIS Option */}
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-600"
                  style={{
                    borderColor:
                      paymentMethod === 'qris' ? '#10b981' : undefined
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={paymentMethod === 'qris'}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value as 'qris' | 'transfer'
                      )
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      QRIS
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Scan dengan e-wallet Anda
                    </p>
                  </div>
                </label>

                {/* Bank Transfer Option */}
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-600"
                  style={{
                    borderColor:
                      paymentMethod === 'transfer'
                        ? '#10b981'
                        : undefined
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value as 'qris' | 'transfer'
                      )
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Transfer Bank
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Transfer ke rekening bank
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
              {paymentMethod === 'qris' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Scan QRIS
                  </h3>
                  <div className="flex flex-col items-center">
                    <img
                      src={QRIS_CODE}
                      alt="QRIS Code"
                      className="h-48 w-48 rounded-lg border-4 border-slate-200 dark:border-slate-700 sm:h-56 sm:w-56"
                    />
                    <p className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                      Scan dengan aplikasi e-wallet Anda
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                      <p className="text-xs text-blue-800 dark:text-blue-300 sm:text-sm">
                        Pastikan Anda sudah melakukan pembayaran
                        sebelum menutup aplikasi
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Detail Rekening Bank
                  </h3>

                  {/* Bank Name */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
                    <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      Nama Bank
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white sm:text-lg">
                        {BANK_NAME}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(BANK_NAME, 'Bank')
                        }
                        className="h-8 w-8 flex-shrink-0"
                      >
                        {copiedText === 'Bank' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
                    <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      Nomor Rekening
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono font-semibold text-slate-900 dark:text-white sm:text-lg">
                        {BANK_ACCOUNT}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(
                            BANK_ACCOUNT,
                            'Nomor Rekening'
                          )
                        }
                        className="h-8 w-8 flex-shrink-0"
                      >
                        {copiedText === 'Nomor Rekening' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
                    <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      Atas Nama
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white sm:text-lg">
                        {ACCOUNT_NAME}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(
                            ACCOUNT_NAME,
                            'Nama Rekening'
                          )
                        }
                        className="h-8 w-8 flex-shrink-0"
                      >
                        {copiedText === 'Nama Rekening' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                      <p className="text-xs text-blue-800 dark:text-blue-300 sm:text-sm">
                        Transfer{' '}
                        <strong>
                          Rp {totalPrice.toLocaleString('id-ID')}
                        </strong>{' '}
                        ke rekening di atas
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Proof & Notes */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Unggah Bukti Transfer
              </h2>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
                    Bukti Transfer{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-600 dark:bg-slate-900 sm:p-6">
                    {proofImagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={proofImagePreview}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProofImage(null);
                            setProofImagePreview('');
                          }}
                          className="mx-auto"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="text-xs font-medium text-slate-900 dark:text-white sm:text-sm">
                          Klik untuk upload atau drag gambar
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          PNG, JPG, JPEG (Max 5MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
                    Catatan{' '}
                    <span className="text-slate-400">(Opsional)</span>
                  </label>
                  <textarea
                    placeholder="Contoh: Sudah transfer jam 10 pagi..."
                    value={confirmationNotes}
                    onChange={(e) =>
                      setConfirmationNotes(e.target.value)
                    }
                    className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-400"
                    maxLength={500}
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {confirmationNotes.length} / 500 karakter
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                    Status Pesanan
                  </p>
                  <p className="mt-1 font-bold text-yellow-600 dark:text-yellow-400">
                    Menunggu Pembayaran
                  </p>
                </div>

                {order.notes && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                    <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                      Catatan Pesanan
                    </p>
                    <p className="line-clamp-3 text-xs text-slate-900 dark:text-white sm:text-sm">
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                    Waktu Pemesanan
                  </p>
                  <p className="text-xs text-slate-900 dark:text-white sm:text-sm">
                    {new Date(order.created_at).toLocaleString(
                      'id-ID'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmitConfirmation}
                disabled={isSubmitting || !proofImage}
                className="w-full bg-emerald-600 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 animate-spin">⏳</span>
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Konfirmasi
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/')}
                disabled={isSubmitting}
                className="w-full text-sm sm:text-base"
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AlertDialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
          <AlertDialogHeader>
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-600 sm:h-16 sm:w-16" />
            </div>
            <AlertDialogTitle className="text-center text-xl sm:text-2xl">
              Pembayaran Dikonfirmasi!
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-center">
              <p className="text-xs sm:text-base">
                Bukti transfer Anda telah diterima. Admin akan
                memverifikasi dalam waktu singkat.
              </p>
              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                Nomor Pesanan:{' '}
                <span className="font-mono font-bold">
                  {order?.order_code}
                </span>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => {
              setShowSuccessModal(false);
              router.push('/orders');
            }}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Lihat Pesanan Saya
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CheckoutConfirmationPage;
