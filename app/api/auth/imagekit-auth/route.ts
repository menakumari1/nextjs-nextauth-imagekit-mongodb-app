import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try{
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
            });

        return Response.json({ authenticationParameters, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })


    }catch (error) {
        console.error("Error generating upload auth params:", error);
        return Response.json({ error: "Failed to generate upload auth parameters" }, { status: 500 });
    }
}