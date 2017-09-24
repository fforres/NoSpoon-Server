import * as d from 'debug';
import { keyExists, setKey } from '../redis';
import nameGenerator from '../utils/nameGenerator';
const debug = d('server');

const getUniqueName = async (name: string): Promise<string> => {
  const exists = await keyExists(name);
  if (!exists) {
    debug('%s name created', name);
    return name;
  }
  debug('%s name was used, Generating new name', name);
  return getUniqueName(nameGenerator());
};

export const createRoom = async (): Promise<string | boolean> => {
  const uniqueUUID = await getUniqueName(nameGenerator());
  const response = await setKey(uniqueUUID);
  if (!response) {
    return false;
  }
  return uniqueUUID;
};
