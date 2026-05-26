import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';

const TABS = [
  { name: 'index', label: 'Following' },
  { name: 'trending', label: 'Trending' },
  { name: 'genres', label: 'Sub-Genres' },
] as const;

function TopBar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const active =
          path === '/' ? t.name === 'index' : path.includes(t.name);
        return (
          <TouchableOpacity
            key={t.name}
            onPress={() => router.replace(t.name === 'index' ? '/' : `/${t.name}`)}
            style={styles.tab}
          >
            <Text style={[styles.label, active && styles.active]}>{t.label}</Text>
            {active && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.search} onPress={() => {}}>
        <Text style={styles.searchIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{
        headerShown: true,
        header: () => <TopBar />,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="trending" />
      <Tabs.Screen name="genres" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  tab: {
    marginRight: 20,
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    fontSize: 15,
  },
  active: {
    color: '#fff',
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#ff5500',
    marginTop: 3,
    borderRadius: 1,
  },
  search: {
    marginLeft: 'auto',
  },
  searchIcon: {
    fontSize: 18,
  },
});
