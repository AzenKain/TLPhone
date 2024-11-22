export type BlogType = {
  id: number;
  isDisplay: boolean;
  title: string;
  typeBlog: string;
  content?: string;
  created_at: Date;
  updated_at: Date;
};
