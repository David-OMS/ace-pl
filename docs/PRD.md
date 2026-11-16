# ACE PL — Product Requirements Document (PRD)

**Version:** 1.0 — Initial Product Definition  
**Product:** ACE PL  
**Category:** Community Football League & Fantasy Football Application

> This is the original product definition. Where it differs from `DECISIONS.md`, **`DECISIONS.md` wins**:
> it records what was agreed after this document was written (e.g. resolved outstanding decisions, stats tracked, fantasy rules).

---

## 1. Product Overview

ACE PL is a football league and fantasy football application built around an existing community of six-a-side footballers.

The application digitises the organisation and tracking of monthly football tournaments, records player performances, maintains league standings and introduces a fantasy football competition.

ACE PL is intended to make the existing football experience more competitive, engaging and measurable without introducing unnecessary administrative overhead.

### Core objectives

1. Maintain a central record of players and their performances.
2. Organise monthly tournaments with manually selected, shuffled teams.
3. Generate fixtures and maintain tournament standings.
4. Record match results and individual player contributions.
5. Provide historical player and tournament statistics.
6. Introduce fantasy football with player valuations and budget constraints.
7. Introduce community-driven features such as Fraud Watch and tournament awards.

## 2. Users and Access

ACE PL distinguishes between a football player and an application user.

A person can use ACE PL without participating in the actual football league.

### User categories

**Administrator**
- Manage players and user accounts.
- Create and configure tournaments.
- Create teams and assign players.
- Generate and modify fixtures.
- Enter match results and statistics.
- Manage borrowed players and transfers.
- Manage fantasy player rankings.
- Manage Fraud Watch and tournament awards.

There can be multiple administrators. An administrator can also be a registered football player.

**Football Player**
- Has a registered football profile.
- Appears in tournament statistics.
- Can participate in matches.
- Can be selected for fantasy teams.

**Fantasy User**
- Can participate in fantasy football without being a registered football player.
- Can create and manage fantasy squads.
- Can compete on the fantasy leaderboard.

A person can be both a football player and a fantasy user.

## 3. Player Management

Every football player has a profile.

### Player profile fields

| Field | Description |
|---|---|
| Name | Player's name |
| Profile picture | Player photograph |
| Primary position | Assigned by an administrator |
| Account | Optional linked application account |

Positions are assigned by administrators rather than selected freely by players.

A player's position can be changed for an individual match without necessarily changing their default profile position.

### Player statistics

Player profiles should contain:

- Total appearances.
- Goals.
- Assists.
- Clean sheets.
- Saves.
- Goals conceded.
- Man of the Match awards.

Statistics should be accessible for individual tournaments and across all tournaments.

## 4. Tournament Management

Each month represents an independent tournament.

Every tournament has its own:
- Name.
- Start and end dates.
- Participating players.
- Teams.
- Fixtures.
- Match results.
- League table.
- Player statistics.
- Awards.
- Fantasy competition.

### Team creation

Teams are created manually by administrators.

Players are manually assigned to teams at the beginning of each tournament.

Teams are reshuffled between tournaments to create different combinations of players.

Team names may be reused, but historical records must distinguish between different tournament editions.

The application must preserve the actual composition and performance of each tournament's teams.

### Tournament lifecycle

1. Administrator creates a tournament.
2. Players are selected.
3. Teams are created and players assigned.
4. Fixtures are generated.
5. Fixtures are published.
6. Matches are played.
7. Results and statistics are entered.
8. League standings and player rankings update.
9. Tournament concludes.
10. Awards and historical records are preserved.

## 5. Fixture Management

The application should automatically generate tournament fixtures after teams have been created.

Administrators should be able to configure the fixture generation process.

### Initial configuration parameters

- Number of participating teams.
- Number of game days.
- Number of matches per game day.
- Tournament scheduling format.
- Match scheduling arrangements.

Generated fixtures must be editable before publication.

Administrators should be able to:
- View all fixtures.
- Rearrange fixtures.
- Change match dates or game days.
- Update scheduled matches.
- Record completed matches.

The fixture system must accommodate both four-team and five-team tournaments.

## 6. Match Results and Statistics

ACE PL does not require a live match centre.

Matches are played normally, and administrators enter the results and statistics afterwards.

### Match result fields

- Participating teams.
- Final score.
- Match status.
- Players who actually participated.
- Goalscorers.
- Assists.
- Goalkeeper saves.
- Goals conceded.
- Clean sheet eligibility.
- Man of the Match.

### Statistics recording

Statistics should be recorded through individual match events and player contributions rather than manually maintaining unrelated cumulative totals.

This allows the application to calculate tournament statistics automatically.

Administrators should be able to correct previously entered information.

