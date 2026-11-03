# Placeholder media — credits

All placeholder footage comes from **Mixkit** under the
[Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree): free for commercial and
personal projects, no attribution required. It's logged here anyway so every clip can be traced
and replaced with the client's own footage.

Files were downloaded once (no hotlinking), trimmed to 10–12 s loops and re-encoded with
`scripts/encode-media.mjs` (H.264 MP4 + VP9 WebM, no audio, ≤1920 px wide, bitrate-capped).
Posters are frames from the encoded loops, converted to AVIF + WebP with sharp.

| File id | Source clip | Source URL |
| --- | --- | --- |
| hero-dusk | Modern house on the beach (#27543) | https://mixkit.co/free-stock-video/modern-house-on-the-beach-27543/ |
| aerial-pullback | Flying over suburban houses with quiet streets (#48394) | https://mixkit.co/free-stock-video/flying-over-suburban-houses-with-quiet-streets-48394/ |
| interior-walk | Interior of a room with terrace (#4029) | https://mixkit.co/free-stock-video/interior-of-a-room-with-terrace-4029/ |
| kitchen-pan | Luxury hotel room panning shot (#4196) | https://mixkit.co/free-stock-video/luxury-hotel-room-panning-shot-4196/ |
| pool-twilight | Luxury swimming pool (#4045) | https://mixkit.co/free-stock-video/luxury-swimming-pool-4045/ |
| exterior-day | Modern houses at the edge of town (#24945) | https://mixkit.co/free-stock-video/modern-houses-at-the-edge-of-town-24945/ |
| living-light | White luxury boutique hotel room (#4046) | https://mixkit.co/free-stock-video/white-luxury-boutique-hotel-room-4046/ |
| hallway | Corridor of an elegant hotel (#34613) | https://mixkit.co/free-stock-video/corridor-of-an-elegant-hotel-34613/ |
| reel-vertical | 9:16 centre crop of the interior walk clip (#4029) | as above |
| reel-pool / reel-room / reel-light | 9:16 centre crops of #4045, #4196 and #4046 | as above |
| bts | Young photographer setting up his camera outdoors (#34408) | https://mixkit.co/free-stock-video/young-photographer-setting-up-his-camera-outdoors-34408/ |

## Stills

The `still-*` images are frames taken from the clips above (same licence), so the site has
consistent placeholder stills without hotlinking. Unsplash/Pexels would need an API key to
fetch programmatically; swap in real stills via `content/media.ts`.

`plan-sample` is a generated 2D floor-plan drawing (no third-party source).
