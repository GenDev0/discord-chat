import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

import ChatHeader from "@/components/chat/chat-header";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};
const ChannelIdPage = async ({
  params: { serverId, channelId },
}: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect(`/`);
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type={"channel"}
      />
    </div>
  );
};
export default ChannelIdPage;
