import { useState } from 'react';

export const useNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [notificationsCount] = useState(0); // To be implemented later

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    showLogoutDialog,
    setShowLogoutDialog,
    notificationsCount,
    closeMobileMenu,
    toggleMobileMenu
  };
};