'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Contact,
  Heart,
  MessageSquareText,
  Star,
  TvMinimal,
} from 'lucide-react';
import SocialTab from './social/SocialTab';
import { useState } from 'react';
import MoviesTab from './MoviesTab';

export default function InfoTabs() {
  const [activeTab, setActiveTab] = useState<string>('like');

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full"
    >
      <TabsList
        variant="line"
        className="w-full overflow-x-auto overflow-y-hidden shrink-0 mb-4"
      >
        <TabsTrigger value="like">
          <Heart /> 좋아요
        </TabsTrigger>
        <TabsTrigger value="review">
          <MessageSquareText /> 리뷰
        </TabsTrigger>
        <TabsTrigger value="favorite">
          <Star />찜
        </TabsTrigger>
        <TabsTrigger value="watch">
          <TvMinimal />
          시청
        </TabsTrigger>
        <TabsTrigger value="social">
          <Contact /> 소셜
        </TabsTrigger>
      </TabsList>
      {activeTab === 'social' ? (
        <SocialTab />
      ) : (
        <MoviesTab target={activeTab} />
      )}
    </Tabs>
  );
}
