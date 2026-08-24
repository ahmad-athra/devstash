import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendAccountDeletionEmail } from "@/lib/mail";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Delete user (Prisma cascade will delete accounts, sessions, items, collections, etc.)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Send confirmation email
    if (userEmail) {
      await sendAccountDeletionEmail(userEmail);
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
