'use client';

import { useMemo } from 'react';
import { PlayCircle, Info } from 'lucide-react';
import { LearnMaterialContent } from '@/lib/service/lesson';

interface VideoViewerProps {
    material: LearnMaterialContent;
}

// handle youtube video
const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    const ytMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
    );
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    }
    const vimeoMatch = url.match(
        /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/,
    );
    if (vimeoMatch && vimeoMatch[3]) {
        return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }
    return url;
};

export function VideoViewer({ material }: VideoViewerProps) {
    const videoData = material.video_data;

    const embedUrl = useMemo(
        () => getEmbedUrl(videoData?.video_url),
        [videoData?.video_url],
    );

    if (!videoData) {
        return (
            <div className="text-muted-foreground bg-muted/20 rounded-xl border p-8 text-center">
                Video data is missing.
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            <div className="ring-border/50 group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={material.title}
                        className="absolute top-0 left-0 h-full w-full border-0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                ) : (
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                        <PlayCircle className="mb-2 h-12 w-12 opacity-50" />
                        <p>Invalid video URL</p>
                    </div>
                )}
            </div>

            {videoData.description &&
                videoData.description.trim() !== '<p></p>' && (
                    <div className="bg-card border-border/60 rounded-xl border p-6 shadow-sm">
                        <div className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                            <Info className="text-primary h-5 w-5" />
                            <h3>About this lesson</h3>
                        </div>

                        <div
                            className="prose prose-slate dark:prose-invert text-muted-foreground prose-p:leading-relaxed prose-a:text-primary max-w-none text-sm sm:text-base"
                            dangerouslySetInnerHTML={{
                                __html: videoData.description,
                            }}
                        />
                    </div>
                )}
        </div>
    );
}
