import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserRoleFromFirestore } from '../../services/auth';

export const withRoleGuard = (Component, allowedRoles) => {
  return function RoleGuardedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const auth = getAuth();

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.push('/login');
          return;
        }

        try {
          const userRole = await getUserRoleFromFirestore(user.uid);

          if (!allowedRoles.includes(userRole)) {
            router.push('/invalid');
          }
        } catch (error) {
          router.push('/invalid');
        }

        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    if (loading) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };
};