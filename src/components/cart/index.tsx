'use client';

import { useCart } from './hooks/useCart';
import { CartSheet } from './components/CartSheet';
import { ClearCartDialog } from './dialogs/ClearCartDialog';
import { EditNotesDialog } from './dialogs/EditNotesDialog';
import { CheckoutNotesDialog } from './dialogs/CheckoutNotesDialog';
import { PendingPaymentDialog } from './dialogs/PendingPaymentDialog';

const Cart = () => {
  const {
    mounted,
    sheetOpen,
    setSheetOpen,
    cartsWithItems,
    totalCartItems,
    totalCartPrice,
    isLoading,
    isUpdating,
    isCheckingOut,
    showClearConfirm,
    setShowClearConfirm,
    showCheckoutDialog,
    setShowCheckoutDialog,
    checkoutNotes,
    setCheckoutNotes,
    showEditNotesDialog,
    setShowEditNotesDialog,
    editingNotes,
    setEditingNotes,
    showPendingPaymentDialog,
    setShowPendingPaymentDialog,
    pendingOrderId,
    handleRemoveItem,
    handleUpdateQuantity,
    handleOpenEditNotesDialog,
    handleUpdateItemNotes,
    handleClearCart,
    handleCheckoutClick,
    handleCheckoutSubmit
  } = useCart();

  return (
    <>
      <CartSheet
        mounted={mounted}
        sheetOpen={sheetOpen}
        onSheetOpenChange={setSheetOpen}
        cartsWithItems={cartsWithItems}
        totalCartItems={totalCartItems}
        totalCartPrice={totalCartPrice}
        isLoading={isLoading}
        isUpdating={isUpdating}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onEditNotes={handleOpenEditNotesDialog}
        onClearCart={() => setShowClearConfirm(true)}
        onCheckout={handleCheckoutClick}
      />

      <ClearCartDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        onConfirm={handleClearCart}
        isUpdating={isUpdating}
      />

      <EditNotesDialog
        open={showEditNotesDialog}
        onOpenChange={setShowEditNotesDialog}
        notes={editingNotes}
        onNotesChange={setEditingNotes}
        onSave={handleUpdateItemNotes}
        isUpdating={isUpdating}
      />

      <CheckoutNotesDialog
        open={showCheckoutDialog}
        onOpenChange={setShowCheckoutDialog}
        notes={checkoutNotes}
        onNotesChange={setCheckoutNotes}
        onCheckout={handleCheckoutSubmit}
        isCheckingOut={isCheckingOut}
      />

      <PendingPaymentDialog
        open={showPendingPaymentDialog}
        onOpenChange={setShowPendingPaymentDialog}
        onContinue={() => {
          setShowPendingPaymentDialog(false);
          if (pendingOrderId) {
            window.location.href = `/checkout/${pendingOrderId}`;
          }
        }}
        pendingOrderId={pendingOrderId}
      />
    </>
  );
};

export default Cart;
