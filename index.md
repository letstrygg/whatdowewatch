---
layout: default
title: What Do We Watch — Coming Soon
---

<section class="container">
  <h2>Welcome to WhatDoWeWatch</h2>
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
    {% include movie-card.html movie=movie %}
  {% endfor %}
</div>



</section>
