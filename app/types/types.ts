export type QuestionCardPreview = {
  id: number;
  title: string;
  description: string;
};

export type Question = {
  id: number;
  title: string;
  description: string;
  sample_input: string;
  sample_output: string;
};

export type QuestionTest = {
  code: string;
  sample_input: string;
  sample_output: string;
};
