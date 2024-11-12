declare module 'react-mentions' {
    import * as React from 'react';
  
    export interface MentionsInputProps extends React.HTMLAttributes<HTMLDivElement> {
      value: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      placeholder?: string;
      style?: React.CSSProperties;
    }
  
    export const MentionsInput: React.FC<MentionsInputProps>;
  
    export interface MentionProps {
      trigger: string;
      data: Array<{ id: string; display: string }>;
      style?: React.CSSProperties;
    }
  
    export const Mention: React.FC<MentionProps>;
  }
  