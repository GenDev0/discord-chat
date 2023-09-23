type MemberIdPageProps = {
  params: {
    serverId: string;
    memberId: string;
  };
};
const MemberIdPage = ({
  params: { serverId, memberId },
}: MemberIdPageProps) => {
  return (
    <div>
      serverId : {serverId} <br />
      MemberId : {memberId}
    </div>
  );
};
export default MemberIdPage;
