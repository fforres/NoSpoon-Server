import { v4 } from 'uuid';

export const getUniqueId = () => `${v4()}_${process.hrtime().join('.')}`;
