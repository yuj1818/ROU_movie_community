'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { REGIONS } from '@/constants/region';

export default function RegionSelect({
  initCity = '',
  initDistrict = '',
  onChange,
}: {
  initCity?: string;
  initDistrict?: string;
  onChange: (region: string) => void;
}) {
  const [city, setCity] = useState(initCity);
  const [district, setDistrict] = useState(initDistrict);

  useEffect(() => {
    if (city && district) {
      onChange(`${city} ${district}`);
    }
  }, [city, district]);

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="district" value={district} />
      <Select
        value={city}
        onValueChange={(v) => {
          setCity(v);
          setDistrict('');
        }}
      >
        <SelectTrigger className="h-8 p-2 flex-1 min-w-0 rounded border border-input text-base">
          <SelectValue placeholder="시/도 선택" />
        </SelectTrigger>
        <SelectContent position="popper" className="z-9999">
          {Object.keys(REGIONS).map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={district}
        onValueChange={(v) => setDistrict(v)}
        disabled={!city}
      >
        <SelectTrigger className="h-8 p-2 flex-1 min-w-0 rounded border border-input text-base">
          <SelectValue placeholder="시/군/구 선택" />
        </SelectTrigger>
        <SelectContent position="popper" className="z-9999">
          {city &&
            REGIONS[city].map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
