import { useEffect, useRef, useState } from 'react';
import FormField from '../common/FormField';
import RegionSelect from '../common/RegionSelect';
import TextInput from '../common/TextInput';
import { UserInfo } from '@/types/profile';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { useModalContext } from '@/contexts/ModalContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileInfo } from '@/lib/client/profile';

export default function ProfileEditForm({
  nickname,
  region,
  birth,
  profile_image,
  id,
}: UserInfo) {
  const queryClient = useQueryClient();
  const { close } = useModalContext();
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    nickname: nickname,
    region: region,
    birth: birth,
    profile_image: `/api${profile_image}`,
  });
  const fileRef = useRef(null);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProfileInfo(id, formData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', id], (old: UserInfo) =>
        old ? { ...old, ...updatedProfile } : old,
      );

      URL.revokeObjectURL(formValues.profile_image || '');
      close();
    },
  });

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;
    setNewImageFile(targetFile);
    if (formValues.profile_image) {
      URL.revokeObjectURL(formValues.profile_image);
    }
    setFormValues((prev) => ({
      ...prev,
      profile_image: URL.createObjectURL(targetFile),
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (newImageFile) data.append('profile_image', newImageFile);
    data.append('nickname', formValues.nickname);
    data.append('region', formValues.region);
    data.append('birth', formValues.birth);

    mutation.mutate(data);
  };

  useEffect(() => {
    return () => {
      if (formValues.profile_image) {
        URL.revokeObjectURL(formValues.profile_image);
      }
    };
  }, []);

  return (
    <form
      className="w-100 max-w-[85vw] flex flex-col justify-center items-center gap-6 p-4"
      onSubmit={onSubmit}
    >
      <div className="w-2/5 aspect-square rounded-full relative overflow-hidden border border-muted-foreground bg-white">
        <Image
          src={formValues.profile_image || '/profile.png'}
          alt="profile_img"
          fill
          sizes="300px"
          className="object-cover"
        />
        <label
          className="absolute inset-0 flex justify-center items-center bg-black opacity-0 rounded-full cursor-pointer hover:opacity-40"
          htmlFor="file"
        >
          <ImageIcon size="33%" color="white" />
        </label>
        <input
          type="file"
          ref={fileRef}
          id="file"
          className="hidden"
          accept="image/*"
          onChange={onChangeImage}
        />
      </div>
      <FormField label="닉네임" htmlFor="nickname">
        <TextInput
          type="text"
          id="nickname"
          name="nickname"
          value={formValues.nickname}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              nickname: e.target.value,
            }))
          }
        />
      </FormField>
      <FormField label="지역">
        <RegionSelect
          initCity={region.split(' ')[0]}
          initDistrict={region.split(' ')[1]}
          onChange={(region) => setFormValues((prev) => ({ ...prev, region }))}
        />
      </FormField>
      <FormField label="생년월일" htmlFor="birth">
        <TextInput
          type="date"
          id="birth"
          name="birth"
          value={formValues.birth}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              birth: e.target.value,
            }))
          }
        />
      </FormField>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => close()}>
          취소
        </Button>
        <Button>저장</Button>
      </div>
    </form>
  );
}
