import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

import ServerHeader from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!server) {
    return redirect("/");
  }
  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader server={server} role={role} />
    </div>
  );
};
export default ServerSidebar;