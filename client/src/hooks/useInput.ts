import { useState } from "react";
export default function useInput(initialValue?: string) {
  const [data, setData] = useState<string>(initialValue || "");

  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  };

  return { data, handler };
}
