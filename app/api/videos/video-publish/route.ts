import { db } from '@/db';
import { videos } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { videoId, active } = await req.json();

  if (!videoId || typeof active !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }

  try {
    const updatedVideo = await db
      .update(videos)
      .set({ active })
      .where(eq(videos.id, videoId))
      .returning();

    if (updatedVideo.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Video updated successfully', video: updatedVideo[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
