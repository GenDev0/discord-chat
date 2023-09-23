type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};
const ChannelIdPage = ({
  params: { serverId, channelId },
}: ChannelIdPageProps) => {
  return <div>ChannelIdPage</div>;
};
export default ChannelIdPage;
