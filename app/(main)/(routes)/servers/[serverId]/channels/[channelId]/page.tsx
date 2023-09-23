type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};
const ChannelIdPage = ({
  params: { serverId, channelId },
}: ChannelIdPageProps) => {
  return (
    <div>
      serverId : {serverId} <br />
      ChannelId : {channelId}
    </div>
  );
};
export default ChannelIdPage;
