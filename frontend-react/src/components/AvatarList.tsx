import { Avatar, AvatarGroup, AvatarProps } from 'src/ui-components';

export type AvatarListProps = {
  srcs: AvatarProps['src'][];
  avatarSize: number;
};

export const AvatarList = ({ srcs, avatarSize }: AvatarListProps) => {
  return (
    <AvatarGroup
      spacing={'small'}
      slotProps={{ additionalAvatar: { sx: { width: avatarSize, height: avatarSize } } }}
      max={3}
    >
      {srcs.map((src, i) => (
        <Avatar key={i} size={avatarSize} src={src}></Avatar>
      ))}
    </AvatarGroup>
  );
};
