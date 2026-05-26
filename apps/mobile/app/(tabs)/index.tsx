import React, { useEffect, useCallback, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import { FeedList } from '../../components/FeedList';
import { Review } from '../../types';

export default function FollowingFeed() {
  const { reviews, loading, refreshing, load, refresh, toggleUpvote } = useFeed('following');
  const [commentTarget, setCommentTarget] = useState<Review | null>(null);

  useEffect(() => { load(true); }, []);

  const handleComment = useCallback((review: Review) => setCommentTarget(review), []);

  return (
    <View style={styles.container}>
      <FeedList
        reviews={reviews}
        onEndReached={() => load()}
        onRefresh={refresh}
        refreshing={refreshing}
        onUpvote={toggleUpvote}
        onComment={handleComment}
      />
      {/* Comment sheet — placeholder; expand with a BottomSheet library */}
      <Modal
        visible={!!commentTarget}
        transparent
        animationType="slide"
        onRequestClose={() => setCommentTarget(null)}
      >
        <View style={styles.commentSheet} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  commentSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
