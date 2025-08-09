---
layout: default
title: WhatDoWeWatch — Coming Soon
---

<section class="container">
  <h2>Welcome to whatdowewatch</h2>
  <p class="lead">This is a minimal starter generated for <strong>whatdowewatch.com</strong>.</p>

  <div class="grid">
    <article class="card">
      <h3>Ready to customize</h3>
      <p>Replace this content with your pages, lists, and posts.</p>
    </article>
    <article class="card">
      <h3>Theme</h3>
      <p>Uses the shared theme. Update the theme repo to change styles globally.</p>
    </article>
  </div>


<h2>Want to Watch</h2>

<div class="movie-list">
  {% for movie in site.data.movies %}
  <div class="movie-card">
    <a href="{{ movie.imdb_url }}" target="_blank" rel="noopener">
      <img src="https://image.tmdb.org/t/p/w342{{ movie.poster_path }}" alt="{{ movie.title }} poster" />
    </a>
    <div class="movie-info">
      <h3><a href="{{ movie.imdb_url }}" target="_blank">{{ movie.title }}</a> ({{ movie.year }})</h3>
      <p><strong>Rating:</strong> {{ movie.rating }}</p>
      <p><strong>Runtime:</strong> {{ movie.runtime }}</p>
      <p><strong>TMDb Rating:</strong> {{ movie.tmdb_rating }}/10 ({{ movie.tmdb_votes }} votes)</p>
      <p><strong>Genres:</strong> {{ movie.genres | join: ", " }}</p>
      <p>{{ movie.overview }}</p>
    </div>
  </div>
  {% endfor %}
</div>



<h2>Want to Watch</h2>
<div class="movie-list">
  {% for movie in site.data.movies %}
    {% include movie-card.html movie=movie %}
  {% endfor %}
</div>



</section>
