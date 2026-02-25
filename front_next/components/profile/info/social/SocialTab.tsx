import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RelationsTab from './RelationsTab';
import { useState } from 'react';

export default function SocialTab() {
  const [activeTab, setActiveTab] = useState('followers');
  return (
    <TabsContent value="social" className="w-full h-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full"
      >
        <TabsList
          variant="line"
          className="w-full overflow-x-auto overflow-y-hidden"
        >
          <TabsTrigger value="followers">팔로워</TabsTrigger>
          <TabsTrigger value="followings">팔로잉</TabsTrigger>
          <TabsTrigger value="friends">친구</TabsTrigger>
        </TabsList>
        <RelationsTab type={activeTab} />
      </Tabs>
    </TabsContent>
  );
}
