import { atom } from "jotai";

type UserInfo = {
    userId: string | null;
    userName: string | null;
    name: string | null;
  };

export const userInfoAtom = atom<UserInfo>({
    userId: null,
    userName: null,
    name: null
});
