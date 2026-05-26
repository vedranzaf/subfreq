import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { User, Review } from '../../types';

export default function ProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!username) return;
    api.users.get(username).then(({ user }) => setUser(user));
    api.users.getReviews(username).then(({ reviews }) => setReviews(reviews));
  }, [username]);

  const handleFollow = async () => {
    if (!username) return;
    const { following: next } = await api.users.follow(username);
    setFollowing(next);
    setUser((u) => u ? {
      ...u,
      follower_count: next ? u.follower_count + 1 : u.follower_count - 1,
    } : u);
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#ff5500" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>✕</Text>
      </TouchableOpacity>

      {user.avatar_url && (
        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      )}
      <Text style={styles.username}>@{user.username}</Text>
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{user.follower_count}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{user.following_count}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{reviews.length}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.followBtn, following && styles.followingBtn]}
        onPress={handleFollow}
      >
        <Text style={styles.followBtnText}>{following ? 'Following' : 'Follow'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  back: { position: 'absolute', top: 16, right: 16 },
  backText: { color: '#fff', fontSize: 18 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  username: { color: '#fff', fontSize: 20, fontWeight: '700' },
  bio: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', marginTop: 6, paddingHorizontal: 32 },
  stats: { flexDirection: 'row', gap: 32, marginTop: 20 },
  stat: { alignItems: 'center' },
  statNum: { color: '#fff', fontWeight: '700', fontSize: 18 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  followBtn: {
    marginTop: 20,
    backgroundColor: '#ff5500',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 24,
  },
  followingBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ff5500' },
  followBtnText: { color: '#fff', fontWeight: '700' },
});
