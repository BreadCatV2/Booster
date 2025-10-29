'use client';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

export const Player = () => {
    return (
        <MediaPlayer
            title="Sprite Fight"
            src="https://boostervideos-processed-videos.s3.eu-west-3.amazonaws.com/videos/1db4bf3c-97d8-4e23-a965-7fafbb7a24e1_72260a3b-bc7d-47e2-b23d-92dadd25feae_DinoShooter.mp4/manifest.mpd"
            streamType="on-demand"
            controls
            playsInline
        >
            <MediaProvider />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
    );
}

