import type { APIRoute } from "astro";

import ytdl from "ytdl-core";

export const GET: APIRoute = async ({ url}) => {
    const id = url.searchParams.get('videoId');

    if (!id) return new Response(JSON.stringify({
        error: 'Video Id must be required',
    }), { status: 400 });

    const videoUrl = `https://www.youtube.com/watch?v=${id}`;

    const info = await ytdl.getInfo(videoUrl);
    if (!info) return new Response(JSON.stringify({
        error: 'Video not found',
    }), { status: 404 });

    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const format = audioFormats.at(0);

    return new Response(
        ytdl(videoUrl, { format }),
        {
            headers: {
                'Content-Type': format?.mimeType!,
                'Content-Disposition': `attachment; filename="${encodeURI(info.videoDetails.title)}.mp3"`
            }
        }
    )
}