import {
  default as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
  SkeletonTypeMap,
} from '@mui/material/Skeleton';

export type SkeletonProps<
  D extends React.ElementType = SkeletonTypeMap['defaultComponent']
> = MuiSkeletonProps<D, { component?: D }> & {};

export const Skeleton = <
  D extends React.ElementType = SkeletonTypeMap['defaultComponent']
>({
  ...props
}: SkeletonProps<D>) => (
  <MuiSkeleton {...props}></MuiSkeleton>
);
