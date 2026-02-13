'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  useUserProfile,
  LoadingState,
  ErrorState,
  SuccessMessage,
  ProfileHeader,
  ProfileCard,
  ProfileForm,
  QuickActions,
  getHomeRoute
} from '@/components/user/profile';

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    isSaving,
    successMessage,
    errors,
    formData,
    isAdmin,
    handleInputChange,
    handleSave,
    handleCancel,
    handleBack
  } = useUserProfile(userId);

  if (isLoading) return <LoadingState />;
  if (!user) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <SuccessMessage message={successMessage} />
        <ProfileHeader
          onBack={handleBack}
          onEdit={() => setIsEditing(true)}
          isEditing={isEditing}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <ProfileCard user={user} isAdmin={isAdmin} />
            <QuickActions
              onHome={() => router.push(getHomeRoute(user))}
            />
          </div>

          <div className="lg:col-span-2">
            <ProfileForm
              user={user}
              formData={formData}
              errors={errors}
              isEditing={isEditing}
              isSaving={isSaving}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
