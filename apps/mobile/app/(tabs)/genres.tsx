import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import { FeedList } from '../../components/FeedList';

const GENRES = [
  'Techno', 'House', 'Drum & Bass', 'Jungle', 'Garage',
  'Grime', 'Ambient', 'Industrial', 'Breaks', 'Footwork',
];

export default function GenresFeed() {
  const [genre, setGenre] = useState(GENRES[0]);
  const { reviews, loading, refreshing, load, refresh, toggleUpvote } = useFeed('genre', genre);

  const switchGenre = (g: string) => {
    setGenre(g);
    load(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}
      >
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => switchGenre(g)}
            style={[styles.chip, genre === g && styles.chipActive]}
          >
            <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  chips: { position: 'absolute', top: 100, zIndex: 5 },
  chipsContent: { paddingHorizontal: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  chipActive: {
    backgroundColor: '#ff5500',
    borderColor: '#ff5500',
  },
  chipText: { color: '#fff', fontSize: 13 },
  chipTextActive: { fontWeight: '700' },
});
