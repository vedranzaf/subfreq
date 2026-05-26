import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Track } from '../types';
import { openInSoundCloud } from '../lib/soundcloud';

interface Props {
  track: Track;
  cueSeconds: number | null;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function TrackBar({ track, cueSeconds }: Props) {
  const handleOpen = () => {
    openInSoundCloud(track.soundcloud_url, track.soundcloud_id, cueSeconds);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.meta}>
        <Text style={styles.note}>♫</Text>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {track.artist} — {track.title}
          </Text>
          {cueSeconds != null && (
            <Text style={styles.cue}>⚡ Highlight cue: {formatTime(cueSeconds)}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.cta} onPress={handleOpen} activeOpacity={0.85}>
        <Text style={styles.ctaText}>▶  LISTEN ON SOUNDCLOUD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 12,
    marginBottom: 28,
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  note: {
    fontSize: 20,
    color: '#ff5500',
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  cue: {
    color: '#ff5500',
    fontSize: 12,
    marginTop: 2,
  },
  cta: {
    backgroundColor: '#ff5500',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
