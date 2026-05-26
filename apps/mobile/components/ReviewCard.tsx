import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { Review } from '../types';
import { SideActions } from './SideActions';
import { TrackBar } from './TrackBar';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  review: Review;
  isVisible: boolean;
  onUpvote: (id: string) => void;
  onComment: (review: Review) => void;
}

export const ReviewCard = React.memo(function ReviewCard({
  review,
  isVisible,
  onUpvote,
  onComment,
}: Props) {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const handleUpvote = useCallback(() => onUpvote(review.id), [onUpvote, review.id]);
  const handleComment = useCallback(() => onComment(review), [onComment, review]);
  const goToProfile = useCallback(
    () => router.push(`/profile/${review.reviewer.username}`),
    [router, review.reviewer.username],
  );

  return (
    <View style={styles.card}>
      {/* Background video */}
      {review.background_video_url ? (
        <Video
          ref={videoRef}
          source={{ uri: review.background_video_url }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay={isVisible}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fallbackBg]} />
      )}

      <View style={[StyleSheet.absoluteFill, styles.gradient]} />

      <SideActions
        review={review}
        onUpvote={handleUpvote}
        onComment={handleComment}
      />

      {/* Lower overlay */}
      <View style={styles.lower}>
        <TouchableOpacity onPress={goToProfile} activeOpacity={0.8}>
          <Text style={styles.username}>@{review.reviewer.username}</Text>
        </TouchableOpacity>
        <Text style={styles.body} numberOfLines={4}>
          {review.body}
        </Text>
      </View>

      <TrackBar track={review.track} cueSeconds={review.cue_seconds} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#111',
  },
  fallbackBg: {
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    background: Platform.OS === 'web'
      ? 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9) 100%)'
      : undefined,
    backgroundColor: Platform.OS !== 'web' ? 'transparent' : undefined,
  },
  lower: {
    position: 'absolute',
    bottom: 160,
    left: 12,
    right: 70,
    gap: 6,
  },
  username: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});
