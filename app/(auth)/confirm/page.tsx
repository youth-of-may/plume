"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import { ensureProfileRecord } from '@/utils/supabase/ensure-profile';

export default function Confirm() {
  const [status, setStatus] = useState("Preparing your account...");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let handled = false;

    async function bootstrapConfirmedUser(user: import('@supabase/supabase-js').User, accessToken: string | undefined) {
      const profileResult = await ensureProfileRecord(
        supabase,
        user,
        {
          name:
            typeof user.user_metadata?.name === "string"
              ? user.user_metadata.name.trim()
              : "",
          username:
            typeof user.user_metadata?.username === "string"
              ? user.user_metadata.username.trim()
              : "",
          ...(accessToken ? { accessToken } : {}),
        }
      );

      if (!profileResult.ok) {
        console.error("Profile bootstrap on confirm failed:", profileResult.error);
        setHasError(true);
        setStatus("Could not complete setup. Redirecting to sign up...");
        setTimeout(() => router.replace("/signup"), 1400);
        return;
      }

      const stored = localStorage.getItem('pending_profile_pic');
      if (stored) {
        try {
          const { base64, name: fileName, type } = JSON.parse(stored);
          const res = await fetch(base64);
          const blob = await res.blob();
          const file = new File([blob], fileName, { type });
          const ext = fileName.split('.').pop();
          const uname = typeof user.user_metadata?.username === 'string'
            ? user.user_metadata.username.trim()
            : user.id;
          const path = `${uname}_profile.${ext}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile_pics')
            .upload(path, file, { upsert: true, contentType: type });
          if (!uploadError && uploadData) {
            await supabase.from('profile').update({ profile_pic_url: uploadData.path }).eq('user_id', user.id);
          }
          localStorage.removeItem('pending_profile_pic');
        } catch (e) {
          console.error('Profile pic upload failed:', e);
        }
      }

      setIsConfirmed(true);
      setStatus("Profile ready. Redirecting to pet selection...");
      setTimeout(() => router.replace("/pet-selection"), 1000);
    }

    // If no SIGNED_IN fires within 10s, the link is invalid/expired.
    const errorTimeout = setTimeout(() => {
      if (!handled) {
        handled = true;
        setHasError(true);
        setStatus("Could not verify your confirmation link. Redirecting to sign up...");
        setTimeout(() => router.replace("/signup"), 1400);
      }
    }, 10000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: import('@supabase/supabase-js').AuthChangeEvent, session: import('@supabase/supabase-js').Session | null) => {
      if (handled) return;

      if (event === 'SIGNED_IN' && session?.user) {
        handled = true;
        clearTimeout(errorTimeout);
        subscription.unsubscribe();
        await bootstrapConfirmedUser(session.user, session.access_token);
      }
      // INITIAL_SESSION with null fires before the hash is processed — ignore it.
    });

    return () => {
      clearTimeout(errorTimeout);
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="bg-[#FBF5D1] px-15 pt-20 pb-15 border-5 border-[#E4DCAB] rounded-4xl justify-items-center shadow-xl/40">
      {isConfirmed && !hasError ? (
        <>
          <h2 className="font-cherry text-[#2E2805] text-7xl pb-10">Account Confirmed</h2>
          <p className="font-delius text-lg text-[#2E2805] mb-8">
            Your account has been confirmed.
          </p>
        </>
      ) : hasError ? (
        <h2 className="font-cherry text-[#2E2805] text-7xl pb-10">Confirmation Failed</h2>
      ) : null}
      <p className="font-delius text-base text-[#2E2805]">
        {status}
      </p>
    </div>
  );
}

