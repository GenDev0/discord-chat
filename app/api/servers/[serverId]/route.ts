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
    const { name, imageUrl } = await req.json();

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
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[PATCH_SERVER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params: { serverId } }: IProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required.", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[DELETE_SERVER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
