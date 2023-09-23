import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";

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
      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type={"channel"}
        apiUrl={"/api/messages"}
        socketUrl={"/api/socket/messages"}
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey={"channelId"}
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type={"channel"}
        apiUrl={"/api/socket/messages"}
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
};
export default ChannelIdPage;
