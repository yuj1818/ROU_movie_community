from django.core.management.base import BaseCommand
from MOVIES.models import Movie
from MOVIES.models import normalize_title

BATCH_SIZE = 1000


class Command(BaseCommand):
    help = "Backfill normalized_title for all movies"

    def handle(self, *args, **options):
        qs = Movie.objects.all().only("movie_id", "title", "normalized_title")

        total = qs.count()
        self.stdout.write(f"🎬 Target movies: {total}")

        buffer = []
        updated = 0

        for movie in qs.iterator(chunk_size=BATCH_SIZE):
            movie.normalized_title = normalize_title(movie.title)
            buffer.append(movie)

            if len(buffer) >= BATCH_SIZE:
                Movie.objects.bulk_update(buffer, ["normalized_title"])
                updated += len(buffer)
                buffer.clear()
                self.stdout.write(f"⏳ Updated {updated}/{total}")

        if buffer:
            Movie.objects.bulk_update(buffer, ["normalized_title"])
            updated += len(buffer)

        self.stdout.write(
            self.style.SUCCESS(f"✅ Backfill completed: {updated} rows updated")
        )
