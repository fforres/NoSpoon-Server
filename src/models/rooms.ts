import { setHash } from '../redis';
import { getUniqueId } from '../utils';

export const createRoom = async (): Promise<string | boolean> => {
  const uniqueUUID = getUniqueId();
  const response = await setHash(uniqueUUID, { type: 'room' });
  if (response) {
    return uniqueUUID;
  }
  return false;
};
