import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}
const InvitePage = async ({ params: { inviteCode } }: InvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer}`);
  }

  const serverExists = await db.server.findFirst({
    where: {
      inviteCode,
    },
  });

  if (!serverExists) {
    return (
      <div className='flex justify-center items-center py-16'>
        <h1 className='text-3xl font-bold'>Server not found !</h1>
        <br />
      </div>
    );
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};
export default InvitePage;
