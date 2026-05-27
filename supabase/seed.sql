-- ─── Demo Users ──────────────────────────────────────────────────────────────
insert into users (id, username, bio, follower_count, following_count) values
  ('a1000000-0000-0000-0000-000000000001', 'bassline_archivist',
   'Digging since 2003. If it hasn''t been pressed to wax, I''m suspicious.',
   841, 213),
  ('a1000000-0000-0000-0000-000000000002', 'spectral_ear',
   'Ambient, industrial, post-everything. I write about the silence between notes.',
   634, 180),
  ('a1000000-0000-0000-0000-000000000003', 'frequency_witch',
   'Footwork, juke, and everything that makes your feet forget gravity.',
   419, 302),
  ('a1000000-0000-0000-0000-000000000004', 'tunnel_resonance',
   'Berlin-based. Only music that sounds good at 4am in a dark room.',
   1203, 95),
  ('a1000000-0000-0000-0000-000000000005', 'sublow_dispatch',
   'UK bass, dub, and the spaces where they converge. Sub-100hz evangelism.',
   558, 441)
on conflict (username) do nothing;

-- ─── Demo Tracks ─────────────────────────────────────────────────────────────
insert into tracks (id, soundcloud_id, title, artist, artwork_url, soundcloud_url, duration_ms, genre) values
  ('b1000000-0000-0000-0000-000000000001',
   'burial-archangel',
   'Archangel', 'Burial',
   'https://picsum.photos/seed/burial-archangel/300/300',
   'https://soundcloud.com/burial-official/archangel',
   229000, 'UK Garage'),

  ('b1000000-0000-0000-0000-000000000002',
   'actress-hubble',
   'Hubble', 'Actress',
   'https://picsum.photos/seed/actress-hubble/300/300',
   'https://soundcloud.com/actress/hubble',
   368000, 'Abstract'),

  ('b1000000-0000-0000-0000-000000000003',
   'shackleton-blood-on-my-hands',
   'Blood On My Hands', 'Shackleton',
   'https://picsum.photos/seed/shackleton-blood/300/300',
   'https://soundcloud.com/shackleton/blood-on-my-hands',
   742000, 'Dub Techno'),

  ('b1000000-0000-0000-0000-000000000004',
   'dj-stingray-urban-journey',
   'Urban Journey', 'DJ Stingray 313',
   'https://picsum.photos/seed/stingray-urban/300/300',
   'https://soundcloud.com/djstingray313/urban-journey',
   391000, 'Techno'),

  ('b1000000-0000-0000-0000-000000000005',
   'jlin-black-origami',
   'Black Origami', 'Jlin',
   'https://picsum.photos/seed/jlin-origami/300/300',
   'https://soundcloud.com/jlin/black-origami',
   274000, 'Footwork'),

  ('b1000000-0000-0000-0000-000000000006',
   'lee-gamble-mnestic-pressure',
   'Mnestic Pressure', 'Lee Gamble',
   'https://picsum.photos/seed/leegamble-mnestic/300/300',
   'https://soundcloud.com/lee-gamble/mnestic-pressure',
   318000, 'Electronic'),

  ('b1000000-0000-0000-0000-000000000007',
   'demdike-stare-testpressing',
   'Test Pressing #3', 'Demdike Stare',
   'https://picsum.photos/seed/demdike-test3/300/300',
   'https://soundcloud.com/demdike-stare/test-pressing-3',
   524000, 'Techno'),

  ('b1000000-0000-0000-0000-000000000008',
   'svreca-interplay',
   'Interplay', 'Svreca',
   'https://picsum.photos/seed/svreca-interplay/300/300',
   'https://soundcloud.com/svreca/interplay',
   446000, 'Techno')
on conflict (soundcloud_id) do nothing;

-- ─── Demo Reviews ─────────────────────────────────────────────────────────────
insert into reviews (id, reviewer_id, track_id, body, cue_seconds, upvote_count, comment_count, created_at) values

  ('c1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000001',
   'That vocal chop at 1:48 — it''s not music, it''s rain on a window at 3am. Nobody has made loneliness sound this precise before or since. The way it loops back on itself is a kind of grief I didn''t know had a name until I heard this track.',
   108, 841, 23,
   now() - interval '2 days'),

  ('c1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000004',
   'b1000000-0000-0000-0000-000000000003',
   'The kick doesn''t drop until 4:22 and by then Shackleton has completely conditioned your nervous system. He rewires you before he gives you the release. This is how ritual music works — the pattern isn''t the point, the submission is.',
   262, 612, 18,
   now() - interval '1 day'),

  ('c1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000003',
   'b1000000-0000-0000-0000-000000000005',
   'Jlin doesn''t make footwork for the body, she makes it for the part of your brain that runs in parallel. The polyrhythm at 2:14 shouldn''t work — four conflicting time signatures colliding — but your body locks in anyway. That''s the trick. Logic surrenders, instinct takes over.',
   134, 529, 31,
   now() - interval '3 hours'),

  ('c1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000002',
   'b1000000-0000-0000-0000-000000000002',
   'The static at the beginning isn''t intro — it''s the texture. Everything that follows is the static becoming something. One of the most patient openings in electronic music. At 3:40 there''s a harmonic shift so subtle you might convince yourself you imagined it. You didn''t.',
   220, 388, 12,
   now() - interval '5 hours'),

  ('c1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000004',
   'b1000000-0000-0000-0000-000000000004',
   'Stingray operates in a frequency range that most DJs are afraid of. Everything is mid-range and muscle. No hi-hat decoration, no melodic relief. Just function. The 5:10 mark is the closest thing to a pure techno statement I''ve heard in years — purpose without ornament.',
   310, 447, 9,
   now() - interval '1 day'),

  ('c1000000-0000-0000-0000-000000000006',
   'a1000000-0000-0000-0000-000000000005',
   'b1000000-0000-0000-0000-000000000007',
   'Demdike Stare understand that horror and ecstasy occupy adjacent rooms. The transition at 2:58 locks those doors from the outside. The distortion isn''t noise — it''s pressure. You''re not listening to it, it''s pressing against you.',
   178, 334, 7,
   now() - interval '6 hours'),

  ('c1000000-0000-0000-0000-000000000007',
   'a1000000-0000-0000-0000-000000000002',
   'b1000000-0000-0000-0000-000000000006',
   'Lee Gamble is mapping the deterioration of digital signal as an emotional landscape. At 1:35, when the texture starts to fragment, it doesn''t sound like an error — it sounds like forgetting. The most accurate sound design representation of a memory dissolving I''ve ever heard.',
   95, 291, 15,
   now() - interval '2 days'),

  ('c1000000-0000-0000-0000-000000000008',
   'a1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000008',
   'Svreca builds tension through restraint. The entire first four minutes is a single sustained threat. Then at 4:18 the bass finally lands and you realize you''ve been holding your breath the whole time. Techno as controlled withholding.',
   258, 273, 6,
   now() - interval '4 hours')

on conflict (id) do nothing;

-- ─── Update follower counts to reflect seeds ─────────────────────────────────
update users set follower_count = 841  where id = 'a1000000-0000-0000-0000-000000000001';
update users set follower_count = 634  where id = 'a1000000-0000-0000-0000-000000000002';
update users set follower_count = 419  where id = 'a1000000-0000-0000-0000-000000000003';
update users set follower_count = 1203 where id = 'a1000000-0000-0000-0000-000000000004';
update users set follower_count = 558  where id = 'a1000000-0000-0000-0000-000000000005';
