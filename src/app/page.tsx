import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";
import { Feed } from "@/components/feed";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground">Here is what others are aspiring to.</p>
        </div>
        <form action={signout}>
          <Button variant="outline" size="sm">Sign Out</Button>
        </form>
      </header>

      <main>
        <Feed />
      </main>
    </div>
  );
}
