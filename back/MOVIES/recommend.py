from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.contrib.auth import get_user_model
from .models import Movie
import pandas as pd
import numpy as np
from kiwipiepy import Kiwi
from django.core.cache import cache
from django.db import connection
from django.db.models import Max
import traceback

query = """
SELECT MOVIES_movie.movie_id, MOVIES_movie.title, MOVIES_movie.overview, MOVIES_movie.vote_count, 
  MOVIES_movie.vote_average, MOVIES_movie.popularity, 
  GROUP_CONCAT(MOVIES_genre.name, ',') AS genre_list
FROM MOVIES_movie
LEFT JOIN MOVIES_movie_genres ON MOVIES_movie.movie_id = MOVIES_movie_genres.movie_id
LEFT JOIN MOVIES_genre ON MOVIES_movie_genres.genre_id = MOVIES_genre.id
GROUP BY MOVIES_movie.movie_id;
"""

User = get_user_model()

def recommend_movies(user_id, title):
  try:
    user = User.objects.get(pk=user_id)
    user_like_genres = user.like_genres.all()
    user_hate_genres = user.hate_genres.all()

    with connection.cursor() as cursor:
      cursor.execute(query)
      columns = [col[0] for col in cursor.description]
      data = [dict(zip(columns, row)) for row in cursor.fetchall()]

    df = pd.DataFrame(data)

    tfidf = TfidfVectorizer(stop_words=["이", "는", "에서", "또", "더", "이상", "을", "가", "한", "의"])
    tfidf_matrix = tfidf.fit_transform(df['overview'].dropna())

    indices = pd.Series(df.index, index=df['title']).drop_duplicates()

    idx = indices.get(title)
    if idx is None:
      return []
    
    sim_scores = [x[0] for x in cosine_similarity(tfidf_matrix, tfidf_matrix[idx])]

    for i, genres in enumerate(df['genre_list']):
      if not genres: continue
      movie_genres = genres.split(',')
      if any(genre in movie_genres for genre in user_like_genres):
        sim_scores[i] *= 1.5
      
      if any(genre in movie_genres for genre in user_hate_genres):
        sim_scores[i] *= 0.5

    movie_indices = np.argsort(sim_scores)[::-1][1:19]
    recommended_titles = df['title'].iloc[movie_indices]
    recommended_movies = Movie.objects.filter(title__in=recommended_titles)
    highest_popularity_movies = recommended_movies.values('title').annotate(max_popularity=Max('popularity'))
    
    final_recommended_movies = []
    for movie in recommended_titles:
      # 각 추천 제목에 대해 가장 인기 있는 영화 필터링
      highest_popularity_movie = highest_popularity_movies.filter(title=movie)\
        .order_by('-max_popularity').first()
      if highest_popularity_movie:
        movie_instance = recommended_movies.filter(title=movie, popularity=highest_popularity_movie['max_popularity']).first()
        final_recommended_movies.append(movie_instance)

    return final_recommended_movies
  except User.DoesNotExist:
    return []
  except Exception as e:
    # Log the exception for debugging
    print(f"An error occurred: {e}")
    print(traceback.format_exc())
    return []