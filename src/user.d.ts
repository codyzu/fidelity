export type UserDoc = {
  phoneNumber?: string;
  email?: string;
  points?: number;
  admin: boolean;
};

export type User = UserDoc & {
  uid: string;
};
