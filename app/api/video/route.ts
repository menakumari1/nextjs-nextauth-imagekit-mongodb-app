import { dbConnect } from "@/lib/db";
import { IVideo } from "@/models/Video";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
    try {
        await dbConnect()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()
        
        if(!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        return NextResponse.json(videos);

    }catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try{
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect()
        const body: IVideo = await request.json();
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const videoData = {
            ...body,
            controls: body.controls || true,
            transformation:{
                height:1920,
                width:1080,
                quality:body.transformation?.quality ?? 100
            },
        };
        const newVideo= await Video.create(videoData)
        return NextResponse.json(newVideo)

    }catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    
}