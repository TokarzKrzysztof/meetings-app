import { useMemo } from 'react';
import { Box } from 'src/ui-components';
import Lightbox, { Plugin, SlideImage } from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export type PluginNames = 'Zoom' | 'Counter' | 'Thumbnails';

export type GalleryProps = {
  state: { open: boolean; index: number; slides: SlideImage[] };
  onClose: () => void;
  plugins?: PluginNames[];
};
export const Gallery = ({
  state,
  onClose,
  plugins = ['Zoom', 'Counter', 'Thumbnails'],
}: GalleryProps) => {
  const usedPlugins = useMemo(() => {
    const arr: Plugin[] = [];
    if (plugins.includes('Zoom')) arr.push(Zoom);
    if (plugins.includes('Counter')) arr.push(Counter);
    if (plugins.includes('Thumbnails')) arr.push(Thumbnails);
    return arr;
  }, [plugins]);

  return (
    <Box
      // disable long press events propagation
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Lightbox
        open={state.open}
        index={state.index}
        carousel={{ finite: state.slides.length <= 1 }}
        render={{
          buttonPrev: state.slides.length <= 1 ? () => null : undefined,
          buttonNext: state.slides.length <= 1 ? () => null : undefined,
        }}
        close={onClose}
        slides={state.slides}
        plugins={usedPlugins}
      />
    </Box>
  );
};