### Out of scope for initial statistics

The application will not attempt to record:
- Shots.
- Shots on target.
- Tackles.
- Interceptions.
- Big chances.
- Other statistics requiring detailed live observation.

The priority is reliable and realistically maintainable data.

## 7. League Table

Every tournament has its own league table.

### Required columns

| Column | Meaning |
|---|---|
| POS | Position |
| TEAM | Team name |
| P | Played |
| W | Wins |
| D | Draws |
| L | Losses |
| GF | Goals for |
| GA | Goals against |
| GD | Goal difference |
| PTS | Points |

Standard scoring:
- Win: 3 points.
- Draw: 1 point.
- Loss: 0 points.

Goal difference is calculated as goals scored minus goals conceded.

Standings update automatically after match results are saved.

## 8. Player Leaderboards

Each tournament has individual player rankings.

Available leaderboards:

- Top goalscorers.
- Top assist providers.
- Most clean sheets.
- Most saves.
- Most appearances.
- Most Man of the Match awards.
- Overall player points.

Players should be rankable from highest to lowest in each category.

Historical leaderboards must remain accessible after a tournament ends.

An all-time statistics view should aggregate performances across tournaments.

## 9. Borrowed Players and Transfers

The application must support the reality that players may represent different teams during a tournament.

### Temporary borrowing

A player can temporarily represent another team for a match.

Example:

David is registered to Team A but plays for Team B in a particular fixture.

In this situation:
- David's individual contributions belong to David.
- His goals and assists count towards his individual tournament statistics.
- His contributions count towards Team B's match result.
- His registered team remains Team A.
- The borrowing arrangement is recorded against the relevant match.

### Permanent transfer

A player can permanently change teams during an active tournament.

The application should preserve:
- Previous team.
- New team.
- Transfer date.

Historical match contributions must not be reassigned following a transfer.

## 10. Fantasy Football

ACE PL includes a fantasy football competition running alongside the actual tournament.

Fantasy users assemble squads using real football players registered in ACE PL.

The objective is to select players who accumulate the most fantasy points through their actual tournament performances.

### Player valuation

The proposed valuation system uses four player categories:

| Rank | Proposed price |
|---|---|
| S | Highest |
| A | High |
| B | Medium |
| C | Lowest |

Players within the same category have the same price.

Rankings are initially assigned by administrators.

Rankings and prices should be established before the fantasy competition begins.

The final ranking methodology and price amounts remain undecided.

### Fantasy squad management

Users should be able to:
- Create a fantasy squad.
- Select players within a fixed budget.
- View player prices.
- View player performance and statistics.
- View their accumulated fantasy points.
- Compete against other fantasy users.

Squad size, formations, transfer rules, budget and captaincy rules remain to be determined.

### Fantasy scoring

Fantasy points are calculated from actual player contributions.

Proposed scoring categories include:

| Event | Fantasy impact |
|---|---|
| Goal | Positive points |
| Assist | Positive points |
| Clean sheet | Positive points |
| Save | Positive points |
| Goals conceded | Negative points |
| Penalty saved | Positive points |

Goalkeeper scoring must account for both saves and goals conceded.

For example, a goalkeeper who makes eight saves but concedes four goals should receive credit for the saves while also receiving the appropriate goals-conceded deduction.

The actual point values and position-specific scoring rules will be established separately.

### Fantasy leaderboard

A separate leaderboard ranks fantasy users according to the points accumulated by their selected squads.

Fantasy results are preserved after each tournament.

## 11. Player Form

Player form is a representation of recent performance.

A possible implementation is to display a player's contributions across their last three matches.

For example:
- Goals in the last three matches.
- Assists in the last three matches.
- Clean sheets in the last three matches.

This is a supplementary feature and does not need to be part of the initial release.

## 12. Fraud Watch

Fraud Watch is a manually managed entertainment feature.

Administrators can add players who are currently under scrutiny and remove them when appropriate.

Requirements:
- Display a maximum of one or two players at a time.
- Record how many consecutive weeks a player has remained on Fraud Watch.
- Preserve previous Fraud Watch appearances.
- Display current and historical Fraud Watch records.

Fraud Watch is not automated or calculated from player statistics.

## 13. Tournament Awards

Each tournament concludes with awards.

### Ballon d'Or

The tournament's main individual award.

The winner is determined through a combination of:
- Fan votes.
- Actual player contributions.

The intention is to prevent the award from becoming purely a popularity contest.

The final weighting and calculation methodology will be defined separately.

The winner should not be publicly predictable through a live results counter.

### Other proposed awards

- Golden Boot: Most goals.
- Playmaker Award: Most assists.
- Golden Glove: Best goalkeeper.
- Man of the Tournament: Overall tournament performance.

