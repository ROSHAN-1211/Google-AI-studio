export type AnimeFormat = 'TV' | 'Movie' | 'OVA';
export type AnimeStatus = 'Airing' | 'Completed' | 'Upcoming';
export type WatchStatus = 'Watching' | 'Plan to Watch' | 'Completed' | 'On Hold' | 'Dropped';

export interface Episode {
  id: number;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  synopsis: string;
  airDate: string;
}

export interface Character {
  id: string;
  name: string;
  japaneseName: string;
  role: 'Main' | 'Supporting' | 'Antagonist';
  voiceActor: {
    name: string;
    japaneseName: string;
    language: string;
  };
  animeTitle: string;
  animeId: string;
  avatar: string;
  banner: string;
  quote: string;
  traits: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number; // 1-10
  date: string;
  content: string;
  helpfulCount: number;
  tag: 'Masterpiece' | 'Recommended' | 'Mixed';
}

export interface Anime {
  id: string;
  title: string;
  japaneseTitle: string;
  romajiTitle: string;
  synopsis: string;
  score: number;
  rank: number;
  popularity: number;
  members: string;
  episodes: number;
  duration: string;
  status: AnimeStatus;
  season: string;
  year: number;
  format: AnimeFormat;
  studio: string;
  genres: string[];
  bannerImage: string;
  coverImage: string;
  accentColor: string;
  airDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  airTime: string;
  nextEpisodeTime?: string;
  episodesList: Episode[];
  characters: Character[];
  reviews: Review[];
  featured?: boolean;
  spotlightHeadline?: string;
  spotlightTagline?: string;
}

export interface UserWatchlistItem {
  animeId: string;
  status: WatchStatus;
  progress: number; // episodes watched
  userScore: number; // 1-10 or 0 for unrated
  updatedAt: string;
  favorite: boolean;
  notes?: string;
}

export interface OSTTrack {
  id: string;
  title: string;
  artist: string;
  animeTitle: string;
  duration: string;
  bpm: number;
  keySignature: string;
  themeType: 'OP' | 'ED' | 'OST';
  coverArt: string;
}
