function determineReleaseStatus(dateString) {
    if (!dateString) return 'tbd';
    const releaseDate = new Date(dateString);
    const today = new Date();
    if (releaseDate > today) return 'scheduled';
    return 'released';
}

function mapShowToItem(tmdbShow) {
    return {
        id: `tmdb_show_${tmdbShow.id}`,
        media_type: 'show',
        title: tmdbShow.name,
        release_date: tmdbShow.first_air_date || null,
        release_status: determineReleaseStatus(tmdbShow.first_air_date),
        description: tmdbShow.overview
    };
}

function mapSeasonToItem(tmdbSeason, showId) {
    const seasonId = `tmdb_season_${tmdbSeason.id}`;
    return {
        item: {
            id: seasonId,
            media_type: 'season',
            title: tmdbSeason.name,
            release_date: tmdbSeason.air_date || null,
            release_status: determineReleaseStatus(tmdbSeason.air_date),
        },
        connection: {
            parent_id: showId,
            child_id: seasonId,
            connection_order: tmdbSeason.season_number
        }
    };
}

function mapEpisodeToItem(tmdbEpisode, seasonId) {
    const episodeId = `tmdb_episode_${tmdbEpisode.id}`;
    return {
        item: {
            id: episodeId,
            media_type: 'episode',
            title: tmdbEpisode.name,
            release_date: tmdbEpisode.air_date || null,
            release_status: determineReleaseStatus(tmdbEpisode.air_date),
            runtime: tmdbEpisode.runtime || 0
        },
        connection: {
            parent_id: seasonId,
            child_id: episodeId,
            connection_order: tmdbEpisode.episode_number
        }
    };
}

module.exports = {
    mapShowToItem,
    mapSeasonToItem,
    mapEpisodeToItem
};