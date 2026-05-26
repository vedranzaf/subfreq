import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Review } from '../types';

interface Props {
  review: Review;
  onUpvote: () => void;
  onComment: () => void;
}

export function SideActions({ review, onUpvote, onComment }: Props) {
  const handleShare = async () => {
    await Share.share({
      message: `"${review.body.slice(0, 80)}..." — ${review.reviewer.username} on Subfreq\n\n${review.track.soundcloud_url}`,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.action} onPress={onUpvote} activeOpacity={0.7}>
        <Text style={[styles.icon, review.has_upvoted && styles.active]}>▲</Text>
        <Text style={styles.count}>{review.upvote_count}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action} onPress={onComment} activeOpacity={0.7}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{review.comment_count}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action} onPress={handleShare} activeOpacity={0.7}>
        <Text style={styles.icon}>🔗</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 180,
    alignItems: 'center',
    gap: 20,
  },
  action: {
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 26,
    color: '#fff',
  },
  active: {
    color: '#ff5500',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
