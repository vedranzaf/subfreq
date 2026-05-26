import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, ViewToken } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ReviewCard } from './ReviewCard';
import { Review } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  reviews: Review[];
  onEndReached: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  onUpvote: (id: string) => void;
  onComment: (review: Review) => void;
}

export function FeedList({
  reviews,
  onEndReached,
  onRefresh,
  refreshing,
  onUpvote,
  onComment,
}: Props) {
  const [visibleId, setVisibleId] = useState<string | null>(reviews[0]?.id ?? null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first) setVisibleId(first.item.id as string);
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderItem = useCallback(
    ({ item }: { item: Review }) => (
      <ReviewCard
        review={item}
        isVisible={item.id === visibleId}
        onUpvote={onUpvote}
        onComment={onComment}
      />
    ),
    [visibleId, onUpvote, onComment],
  );

  return (
    <FlashList
      data={reviews}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      estimatedItemSize={SCREEN_HEIGHT}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      decelerationRate="fast"
      snapToAlignment="start"
    />
  );
}
