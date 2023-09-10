import { currentProfile } from "@/lib/currentProfile";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface IProps {
  params: {
    serverId: string;
  };
}
export async function PATCH(req: Request, { params: { serverId } }: IProps) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required.", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[PATCH_SERVER_ID_INVITE-CODE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
