import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

import ServerSidebar from "@/components/server/server-sidebar";

interface ServerIdLayoutProps {
  params: {
    serverId: string;
  };
  children: React.ReactNode;
}
const ServerIdLayout = async ({
  children,
  params: { serverId },
}: ServerIdLayoutProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <ServerSidebar serverId={serverId} />
      </div>
      <main className='md:pl-60 h-full'>{children}</main>
    </div>
  );
};
export default ServerIdLayout;
