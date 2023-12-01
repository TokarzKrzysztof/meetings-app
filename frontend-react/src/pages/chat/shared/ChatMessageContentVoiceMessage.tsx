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
  width: '100%',
  left: '-100%',
  backgroundColor: theme.palette.grey[200],
  zIndex: -1,
})) as typeof Box;

const playingAudioAtom = atom<HTMLAudioElement | null>(null);

export type ChatMessageContentVoiceMessageProps = {
  src: string;
  id: string;
};

export const ChatMessageContentVoiceMessage = ({
  src,
  id,
}: ChatMessageContentVoiceMessageProps) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [playingAudio, setPlayingAudio] = useAtom(playingAudioAtom);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const isPlaying = playingAudio === audio;

  useEffect(() => {
    setAudio(new Audio(src));
    getDuration(src).then((result) => {
      setDuration(result);
    });
  }, [src]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (playingAudio === audio) {
      audio.play();
      intervalId = setInterval(() => {
        setCurrentTime(audio.currentTime);
      }, 30);
    } else {
      audio?.pause();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [playingAudio]);

  useEffect(() => {
    if (audio && currentTime === duration) {
      setPlayingAudio(null);
      setCurrentTime(0);
      audio.currentTime = 0;
    }
  }, [audio, currentTime, duration]);

  const handleVoiceMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    const { left, width } = target.getBoundingClientRect();

    const clickedPlace = e.clientX - left;
    const newTime = (clickedPlace / width) * duration;

    setCurrentTime(newTime);
    audio!.currentTime = newTime;
  };

  const time = useMemo(() => {
    return `${toDuration(currentTime)} / ${toDuration(duration)}`;
  }, [currentTime, duration]);

  return (
    <Stack alignItems={'center'}>
      <IconButton onClick={() => (isPlaying ? setPlayingAudio(null) : setPlayingAudio(audio!))}>
        <Icon name={isPlaying ? 'pause' : 'play_arrow'} />
      </IconButton>
      <StyledVoiceMessage onClick={handleVoiceMessageClick} id={id}>
        <StyledDurationBar
          style={{ transform: `translateX(${(currentTime / duration) * 100}%)` }}
        ></StyledDurationBar>
        <Typography>{time}</Typography>
      </StyledVoiceMessage>
    </Stack>
  );
};
