export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  globalRole: 'student' | 'lecturer' | 'ta' | 'admin';
  status: 'active' | 'disabled' | 'pending';
};
