import { Linking } from 'react-native';

export function buildWidgetUrl(soundcloudUrl: string, cueSeconds?: number | null): string {
  const params = new URLSearchParams({
    url: soundcloudUrl,
    color: '%23ff5500',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'false',
  });

  if (cueSeconds != null) {
    params.set('start_track', '0');
  }

  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export async function openInSoundCloud(
  soundcloudUrl: string,
  soundcloudId: string,
  cueSeconds?: number | null,
): Promise<void> {
  const startAt = cueSeconds != null ? `?start_at=${cueSeconds}` : '';
  const nativeUrl = `soundcloud://tracks/${soundcloudId}${startAt}`;

  const canOpen = await Linking.canOpenURL(nativeUrl);
  if (canOpen) {
    await Linking.openURL(nativeUrl);
  } else {
    const webUrl =
      cueSeconds != null
        ? `${soundcloudUrl}#t=${formatCue(cueSeconds)}`
        : soundcloudUrl;
    await Linking.openURL(webUrl);
  }
}

function formatCue(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
