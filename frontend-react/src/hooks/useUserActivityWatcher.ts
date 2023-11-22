import _ from 'lodash';
import { useEffect } from 'react';
import { useGetCurrentUser, useSendUserActivityTick } from 'src/queries/user-queries';

export const useUserActivityWatcher = () => {
  const { sendUserActivityTick } = useSendUserActivityTick();
  const { currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    const handler = _.throttle(() => sendUserActivityTick(), 15000, { trailing: false });

    const events = ['mousedown', 'mousemove', 'touchstart', 'scroll', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, handler);
    });
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handler);
      });
    };
  }, [currentUser]);
};
