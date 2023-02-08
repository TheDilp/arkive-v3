import { RandomTableType } from "../types/ItemTypes/randomTableTypes";

export function getRandomTableResult(randomTable: RandomTableType) {
  if (randomTable?.random_table_options) {
    const optionCount = randomTable.random_table_options?.length || 0;
    if (optionCount) {
      const max = optionCount - 1;
      const index = Math.floor(Math.random() * (max - 0 + 1)) + 0;
      if (typeof index === "number")
        return {
          index,
          title: randomTable.random_table_options[index].title,
          description: randomTable.random_table_options[index]?.description,
        };
    }
  }
  return null;
}
