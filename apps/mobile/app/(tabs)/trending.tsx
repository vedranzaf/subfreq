import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import { FeedList } from '../../components/FeedList';

export default function TrendingFeed() {
  const { reviews, loading, refreshing, load, refresh, toggleUpvote } = useFeed('trending');

  useEffect(() => { load(true); }, []);

  return (
    <View style={styles.container}>
      <FeedList
        reviews={reviews}
        onEndReached={() => load()}
        onRefresh={refresh}
        refreshing={refreshing}
        onUpvote={toggleUpvote}
        onComment={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
