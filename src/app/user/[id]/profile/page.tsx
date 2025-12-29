'use client';

import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ContactProfile from '@/components/profile/ContactProfile';
import AuthProfile from '@/components/profile/AuthProfile';
import {
  AuthProfileProps,
  ContactProfileProps
} from '@/types/profile';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User } from '@prisma/client';

type ProfileProps = {
  profile: User;
};

const Profile = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { status, update, data: session } = useSession();
  const { id } = params;

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactProfile, setContactProfile] =
    useState<ContactProfileProps>({
      street: '',
      city: '',
      phone: ''
    });
  const [authProfile, setAuthProfile] = useState<AuthProfileProps>({
    username: '',
    email: ''
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ProfileProps = await response.json();

        setContactProfile({
          street: data.profile.street || '',
          city: data.profile.city || '',
          phone: data.profile.phone || ''
        });
        setAuthProfile({
          username: data.profile.username,
          email: data.profile.email
        });
      } else {
        setIsError(true);
        toast.error('An unexpected error occurred');
      }
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      toast.error('An unexpected error is occured');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateContact = async (
    street: string,
    city: string,
    phone: string
  ) => {
    setContactProfile({
      street: street,
      city: city,
      phone: phone
    });

    await update({
      ...session,
      user: {
        ...session?.user,
        street: street,
        city: city,
        phone: phone
      }
    });
  };

  const handleUpdateAuth = async (
    username: string,
    email: string
  ) => {
    setAuthProfile({
      username: username,
      email: email
    });

    await update({
      ...session,
      user: {
        ...session?.user,
        username: username,
        email: email
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return router.push('/login');
  }

  return (
    <div className="flex flex-grow flex-col">
      <h1 className="text-top my-5 text-4xl font-bold">Profile</h1>
      {!isError ? (
        <Tabs defaultValue="address" className="w-[320px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="authentication">
              Authentication
            </TabsTrigger>
          </TabsList>
          <TabsContent value="address">
            <ContactProfile
              id={id}
              contactProfile={contactProfile}
              handleUpdateContact={handleUpdateContact}
            />
          </TabsContent>
          <TabsContent value="authentication">
            <AuthProfile
              id={id}
              authProfile={authProfile}
              handleUpdateAuth={handleUpdateAuth}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <p className="m-auto text-lg">Something went wrong</p>
      )}
    </div>
  );
};

export default Profile;
