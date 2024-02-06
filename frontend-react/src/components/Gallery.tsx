import { Box } from 'src/ui-components';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import "yet-another-react-lightbox/plugins/counter.css";
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import "yet-another-react-lightbox/styles.css";

export type GalleryProps = {
  state: { open: boolean; index: number; slides: SlideImage[] };
  onClose: () => void;
};
export const Gallery = ({ state, onClose }: GalleryProps) => {
  return (
    <Box
      // disable long press events propagation
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Lightbox
        open={state.open}
        index={state.index}
        close={onClose}
        slides={state.slides}
        plugins={[Zoom, Counter, Thumbnails]}
      />
    </Box>
  );
};
