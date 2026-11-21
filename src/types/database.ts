export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      change_log: {
        Row: {
          action: string
          actor_id: string | null
          after_row: Json | null
          before_row: Json | null
          created_at: string
          id: number
          reason: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_row?: Json | null
          before_row?: Json | null
          created_at?: string
          id?: never
          reason?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_row?: Json | null
          before_row?: Json | null
          created_at?: string
          id?: never
          reason?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_events: {
        Row: {
          assist_player_id: string | null
          created_at: string
          event_type: Database["public"]["Enums"]["match_event_type"]
          fixture_id: string
          id: string
          player_id: string
          quantity: number
          sort_order: number
          tournament_id: string
          updated_at: string
        }
        Insert: {
          assist_player_id?: string | null
          created_at?: string
          event_type: Database["public"]["Enums"]["match_event_type"]
          fixture_id: string
          id?: string
          player_id: string
          quantity?: number
          sort_order?: number
          tournament_id: string
          updated_at?: string
        }
        Update: {
          assist_player_id?: string | null
          created_at?: string
          event_type?: Database["public"]["Enums"]["match_event_type"]
          fixture_id?: string
          id?: string
          player_id?: string
          quantity?: number
          sort_order?: number
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_events_assist_player_id_fkey"
            columns: ["assist_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_fixture_id_tournament_id_fkey"
            columns: ["fixture_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id", "tournament_id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      match_participations: {
        Row: {
          created_at: string
          fixture_id: string
          id: string
          is_goalkeeper: boolean
          player_id: string
          position: Database["public"]["Enums"]["player_position"] | null
          status: Database["public"]["Enums"]["participation_status"]
          team_id: string
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fixture_id: string
          id?: string
          is_goalkeeper?: boolean
          player_id: string
          position?: Database["public"]["Enums"]["player_position"] | null
          status?: Database["public"]["Enums"]["participation_status"]
          team_id: string
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fixture_id?: string
          id?: string
          is_goalkeeper?: boolean
          player_id?: string
          position?: Database["public"]["Enums"]["player_position"] | null
          status?: Database["public"]["Enums"]["participation_status"]
          team_id?: string
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_participations_fixture_id_tournament_id_fkey"
            columns: ["fixture_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id", "tournament_id"]
          },
          {
            foreignKeyName: "match_participations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participations_team_id_tournament_id_fkey"
            columns: ["team_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "tournament_id"]
          },
        ]
      }
      fantasy_gameweek_picks: {
        Row: {
          applied_points: number
          created_at: string
          game_day_id: string
          in_xi: boolean
          is_bench: boolean
          is_captain: boolean
          is_vice: boolean
          player_id: string
          raw_points: number
          slot: number
          team_id: string
          updated_at: string
        }
        Insert: {
          applied_points?: number
          created_at?: string
          game_day_id: string
          in_xi?: boolean
          is_bench?: boolean
          is_captain?: boolean
          is_vice?: boolean
          player_id: string
          raw_points?: number
          slot: number
          team_id: string
          updated_at?: string
        }
        Update: {
          applied_points?: number
          created_at?: string
          game_day_id?: string
          in_xi?: boolean
          is_bench?: boolean
          is_captain?: boolean
          is_vice?: boolean
          player_id?: string
          raw_points?: number
          slot?: number
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_gameweek_picks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_gameweek_picks_team_id_game_day_id_fkey"
            columns: ["team_id", "game_day_id"]
            isOneToOne: false
            referencedRelation: "fantasy_team_gameweeks"
            referencedColumns: ["team_id", "game_day_id"]
          },
        ]
      }
      fantasy_picks: {
        Row: {
          created_at: string
          is_bench: boolean
          is_captain: boolean
          is_vice: boolean
          player_id: string
          purchase_price: number
          slot: number
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_bench?: boolean
          is_captain?: boolean
          is_vice?: boolean
          player_id: string
          purchase_price?: number
          slot: number
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_bench?: boolean
          is_captain?: boolean
          is_vice?: boolean
          player_id?: string
          purchase_price?: number
          slot?: number
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_picks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_picks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "fantasy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      fantasy_player_prices: {
        Row: {
          created_at: string
          player_id: string
          price: number
          rank: Database["public"]["Enums"]["fantasy_rank"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          player_id: string
          price: number
          rank?: Database["public"]["Enums"]["fantasy_rank"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          player_id?: string
          price?: number
          rank?: Database["public"]["Enums"]["fantasy_rank"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_player_prices_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      fantasy_player_ranks: {
        Row: {
          created_at: string
          player_id: string
          price: number
          rank: Database["public"]["Enums"]["fantasy_rank"]
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          player_id: string
          price: number
          rank?: Database["public"]["Enums"]["fantasy_rank"]
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          player_id?: string
          price?: number
          rank?: Database["public"]["Enums"]["fantasy_rank"]
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_player_ranks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_player_ranks_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      fantasy_team_gameweeks: {
        Row: {
          created_at: string
          formation: string
          game_day_id: string
          points: number
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          formation: string
          game_day_id: string
          points?: number
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          formation?: string
          game_day_id?: string
          points?: number
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_team_gameweeks_game_day_id_fkey"
            columns: ["game_day_id"]
            isOneToOne: false
            referencedRelation: "game_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_team_gameweeks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "fantasy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      fantasy_teams: {
        Row: {
          bank: number
          created_at: string
          formation: string
          free_transfers: number
          id: string
          name: string
          name_change_count: number
          total_points: number
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bank: number
          created_at?: string
          formation: string
          free_transfers?: number
          id?: string
          name: string
          name_change_count?: number
          total_points?: number
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bank?: number
          created_at?: string
          formation?: string
          free_transfers?: number
          id?: string
          name?: string
          name_change_count?: number
          total_points?: number
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ballon_dor_rounds: {
        Row: {
          created_at: string
          id: string
          status: Database["public"]["Enums"]["ballon_dor_status"]
          tournament_id: string
          updated_at: string
          voting_closes_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ballon_dor_status"]
          tournament_id: string
          updated_at?: string
          voting_closes_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ballon_dor_status"]
          tournament_id?: string
          updated_at?: string
          voting_closes_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ballon_dor_rounds_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: true
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      ballon_dor_shortlist: {
        Row: {
          player_id: string
          round_id: string
          stats_score: number
        }
        Insert: {
          player_id: string
          round_id: string
          stats_score?: number
        }
        Update: {
          player_id?: string
          round_id?: string
          stats_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ballon_dor_shortlist_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballon_dor_shortlist_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "ballon_dor_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      ballon_dor_votes: {
        Row: {
          created_at: string
          player_id: string
          round_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          player_id: string
          round_id: string
          voter_id: string
        }
        Update: {
          created_at?: string
          player_id?: string
          round_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ballon_dor_votes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballon_dor_votes_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "ballon_dor_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballon_dor_votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fantasy_transfers: {
        Row: {
          created_at: string
          game_day_id: string | null
          id: string
          player_in_id: string
          player_out_id: string
          point_cost: number
          team_id: string
        }
        Insert: {
          created_at?: string
          game_day_id?: string | null
          id?: string
          player_in_id: string
          player_out_id: string
          point_cost?: number
          team_id: string
        }
        Update: {
          created_at?: string
          game_day_id?: string | null
          id?: string
          player_in_id?: string
          player_out_id?: string
          point_cost?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_transfers_game_day_id_fkey"
            columns: ["game_day_id"]
            isOneToOne: false
            referencedRelation: "game_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_transfers_player_in_id_fkey"
            columns: ["player_in_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_transfers_player_out_id_fkey"
            columns: ["player_out_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fantasy_transfers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "fantasy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_watch_entries: {
        Row: {
          caption: string | null
          created_at: string
          ended_on: string | null
          id: string
          player_id: string | null
          started_on: string
          team_id: string | null
          tournament_id: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          ended_on?: string | null
          id?: string
          player_id?: string | null
          started_on?: string
          team_id?: string | null
          tournament_id?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          ended_on?: string | null
          id?: string
          player_id?: string | null
          started_on?: string
          team_id?: string | null
          tournament_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_watch_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_watch_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_watch_entries_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      fixtures: {
        Row: {
          away_team_id: string
          created_at: string
          game_day_id: string
          home_team_id: string
          id: string
          kickoff_time: string
          status: Database["public"]["Enums"]["fixture_status"]
          tournament_id: string
          updated_at: string
          walkover_winner_team_id: string | null
        }
        Insert: {
          away_team_id: string
          created_at?: string
          game_day_id: string
          home_team_id: string
          id?: string
          kickoff_time: string
          status?: Database["public"]["Enums"]["fixture_status"]
          tournament_id: string
          updated_at?: string
          walkover_winner_team_id?: string | null
        }
        Update: {
          away_team_id?: string
          created_at?: string
          game_day_id?: string
          home_team_id?: string
          id?: string
          kickoff_time?: string
          status?: Database["public"]["Enums"]["fixture_status"]
          tournament_id?: string
          updated_at?: string
          walkover_winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_tournament_id_fkey"
            columns: ["away_team_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "tournament_id"]
          },
          {
            foreignKeyName: "fixtures_game_day_id_tournament_id_fkey"
            columns: ["game_day_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "game_days"
            referencedColumns: ["id", "tournament_id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_tournament_id_fkey"
            columns: ["home_team_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "tournament_id"]
          },
          {
            foreignKeyName: "fixtures_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      game_days: {
        Row: {
          created_at: string
          id: string
          played_on: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          played_on: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          id?: string
          played_on?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_days_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      team_memberships: {
        Row: {
          created_at: string
          id: string
          is_captain: boolean
          joined_on: string
          left_on: string | null
          player_id: string
          team_id: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_captain?: boolean
          joined_on?: string
          left_on?: string | null
          player_id: string
          team_id: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_captain?: boolean
          joined_on?: string
          left_on?: string | null
          player_id?: string
          team_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_team_id_tournament_id_fkey"
            columns: ["team_id", "tournament_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "tournament_id"]
          },
        ]
      }
      teams: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          tournament_id: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          tournament_id: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_awards: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["award_kind"]
          player_id: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["award_kind"]
          player_id: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["award_kind"]
          player_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_awards_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_keepers: {
        Row: {
          created_at: string
          player_id: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          player_id: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          player_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_keepers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_keepers_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_players: {
        Row: {
          created_at: string
          player_id: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          player_id: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          player_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_players_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          ends_on: string | null
          fantasy_budget: number
          first_place_tiebreak: Database["public"]["Enums"]["first_place_tiebreak"]
          id: string
          keeper_mode: Database["public"]["Enums"]["keeper_mode"]
          matches_per_game_day: number
          name: string
          players_on_pitch: number
          squad_size: number
          starts_on: string | null
          status: Database["public"]["Enums"]["tournament_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_on?: string | null
          fantasy_budget?: number
          first_place_tiebreak?: Database["public"]["Enums"]["first_place_tiebreak"]
          id?: string
          keeper_mode?: Database["public"]["Enums"]["keeper_mode"]
          matches_per_game_day?: number
          name: string
          players_on_pitch?: number
          squad_size?: number
          starts_on?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_on?: string | null
          fantasy_budget?: number
          first_place_tiebreak?: Database["public"]["Enums"]["first_place_tiebreak"]
          id?: string
          keeper_mode?: Database["public"]["Enums"]["keeper_mode"]
          matches_per_game_day?: number
          name?: string
          players_on_pitch?: number
          squad_size?: number
          starts_on?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
        }
        Relationships: []
      }
      player_claim_tokens: {
        Row: {
          created_at: string
          player_id: string
          token: string
        }
        Insert: {
          created_at?: string
          player_id: string
          token?: string
        }
        Update: {
          created_at?: string
          player_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_claim_tokens_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          photo_path: string | null
          position: Database["public"]["Enums"]["player_position"]
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          photo_path?: string | null
          position: Database["public"]["Enums"]["player_position"]
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          photo_path?: string | null
          position?: Database["public"]["Enums"]["player_position"]
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_player_to_team: {
        Args: { target_player_id: string; target_team_id: string }
        Returns: undefined
      }
      lagos_today: { Args: never; Returns: string }
      set_team_captain: {
        Args: { target_player_id: string; target_team_id: string }
        Returns: undefined
      }
      can_manage_player_photo: {
        Args: { object_name: string }
        Returns: boolean
      }
      claim_player: { Args: { claim_token: string }; Returns: string }
      preview_claim: { Args: { claim_token: string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      clear_my_player_photo: { Args: never; Returns: undefined }
      set_my_player_photo: {
        Args: { new_photo_path: string }
        Returns: undefined
      }
    }
    Enums: {
      award_kind: "golden_boot" | "playmaker" | "golden_glove" | "ballon_dor"
      ballon_dor_status: "closed" | "open" | "revealed"
      fantasy_rank: "S" | "A" | "B" | "C"
      first_place_tiebreak: "discipline" | "playoff"
      fixture_status: "draft" | "published" | "completed" | "postponed" | "void" | "walkover"
      keeper_mode: "per_team" | "shared"
      match_event_type:
        | "goal"
        | "own_goal"
        | "saves"
        | "penalty_save"
        | "yellow_card"
        | "red_card"
        | "motm"
      participation_status: "played" | "unused_sub" | "absent"
      player_position: "GK" | "DEF" | "MID" | "FWD"
      tournament_status: "setup" | "active" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      award_kind: ["golden_boot", "playmaker", "golden_glove", "ballon_dor"],
      ballon_dor_status: ["closed", "open", "revealed"],
      fantasy_rank: ["S", "A", "B", "C"],
      first_place_tiebreak: ["discipline", "playoff"],
      fixture_status: ["draft", "published", "completed", "postponed", "void", "walkover"],
      keeper_mode: ["per_team", "shared"],
      match_event_type: [
        "goal",
        "own_goal",
        "saves",
        "penalty_save",
        "yellow_card",
        "red_card",
        "motm",
      ],
      participation_status: ["played", "unused_sub", "absent"],
      player_position: ["GK", "DEF", "MID", "FWD"],
      tournament_status: ["setup", "active", "completed"],
    },
  },
} as const
