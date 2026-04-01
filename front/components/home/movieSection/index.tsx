import { SORTS, TAGS } from '@/constants/category';
import MovieSection from './MovieSection';

export default function MovieSections() {
  return (
    <>
      {SORTS.map((sort) => (
        <MovieSection
          key={sort.id}
          type="sort"
          label={sort.name}
          id={sort.id}
          sortKey={sort.key}
        />
      ))}
      {TAGS.map((tag) => (
        <MovieSection key={tag.id} type="genre" label={tag.name} id={tag.id} />
      ))}
    </>
  );
}
