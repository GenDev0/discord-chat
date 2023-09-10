import { Profile } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

interface IProps {
  params: {
    memberId: string;
  };
}
export async function PATCH(req: Request, { params: { memberId } }: IProps) {
  try {
    const profile = await currentProfile();
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams?.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required.", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("Member ID is required.", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log("[PATCH_MEMBER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params: { memberId } }: IProps) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams?.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is required.", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("Member ID is required.", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server);
  } catch (error) {
    console.log("[DELETE_MEMBER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
