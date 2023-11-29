import { styled } from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { messageStyles } from 'src/pages/chat/shared/ChatMessage/ChatMessage.styled';
import { Box, Icon, IconButton, Stack, Typography } from 'src/ui-components';
import { getDuration, toDuration } from 'src/utils/audio-utils';

const StyledVoiceMessage = styled(Box)({
  ...messageStyles,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  width: 200,
}) as typeof Box;

const StyledDurationBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  backgroundColor: theme.palette.grey[200],
  zIndex: -1,
})) as typeof Box;

const playingAudioAtom = atom<HTMLAudioElement | null>(null);

export type ChatMessageContentVoiceMessageProps = {
  src: string;
};

export const ChatMessageContentVoiceMessage = ({ src }: ChatMessageContentVoiceMessageProps) => {
  const audio = useMemo(() => new Audio(src), [src]);
  const [playingAudio, setPlayingAudio] = useAtom(playingAudioAtom);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const isPlaying = playingAudio === audio;

  useEffect(() => {
    let _duration = 0;

    getDuration(src).then((result) => {
      _duration = result;
      setDuration(_duration);
    });

    audio.addEventListener('ended', () => {
      setPlayingAudio(null);
      setCurrentTime(0);
      audio.currentTime = 0;
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
  }, []);

  useEffect(() => {
    if (playingAudio === audio) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playingAudio]);

  const handleVoiceMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    const { left, width } = target.getBoundingClientRect();

    const clickedPlace = e.clientX - left;
    const newTime = (clickedPlace / width) * duration;

    audio.currentTime = newTime;
  };

  const time = useMemo(() => {
    const currentTimeInt = Math.ceil(currentTime);
    const durationInt = Math.ceil(duration);
    return `${toDuration(currentTimeInt)} / ${toDuration(durationInt)}`;
  }, [currentTime, duration]);

  const durationBarWidth = `${(currentTime / duration) * 100}%`;
  return (
    <Stack alignItems={'center'}>
      <IconButton onClick={() => (isPlaying ? setPlayingAudio(null) : setPlayingAudio(audio))}>
        <Icon name={isPlaying ? 'pause' : 'play_arrow'} />
      </IconButton>
      <StyledVoiceMessage onClick={handleVoiceMessageClick}>
        <StyledDurationBar style={{ width: durationBarWidth }}></StyledDurationBar>
        <Typography>{time}</Typography>
      </StyledVoiceMessage>
    </Stack>
  );
};
