// Shared types for Story Chord API

// Generate task types for localStorage
export interface GenerateTask {
  style: string;
  story: string;
  voice: string;
  timestamp: number;
  taskId: string;
}

// Story generation types
export interface StoryRequest {
  query: string;
}

export interface StoryResponse {
  story: string;
}

// Style generation types
export interface StyleRequest {
  query: string;
}

export interface StyleResponse {
  style: string;
}

// Lyrics generation types
export interface LyricsRequest {
  query: string;
}

export interface LyricsResponse {
  lyrics: string;
  title?: string;
}

// Song generation types
export interface SongRequest {
  lyrics: string;
  title: string;
  style: string;
  singing_voice: string;
}

export interface SongResponse {
  songs: Array<{
    song_id: string;
    status: string;
    title: string;
    audio: string;
    image: string;
    lyric: string;
    tags: string;
    audio_duration: number;
  }>;
}

// Progress checking types
export interface ProgressRequest {
  song_id: string;
}

export interface ProgressResponse {
  song_id: string;
  status: string;
  title: string;
  audio: string;
  image: string;
  lyric: string;
  tags: string;
  audio_duration: number;
}
