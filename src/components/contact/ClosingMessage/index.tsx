'use client';

export const ClosingMessage = () => {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-8 text-center dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl">
        <h3 className="text-2xl font-bold">
          Terima Kasih atas Kepercayaan Anda
        </h3>
        <p className="mt-4 text-lg text-muted-foreground">
          Sistem pemesanan makanan internal BTN hadir untuk
          meningkatkan produktivitas dan kenyamanan kerja Anda.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3">
          <span className="font-semibold text-primary">
            🎯 Kepuasan BTNers adalah Prioritas Kami
          </span>
        </div>
      </div>
    </div>
  );
};
