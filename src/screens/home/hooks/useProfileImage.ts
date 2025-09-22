import { useState, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import { ProfileImage, UseProfileImageReturn } from '../../../types/donor_types';

export function useProfileImage(photoUrl?: string): UseProfileImageReturn {
  const basedImage: ImageSourcePropType = require("../../../../assets/images/profile2.webp");
  const [image, setImage] = useState<ProfileImage>(basedImage);

  useEffect(() => {
    setImage(photoUrl ? { uri: photoUrl } : basedImage);
  }, [photoUrl, basedImage]);

  return { image, setImage };
}