Award eligibility and calculations will be determined separately.

## 14. News and Announcements

ACE PL may include a news section for tournament-related information.

Potential content:
- Tournament announcements.
- Match results and reports.
- Player achievements.
- Fraud Watch updates.
- Award announcements.
- Other football-related news.

Content is managed by administrators.

This feature is secondary to the core tournament and fantasy functionality.

## 15. Historical Records

The application must preserve completed tournaments.

Historical records should include:

**Tournament history**
- Tournament details.
- Participating players.
- Team compositions.
- Fixtures.
- Results.
- League standings.
- Player statistics.
- Awards.

**Player history**
- Tournament appearances.
- Goals and assists.
- Clean sheets.
- Saves.
- Awards.
- Previous teams represented.

**Team combination history**
- Team composition for each tournament.
- Matches played.
- Wins, draws and losses.
- Goals for and against.
- Final tournament position.

**Fantasy history**
- Fantasy users.
- Selected squads.
- Points accumulated.
- Final rankings.

Completed tournament records should not be overwritten when a new tournament begins.

## 16. Administration Dashboard

The application requires a dedicated administrative area.

Administrators should be able to manage:

| Module | Operations |
|---|---|
| Players | Register, approve, edit and deactivate |
| Teams | Create and assign players |
| Tournaments | Create, configure and conclude |
| Fixtures | Generate, edit and publish |
| Match results | Enter and correct results |
| Statistics | Record and correct contributions |
| Borrowing | Manage temporary appearances |
| Transfers | Manage permanent team changes |
| Fantasy | Manage ranks, prices and scoring |
| Fraud Watch | Add and remove players |
| Awards | Manage voting and winners |
| News | Publish announcements |

Important administrative changes should be traceable, especially changes to match results and player statistics.

## 17. Application Navigation

Proposed primary navigation:

1. Home
2. League
3. Fixtures
4. Players
5. Fantasy
6. News
7. Profile

The administrative dashboard is accessed separately by authorised administrators.

### Homepage

The homepage should prioritise:

- Current tournament.
- Upcoming fixtures.
- Current league table.
- Top-performing players.
- Latest results.
- Fraud Watch.
- Fantasy competition.
- Recent announcements.

## 18. Initial Development Scope

### Release 1 — Core application

- User accounts and player profiles.
- Player registration and approval.
- Tournament creation.
- Manual team selection.
- Fixture generation.
- Fixture management.
- Match result entry.
- Player statistics.
- League tables.
- Player leaderboards.
- Temporary borrowing and permanent transfers.
- Tournament archives.
- Basic administrator dashboard.

### Release 2 — Fantasy and competition features

- Fantasy squad creation.
- Player rankings and valuations.
- Fantasy budgets.
- Fantasy scoring.
- Fantasy leaderboard.
- Fraud Watch.
- Player form.

### Release 3 — Awards and additional features

- Ballon d'Or voting and calculation.
- Tournament awards.
- News and announcements.
- Player comparisons.
- Historical records and additional statistics.

---

## 19. Outstanding Decisions

The following items require agreement before their respective features are implemented.

| Area | Outstanding decision |
|---|---|
| Tournament | Exact tournament scheduling format |
| Fixtures | Match duration and scheduling rules |
| Player registration | Self-registration process and approval |
| Positions | Available positions and classification |
| Transfers | Rules governing permanent transfers |
| Borrowing | Whether borrowed players can represent their original team in the same game day |
| Fantasy | Squad size and formation |
| Fantasy | Starting budget |
| Fantasy | Player rank allocation |
| Fantasy | Scoring values |
| Fantasy | Transfer and selection deadlines |
| Awards | Ballon d'Or weighting |
| Awards | Voting eligibility |
| Discipline | Whether cards and suspensions are tracked |

These decisions should be resolved as the relevant development modules are prepared.

---

## 20. Product Principles

ACE PL should follow these principles throughout development:

1. **Practicality over complexity:** Only collect information that can realistically be maintained.
2. **Accurate records:** Player contributions must follow the player, regardless of the team represented in a particular match.
3. **Tournament independence:** Each monthly tournament maintains its own records without overwriting previous tournaments.
4. **Minimal administration:** Match statistics should be quick to enter after games.
5. **Separation of competitions:** Actual football standings and fantasy standings are independent.
6. **Historical preservation:** Completed tournaments and player records remain accessible.
7. **Room for expansion:** The application should accommodate additional competitions and features without requiring a complete redesign.

**Product vision:** ACE PL turns an existing community football experience into an organised, measurable and competitive football ecosystem, with fantasy football and community engagement built around the actual game.
